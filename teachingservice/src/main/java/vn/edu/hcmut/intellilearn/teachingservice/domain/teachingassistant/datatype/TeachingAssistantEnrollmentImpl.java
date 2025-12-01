package vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant.datatype;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.edu.hcmut.intellilearn.teachingservice.core.repository.EnrollmentRepository;
import vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant.TeachingAssistantEnrollmentRepository;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TeachingAssistantEnrollmentImpl implements TeachingAssistantEnrollmentRepository {
    private final EnrollmentRepository enrollmentRepository;
    @Override
    public boolean isStudentEnrolled(UUID studentId, UUID courseId) {
        return enrollmentRepository.existsById_StudentIdAndId_CourseId(studentId, courseId);
    }
}
