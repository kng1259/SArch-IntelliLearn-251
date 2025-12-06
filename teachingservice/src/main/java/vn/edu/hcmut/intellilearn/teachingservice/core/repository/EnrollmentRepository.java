package vn.edu.hcmut.intellilearn.teachingservice.core.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Course;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Enrollment;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.EnrollmentId;

import java.util.List;
import java.util.UUID;

public interface EnrollmentRepository extends JpaRepository<Enrollment, EnrollmentId> {

    boolean existsById_StudentIdAndId_CourseId(UUID studentId, UUID courseId);

    List<Enrollment> findByCourse(Course course);

    List<Enrollment> findEnrollmentsByCourse_CourseId(UUID courseCourseId);
}
