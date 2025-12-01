package vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager;

import jakarta.transaction.Transactional;
import vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager.datatype.*;

import java.util.UUID;

public interface AssessmentManagerService {
    public void createExam(UUID tutorId, ExamRequest exam);
    public ExamResponse retrieveExam(UUID tutorId, UUID examId);
    public void updateExam(UUID tutorId, UUID examId, ExamUpdateRequest exam);
    public void deleteExam(UUID tutorId, UUID examId);
    public void createQuiz(UUID tutorId, QuizRequest quiz);
    public QuizResponse retrieveQuiz(UUID tutorId, UUID quizId);
    public void updateQuiz(UUID tutorId, UUID quizId, QuizUpdateRequest quiz);
    public void deleteQuiz(UUID tutorId, UUID quizId);

}
