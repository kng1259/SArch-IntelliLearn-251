package vn.edu.hcmut.intellilearn.learningservice.domain;

import vn.edu.hcmut.intellilearn.learningservice.core.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, UUID> {
    // Feedback liên kết với Course qua object 'course'
    List<Feedback> findByCourse_CourseId(UUID courseId);
}
