package vn.edu.hcmut.intellilearn.teachingservice.core.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Course;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CourseRepository extends JpaRepository<Course, UUID> {
    List<Course> findAllByTutorId(UUID tutorId);

    boolean existsByCourseIdAndTutorId(UUID courseId, UUID tutorId);

    Optional<Course> findByCourseIdAndTutorId(UUID courseId, UUID tutorId);
}
