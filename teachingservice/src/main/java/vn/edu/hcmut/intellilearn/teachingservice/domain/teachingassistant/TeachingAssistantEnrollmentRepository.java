package vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant;

import java.util.UUID;

public interface TeachingAssistantEnrollmentRepository {
    public boolean isStudentEnrolled(UUID studentId , UUID courseId);
}
