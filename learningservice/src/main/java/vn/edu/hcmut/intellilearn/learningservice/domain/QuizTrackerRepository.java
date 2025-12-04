package vn.edu.hcmut.intellilearn.learningservice.domain;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.hcmut.intellilearn.learningservice.core.Quiz;

import java.util.UUID;

@Repository
public interface QuizTrackerRepository extends JpaRepository<Quiz, UUID> {
    default Quiz selectQuiz(UUID quizId) {
        return findById(quizId)
                .orElseThrow(() -> new EntityNotFoundException("Quiz not found"));
    }
}