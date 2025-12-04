package vn.edu.hcmut.intellilearn.learningservice.domain.assessmenttracker;

import vn.edu.hcmut.intellilearn.learningservice.domain.datatype.*;

import java.io.File;
import java.util.UUID;

public interface AssessmentTrackerService {
    AssignmentResponse retrieveAssignment(UUID studentId, UUID assignmentId);

    File retrieveAssignmentInstruction(UUID studentId, UUID assignmentId);

    void submitAssignment(UUID studentId, SubmissionRequest submission);

    QuizResponse enterQuiz(UUID studentId, UUID quizId);

    ExamResponse enterExam(UUID studentId, UUID examId);

    void submitTest(UUID studentId, AttemptRequest attempt);
}
