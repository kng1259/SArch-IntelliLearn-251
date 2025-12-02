package vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Assignment;
import vn.edu.hcmut.intellilearn.teachingservice.core.repository.AssignmentRepository;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AssignmentManagerRepositoryImpl implements AssignmentManagerRepository {
    private final AssignmentRepository assignmentRepository;

    @Override
    public void insertAssignment(Assignment assignment) {
        assignmentRepository.save(assignment);
    }

    @Override
    public Assignment selectAssignment(UUID assignmentId) {
        return assignmentRepository.findById(assignmentId).orElse(null);
    }

    @Override
    public void updateAssignment(Assignment assignment) {
        assignmentRepository.save(assignment);
    }

    @Override
    public void deleteAssignment(UUID assignmentId) {
        assignmentRepository.deleteById(assignmentId);
    }
}
