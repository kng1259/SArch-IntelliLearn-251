package vn.edu.hcmut.intellilearn.teachingservice.core.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Exam;

import java.util.Optional;
import java.util.UUID;

public interface ExamRepository extends JpaRepository<Exam, UUID> {
    @Query("""
        SELECT e FROM Exam e
        LEFT JOIN FETCH e.test t
        LEFT JOIN FETCH t.questions q
        LEFT JOIN FETCH q.options o
        WHERE e.id = :id
    """)
    Optional<Exam> findDetailById(UUID id);
}
