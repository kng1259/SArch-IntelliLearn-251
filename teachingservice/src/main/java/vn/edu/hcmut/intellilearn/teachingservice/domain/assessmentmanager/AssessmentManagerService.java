package vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager;

import vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager.datatype.*;

import java.util.List;
import java.util.UUID;

public interface AssessmentManagerService {
    public void createExam(UUID tutorId, ExamRequest exam);
    public List<ExamResponse> retrieveExamsByCourse(UUID courseId);
    public ExamResponse retrieveExam(UUID tutorId, UUID examId);
    public void updateExam(UUID tutorId, UUID examId, ExamUpdateRequest exam);
    public void deleteExam(UUID tutorId, UUID examId);
    public void createQuiz(UUID tutorId, QuizRequest quiz);
    public List<QuizResponse> retrieveQuizzesByCourse(UUID courseId);
    public QuizResponse retrieveQuiz(UUID tutorId, UUID quizId);
    public void updateQuiz(UUID tutorId, UUID quizId, QuizUpdateRequest quiz);
    public void deleteQuiz(UUID tutorId, UUID quizId);
    public void createAssignment(UUID tutorId, AssignmentRequest assignment);
    public List<AssignmentResponse> retrieveAssignmentsByCourse(UUID courseId);
    public AssignmentResponse retrieveAssignment(UUID tutorId, UUID assignmentId);
    public void updateAssignment(UUID tutorId, UUID assignmentId, AssignmentRequest assignment);
    public void deleteAssignment(UUID tutorId, UUID assignmentId);
    public void gradingSubmission(UUID tutorId,UUID studentId, UUID assignmentId, GradingRequest gradingRequest);
    public List<PendingSubmissionResponse> retrievePendingSubmissions(UUID tutorId);
    public List<SubmissionResponse> retrieveSubmissionsByAssignment(UUID tutorId, UUID assignmentId);
}
