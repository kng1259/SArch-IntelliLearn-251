package vn.edu.hcmut.intellilearn.teachingservice.domain.teachinganalyzer;

import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.*;
import vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager.AssignmentManagerRepository;
import vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager.SubmissionManagerRepository;
import vn.edu.hcmut.intellilearn.teachingservice.domain.teachinganalyzer.datatype.*;
import vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant.TeachingAssistantEnrollmentRepository;
import vn.edu.hcmut.intellilearn.utils.validator.CourseValidator;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class TeachingAnalyzerServiceImpl implements TeachingAnalyzerService {
    private static final Logger log = LoggerFactory.getLogger(TeachingAnalyzerServiceImpl.class);
    private final TeachingAssistantEnrollmentRepository teachingAssistantEnrollmentRepository;
    private final AttemptManagerRepository attemptRepository;
    private final SubmissionManagerRepository submissionRepository;
    private final TestManagerRepository testRepository;
    private final AssignmentManagerRepository assignmentRepository;

    private final CourseValidator courseValidator;

    @Override
    public ReportResponse retrieveCourseAnalysis(UUID tutorId, UUID courseId) {
//        courseValidator.validateCourseOwnership(tutorId, courseId);
        List<Enrollment> enrollments = teachingAssistantEnrollmentRepository.selectStudentEnrolled(courseId);
        Map<String, Integer> numStudent = new HashMap<>();
        enrollments.forEach(enrollment -> {
            LocalDateTime time = enrollment.getTimestamp();
            String milestone = time.getYear() + "/" + time.getMonthValue();
            numStudent.merge(milestone, 1, Integer::sum);
        });

        List<MonthlyStudentEnrollmentStatsResponse> monthlyStudentEnrollmentStats = numStudent.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(e -> new MonthlyStudentEnrollmentStatsResponse(e.getKey(), e.getValue()))
                .toList();

        List<Attempt> examAttempts = attemptRepository.selectExamAttempt(courseId);
        List<Attempt> quizAttempts = attemptRepository.selectQuizAttempt(courseId);
        List<Attempt> attempts = new ArrayList<>(examAttempts);
        attempts.addAll(quizAttempts);
        List<Submission> submissions = submissionRepository.selectSubmissionByCourseId(courseId);
        List<Test> tests = testRepository.selectTestByCourseId(courseId);
        List<Assignment> assignments = assignmentRepository.selectAssignmentsByCourse(courseId);

        // Tạo map để lưu attempts theo testId để dễ tra cứu
        Map<UUID, List<Attempt>> attemptsByTestId = new HashMap<>();
        for (Attempt a : attempts) {
            attemptsByTestId.computeIfAbsent(a.getTest().getId(), k -> new ArrayList<>()).add(a);
        }

        // Tạo map để lưu submissions theo assignmentId để dễ tra cứu
        Map<UUID, List<Submission>> submissionsByAssignmentId = new HashMap<>();
        for (Submission s : submissions) {
            submissionsByAssignmentId.computeIfAbsent(s.getAssignment().getId(), k -> new ArrayList<>()).add(s);
        }

        Map<UUID, Integer> completion = new HashMap<>();
        Set<String> seenTest = new HashSet<>();
        for (Attempt a : attempts) {
            String key = a.getStudentId() + "-" + a.getTest().getId();

            if (seenTest.contains(key)) {
                continue;
            }

            seenTest.add(key);
            completion.merge(a.getStudentId(), 1, Integer::sum);
        }
        Set<String> seenAssignment = new HashSet<>();
        for (Submission s : submissions) {
            String key = s.getId().getStudentId() + "-" + s.getAssignment().getId();
            if (seenAssignment.contains(key)) {
                continue;
            }

            seenAssignment.add(key);
            completion.merge(s.getId().getStudentId(), 1, Integer::sum);
        }

        // Xử lý assignments: lấy tất cả assignments trong course
        List<AssignmentAnalysisResponse> assignmentAnalysisResponses = new ArrayList<>();
        for (Assignment assignment : assignments) {
            List<Submission> assignmentSubmissions = submissionsByAssignmentId.getOrDefault(assignment.getId(),
                    new ArrayList<>());

            AssignmentStats stats = new AssignmentStats();
            stats.setId(assignment.getId());

            for (Submission s : assignmentSubmissions) {
                if (s.getScore() == 0) {
                    stats.setTotalPending(stats.getTotalPending() + 1);
                }
                stats.setTotalSubmitted(stats.getTotalSubmitted() + 1);
                stats.setSumScore(stats.getSumScore() + s.getScore());
            }

            int totalSubmitted = stats.getTotalSubmitted();
            int totalPending = stats.getTotalPending();
            int totalGraded = totalSubmitted - totalPending;
            float avgScore = totalGraded == 0 ? 0 : stats.getSumScore() / totalGraded;

            assignmentAnalysisResponses.add(
                    AssignmentAnalysisResponse.builder()
                            .id(assignment.getId())
                            .name(assignment.getName())
                            .avgScore(Math.round(avgScore))
                            .totalPending(totalPending)
                            .totalSubmitted(totalSubmitted)
                            .build());
        }

        long sumWorkload = tests.size() + assignments.size();
        long inProgress = 0;
        long completed = 0;
        for (var entry : completion.entrySet()) {
            if (entry.getValue() < sumWorkload) {
                inProgress++;
            } else if (entry.getValue() == sumWorkload) {
                completed++;
            }
        }

        int numStudentEnrolled = enrollments.size();

        var courseAnalysis = CourseAnalysisResponse.builder()
                .totalStudents(numStudentEnrolled)
                .courseCompletionResponse(
                        CourseCompletionResponse.builder()
                                .completed(completed)
                                .inProgress(inProgress)
                                .notStarted(numStudentEnrolled - (completed + inProgress))
                                .build())
                .avgCompletionPercentage(
                        numStudentEnrolled == 0 ? 0 : Math.round(((double) completed / numStudentEnrolled) * 100))
                .monthlyStudentEnrollmentStats(monthlyStudentEnrollmentStats)
                .build();

        // Xử lý quizzes: lấy tất cả quiz tests trong course
        List<QuizAnalysisResponse> quizAnalysisResponseList = new ArrayList<>();
        for (Test test : tests) {
            if (test.getQuiz() != null) {
                List<Attempt> quizAttemptsForTest = attemptsByTestId.getOrDefault(test.getId(), new ArrayList<>());
                QuizStats stats = calculateQuizStats(quizAttemptsForTest);

                int total = stats.getTotal();
                float avgScore = total == 0 ? 0 : stats.getSumScore() / total;
                float passRate = total == 0 ? 0 : ((float) stats.getPassCount() / total) * 100;

                quizAnalysisResponseList.add(
                        QuizAnalysisResponse.builder()
                                .id(test.getId())
                                .name(test.getName())
                                .avgScore(Math.round(avgScore))
                                .passRate(Math.round(passRate))
                                .totalAttempts(total)
                                .build());
            }
        }

        // Xử lý exams: lấy tất cả exam tests trong course
        List<ExamAnalysisResponse> examAnalysisResponseList = new ArrayList<>();
        for (Test test : tests) {
            if (test.getExam() != null) {
                List<Attempt> examAttemptsForTest = attemptsByTestId.getOrDefault(test.getId(), new ArrayList<>());
                ExamStats stats = calculateExamStats(examAttemptsForTest);

                int total = stats.getTotal();
                float avgScore = total == 0 ? 0 : stats.getSumScore() / total;
                float passRate = total == 0 ? 0 : ((float) stats.getPassCount() / total) * 100;

                examAnalysisResponseList.add(
                        ExamAnalysisResponse.builder()
                                .id(test.getId())
                                .name(test.getName())
                                .avgScore(Math.round(avgScore))
                                .passRate(Math.round(passRate))
                                .totalStudents(total)
                                .build());
            }
        }

        return ReportResponse.builder()
                .courseAnalysis(courseAnalysis)
                .quizAnalysis(quizAnalysisResponseList)
                .examAnalysis(examAnalysisResponseList)
                .assignmentAnalysis(assignmentAnalysisResponses)
                .build();
    }

    @NotNull
    private static QuizStats calculateQuizStats(List<Attempt> quizAttempts) {
        QuizStats stats = new QuizStats();
        for (Attempt a : quizAttempts) {
            float score = a.getScore();
            boolean pass = score > 50;
            stats.setTotal(stats.getTotal() + 1);
            stats.setSumScore(stats.getSumScore() + score);
            if (pass) {
                stats.setPassCount(stats.getPassCount() + 1);
            }
        }
        return stats;
    }

    @NotNull
    private static ExamStats calculateExamStats(List<Attempt> examAttempts) {
        ExamStats stats = new ExamStats();
        for (Attempt a : examAttempts) {
            float score = a.getScore();
            boolean pass = score > 50;
            stats.setTotal(stats.getTotal() + 1);
            stats.setSumScore(stats.getSumScore() + score);
            if (pass) {
                stats.setPassCount(stats.getPassCount() + 1);
            }
        }
        return stats;
    }
}
