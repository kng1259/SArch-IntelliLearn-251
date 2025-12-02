package vn.edu.hcmut.intellilearn.teachingservice.core.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Quiz;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface QuizRepository extends JpaRepository<Quiz, UUID> {
    @Query("""
        SELECT e FROM Quiz e
        LEFT JOIN FETCH e.test t
        LEFT JOIN FETCH t.questions q
        LEFT JOIN FETCH q.options o
        WHERE e.id = :id
    """)
    Optional<Quiz> findDetailById(UUID id);

    List<Quiz> findByCourse_CourseId(UUID courseId);
}