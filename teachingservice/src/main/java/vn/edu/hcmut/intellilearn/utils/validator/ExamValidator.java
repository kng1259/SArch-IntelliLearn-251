package vn.edu.hcmut.intellilearn.utils.validator;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Course;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Exam;
import vn.edu.hcmut.intellilearn.teachingservice.core.repository.ExamRepository;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class ExamValidator {
    private final ExamRepository examRepository;
    private final CourseValidator courseValidator;

    public void validateExamOwnership(UUID tutorId, UUID examId) {
        Exam existedExam = examRepository.findById(examId).orElse(null);
        if (existedExam == null) {
            throw new AccessDeniedException("Bài thi không tồn tại");
        }
        courseValidator.validateCourseOwnership(tutorId, existedExam.getCourse().getCourseId());
    }
}
