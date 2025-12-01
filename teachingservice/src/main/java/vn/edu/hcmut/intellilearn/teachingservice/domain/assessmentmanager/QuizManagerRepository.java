package vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager;

import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Quiz;

import java.util.UUID;

public interface QuizManagerRepository {
    public void insertQuiz(Quiz quiz);
    public Quiz selectQuiz(UUID quizId);
    public void updateQuiz(Quiz quiz);
    public void deleteQuiz(UUID quizId);
}
