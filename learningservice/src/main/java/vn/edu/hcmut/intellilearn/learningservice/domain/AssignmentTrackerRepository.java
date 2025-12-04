package vn.edu.hcmut.intellilearn.learningservice.domain;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.hcmut.intellilearn.learningservice.core.Assignment;

import java.util.UUID;

public interface AssignmentTrackerRepository extends JpaRepository<Assignment, UUID> {
    default Assignment selectAssignment(UUID assignmentId) {
        return findById(assignmentId)
                .orElseThrow(() -> new EntityNotFoundException("Assignment not found"));
    }
}
