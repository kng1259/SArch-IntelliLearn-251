package vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.hcmut.intellilearn.teachingservice.core.Course;
import vn.edu.hcmut.intellilearn.teachingservice.core.Enrollment;
import vn.edu.hcmut.intellilearn.teachingservice.core.EnrollmentId;

import java.util.List;
import java.util.UUID;

public interface EnrollmentRepository extends JpaRepository<Enrollment, EnrollmentId> {

    boolean existsById_StudentIdAndId_CourseId(UUID studentId, UUID courseId);

    List<Enrollment> findByCourse(Course course);
}
