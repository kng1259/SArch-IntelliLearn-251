package vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.hcmut.intellilearn.teachingservice.core.Course;

import java.util.List;
import java.util.UUID;

public interface CourseRepository extends JpaRepository<Course, UUID> {
    List<Course> findAllByTutorId(UUID tutorId);
}
