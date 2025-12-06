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
import vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant.TeachingAssistantStudentRepository;
import vn.edu.hcmut.intellilearn.utils.validator.CourseValidator;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeachingAnalyzerServiceImpl implements TeachingAnalyzerService {
    private static final Logger log = LoggerFactory.getLogger(TeachingAnalyzerServiceImpl.class);
    private final TeachingAssistantEnrollmentRepository teachingAssistantEnrollmentRepository;
    private final AttemptManagerRepository attemptRepository;
    private final SubmissionManagerRepository submissionRepository;
    private final TestManagerRepository testRepository;
    private final AssignmentManagerRepository assignmentRepository;
    private final TeachingAssistantStudentRepository studentRepository;

    private final CourseValidator courseValidator;

    @Override
    public ReportResponse retrieveCourseAnalysis(UUID tutorId, UUID courseId) {
        // courseValidator.validateCourseOwnership(tutorId, courseId);
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

        // Tính study time
        StudyTimeAnalysisResponse studyTimeAnalysis = calculateStudyTimeAnalysis(
                courseId, attempts, submissions);

        return ReportResponse.builder()
                .courseAnalysis(courseAnalysis)
                .quizAnalysis(quizAnalysisResponseList)
                .examAnalysis(examAnalysisResponseList)
                .assignmentAnalysis(assignmentAnalysisResponses)
                .studyTimeAnalysis(studyTimeAnalysis)
                .build();
    }

    private StudyTimeAnalysisResponse calculateStudyTimeAnalysis(
            UUID courseId, List<Attempt> attempts, List<Submission> submissions) {
        // Lấy danh sách students trong course
        List<Student> students = studentRepository.selectCourseStudents(courseId);
        Map<UUID, String> studentNameMap = students.stream()
                .collect(Collectors.toMap(Student::getId, Student::getFullName));

        // Tính study time từ attempts (endAt - startAt)
        Map<UUID, Long> studentStudyTimeMinutes = new HashMap<>();
        Map<String, Long> weeklyStudyTimeMinutes = new HashMap<>();

        for (Attempt attempt : attempts) {
            if (attempt.getEndAt() != null && attempt.getStartAt() != null) {
                long minutes = java.time.Duration.between(
                        attempt.getStartAt(), attempt.getEndAt()).toMinutes();
                if (minutes > 0) {
                    studentStudyTimeMinutes.merge(attempt.getStudentId(), minutes, Long::sum);

                    // Thống kê theo tuần
                    LocalDateTime startDateTime = LocalDateTime.ofInstant(
                            attempt.getStartAt(), ZoneId.systemDefault());
                    String weekKey = getWeekKey(startDateTime);
                    weeklyStudyTimeMinutes.merge(weekKey, minutes, Long::sum);
                }
            }
        }

        // Tính study time từ submissions (ước tính: mỗi submission = 30 phút)
        // Hoặc có thể dùng thời gian tạo submission để tính
        final long ESTIMATED_SUBMISSION_MINUTES = 30;
        for (Submission submission : submissions) {
            UUID studentId = submission.getId().getStudentId();
            studentStudyTimeMinutes.merge(studentId, ESTIMATED_SUBMISSION_MINUTES, Long::sum);

            // Thống kê theo tuần
            LocalDateTime submissionDateTime = submission.getCreatedAt();
            String weekKey = getWeekKey(submissionDateTime);
            weeklyStudyTimeMinutes.merge(weekKey, ESTIMATED_SUBMISSION_MINUTES, Long::sum);
        }

        // Tạo weekly stats
        List<WeeklyStudyTimeStatsResponse> weeklyStats = weeklyStudyTimeMinutes.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(e -> WeeklyStudyTimeStatsResponse.builder()
                        .week(e.getKey())
                        .totalMinutes(e.getValue())
                        .build())
                .toList();

        // Tạo bảng xếp hạng
        List<StudentStudyTimeRankingResponse> rankings = studentStudyTimeMinutes.entrySet().stream()
                .map(e -> {
                    UUID studentId = e.getKey();
                    String studentName = studentNameMap.getOrDefault(studentId, "Unknown");
                    return StudentStudyTimeRankingResponse.builder()
                            .studentId(studentId)
                            .studentName(studentName)
                            .totalMinutes(e.getValue())
                            .build();
                })
                .sorted((a, b) -> Long.compare(b.getTotalMinutes(), a.getTotalMinutes()))
                .collect(Collectors.toList());

        // Thêm rank cho rankings (từ cao xuống thấp)
        for (int i = 0; i < rankings.size(); i++) {
            rankings.get(i).setRank(i + 1);
        }

        // Top 5 học nhiều nhất
        List<StudentStudyTimeRankingResponse> top5MostStudied = rankings.stream()
                .limit(5)
                .toList();

        // Top 5 học ít nhất (sort lại và thêm rank từ 1-5)
        List<StudentStudyTimeRankingResponse> top5LeastStudied = studentStudyTimeMinutes.entrySet().stream()
                .map(e -> {
                    UUID studentId = e.getKey();
                    String studentName = studentNameMap.getOrDefault(studentId, "Unknown");
                    return StudentStudyTimeRankingResponse.builder()
                            .studentId(studentId)
                            .studentName(studentName)
                            .totalMinutes(e.getValue())
                            .build();
                })
                .sorted((a, b) -> Long.compare(a.getTotalMinutes(), b.getTotalMinutes()))
                .limit(5)
                .collect(Collectors.toList());

        // Thêm rank cho top 5 ít nhất (từ 1-5)
        for (int i = 0; i < top5LeastStudied.size(); i++) {
            top5LeastStudied.get(i).setRank(i + 1);
        }

        // Tính tổng study time
        long totalStudyTimeMinutes = studentStudyTimeMinutes.values().stream()
                .mapToLong(Long::longValue)
                .sum();

        return StudyTimeAnalysisResponse.builder()
                .weeklyStats(weeklyStats)
                .top5MostStudied(top5MostStudied)
                .top5LeastStudied(top5LeastStudied)
                .totalStudyTimeMinutes(totalStudyTimeMinutes)
                .build();
    }

    private String getWeekKey(LocalDateTime dateTime) {
        int year = dateTime.getYear();
        WeekFields weekFields = WeekFields.ISO;
        int week = dateTime.get(weekFields.weekOfWeekBasedYear());
        return String.format("%d-W%02d", year, week);
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
