package vn.edu.hcmut.intellilearn.learningservice.domain;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.hcmut.intellilearn.learningservice.core.Exam;

import java.util.UUID;

@Repository
public interface ExamTrackerRepository extends JpaRepository<Exam, UUID> {
    default Exam selectExam(UUID examId) {
        return findById(examId)
                .orElseThrow(() -> new EntityNotFoundException("Exam not found"));
    }
}
