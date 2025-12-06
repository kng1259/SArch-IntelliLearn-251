package vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant;

import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Enrollment;

import java.util.List;
import java.util.UUID;

public interface TeachingAssistantEnrollmentRepository {
    public boolean isStudentEnrolled(UUID studentId , UUID courseId);
    public List<Enrollment> selectStudentEnrolled(UUID courseId);
}
