package vn.edu.hcmut.intellilearn.utils.validator;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Course;
import vn.edu.hcmut.intellilearn.teachingservice.core.repository.CourseRepository;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class CourseValidator {

    private final CourseRepository courseRepository;

    public void validateCourseOwnership(UUID tutorId, UUID courseId) {
        boolean exists = courseRepository.existsByCourseIdAndTutorId(courseId, tutorId);

        if (!exists) {
            throw new AccessDeniedException("Bạn không sở hữu khóa học này hoặc khóa học không tồn tại!");
        }
    }

    public Course getCourseIfOwned(UUID tutorId, UUID courseId) {
        return courseRepository.findByCourseIdAndTutorId(courseId, tutorId)
                .orElseThrow(() -> new AccessDeniedException("Khóa học không hợp lệ"));
    }
}
