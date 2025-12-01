package vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Quiz;
import vn.edu.hcmut.intellilearn.teachingservice.core.repository.QuizRepository;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QuizManagerRepositoryImpl implements QuizManagerRepository {
    private final QuizRepository quizRepository;

    @Override
    public void insertQuiz(Quiz quiz) {
        quizRepository.save(quiz);
    }

    @Override
    public Quiz selectQuiz(UUID quizId) {
        return quizRepository.findById(quizId).orElse(null);
    }

    @Override
    public void updateQuiz(Quiz quiz) {
        quizRepository.save(quiz);
    }

    @Override
    public void deleteQuiz(UUID quizId) {
        quizRepository.deleteById(quizId);
    }
}
