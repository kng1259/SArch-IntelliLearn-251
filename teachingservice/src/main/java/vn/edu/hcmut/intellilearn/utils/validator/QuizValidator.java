package vn.edu.hcmut.intellilearn.utils.validator;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Quiz;
import vn.edu.hcmut.intellilearn.teachingservice.core.repository.QuizRepository;

import java.util.UUID;
@Component
@RequiredArgsConstructor
public class QuizValidator {
    private final QuizRepository quizRepository;
    private final CourseValidator courseValidator;

    public void validateExamOwnership(UUID tutorId, UUID examId) {
        Quiz existedQuiz = quizRepository.findById(examId).orElse(null);
        if (existedQuiz == null) {
            throw new AccessDeniedException("Bài quiz không tồn tại");
        }
        courseValidator.validateCourseOwnership(tutorId, existedQuiz.getCourse().getCourseId());
    }
}
