package vn.edu.hcmut.intellilearn.teachingservice.domain.teachinganalyzer;


import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.*;
import vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager.AssignmentManagerRepository;
import vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager.SubmissionManagerRepository;
import vn.edu.hcmut.intellilearn.teachingservice.domain.teachinganalyzer.datatype.CourseAnalysisResponse;
import vn.edu.hcmut.intellilearn.teachingservice.domain.teachinganalyzer.datatype.CourseCompletionResponse;
import vn.edu.hcmut.intellilearn.teachingservice.domain.teachinganalyzer.datatype.MonthlyStudentEnrollmentStatsResponse;
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
    private final SubmissionManagerRepository  submissionRepository;
    private final TestManagerRepository testRepository;
    private final AssignmentManagerRepository  assignmentRepository;

    private final CourseValidator courseValidator;
    @Override
    public CourseAnalysisResponse retrieveCourseAnalysis(UUID tutorId, UUID courseId){
        courseValidator.validateCourseOwnership(tutorId, courseId);
        List<Enrollment> enrollments = teachingAssistantEnrollmentRepository.selectStudentEnrolled(courseId);
        Map<String, Integer> numStudent = new HashMap<>();
        enrollments.forEach(enrollment -> {
             LocalDateTime time  = enrollment.getTimestamp();
            String milestone = time.getYear() + "/" + time.getMonthValue();
            numStudent.merge(milestone, 1, Integer::sum);
        });

        List<MonthlyStudentEnrollmentStatsResponse> monthlyStudentEnrollmentStats = numStudent.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(e -> new MonthlyStudentEnrollmentStatsResponse(e.getKey(), e.getValue()))
                .toList();

        List<Attempt> attempts = attemptRepository.selectCourseAttempt(courseId);
        List<Submission> submissions = submissionRepository.selectSubmissionByCourseId(courseId);
        List<Test> tests = testRepository.selectTestByCourseId(courseId);
        List<Assignment> assignments = assignmentRepository.selectAssignmentsByCourse(courseId);

        Map<UUID,Integer> completion = new HashMap<>();
        attempts.forEach(attempt -> {
            completion.merge(attempt.getStudentId(), 1, Integer::sum);
        });
        submissions.forEach(submission -> {
            completion.merge(submission.getId().getStudentId(),  1, Integer::sum);
        });

        long sumWorkload= tests.size() + assignments.size();
        long inProgess = 0;
        long completed = 0;
        for(var entry: completion.entrySet()){
            if(entry.getValue() < sumWorkload){
                inProgess++;
            }
            else if(entry.getValue()==sumWorkload){
                completed++;
            }
        }
//        log.info("done: {}", done);

//        log.info("sum: {}", sumWorkload);


        int numStudentEnrolled =enrollments.size();

        return CourseAnalysisResponse.builder()
                .totalStudents(numStudentEnrolled)
                .courseCompletionResponse(
                        CourseCompletionResponse.builder()
                                .completed(completed)
                                .inProgress(inProgess)
                                .notStarted(numStudentEnrolled - (completed +  inProgess))
                                .build()
                )
                .avgCompletionPercentage(
                        Math.round(((double) completed / numStudentEnrolled) * 100)
                )
                .monthlyStudentEnrollmentStats(monthlyStudentEnrollmentStats)
                .build();
    }
}
