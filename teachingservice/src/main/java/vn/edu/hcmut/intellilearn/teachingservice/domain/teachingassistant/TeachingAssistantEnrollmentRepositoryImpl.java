package vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Enrollment;
import vn.edu.hcmut.intellilearn.teachingservice.core.repository.EnrollmentRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TeachingAssistantEnrollmentRepositoryImpl implements TeachingAssistantEnrollmentRepository {
    private final EnrollmentRepository enrollmentRepository;
    @Override
    public boolean isStudentEnrolled(UUID studentId, UUID courseId) {
        return enrollmentRepository.existsById_StudentIdAndId_CourseId(studentId, courseId);
    }

    @Override
    public List<Enrollment> selectStudentEnrolled(UUID courseId) {
        return enrollmentRepository.findEnrollmentsByCourse_CourseId(courseId);
    }
}
