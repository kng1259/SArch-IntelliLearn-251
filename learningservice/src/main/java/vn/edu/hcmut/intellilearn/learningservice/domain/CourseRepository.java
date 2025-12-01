package vn.edu.hcmut.intellilearn.learningservice.domain;

import vn.edu.hcmut.intellilearn.learningservice.core.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {
    // Để gợi ý khóa học, ta lấy 5 khóa mới nhất
    List<Course> findTop5ByOrderByCreatedAtDesc();
}
