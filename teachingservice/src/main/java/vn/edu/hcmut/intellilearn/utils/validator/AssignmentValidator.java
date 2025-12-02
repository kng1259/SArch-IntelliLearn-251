package vn.edu.hcmut.intellilearn.utils.validator;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Assignment;
import vn.edu.hcmut.intellilearn.teachingservice.core.repository.AssignmentRepository;

import java.nio.file.AccessDeniedException;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class AssignmentValidator {
    private final CourseValidator courseValidator;
    private final AssignmentRepository assignmentRepository;

    public void validateAssignmentOwnership(UUID tutorId, UUID assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId).orElse(null);
        if (assignment == null) {
            throw new org.springframework.security.access.AccessDeniedException("Assignment not found");
        }
        courseValidator.validateCourseOwnership(tutorId, assignment.getCourse().getCourseId());
    }
}
