package vn.edu.hcmut.intellilearn.learningservice.domain;

import vn.edu.hcmut.intellilearn.learningservice.core.Enrollment;
import vn.edu.hcmut.intellilearn.learningservice.core.EnrollmentId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, EnrollmentId> {
    boolean existsById(EnrollmentId id);
    boolean existsById_StudentIdAndId_CourseId(UUID studentId, UUID courseId);
}
