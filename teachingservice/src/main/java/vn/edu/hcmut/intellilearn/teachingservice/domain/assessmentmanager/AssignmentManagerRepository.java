package vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager;

import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Assignment;

import java.util.UUID;

public interface AssignmentManagerRepository {
    public void insertAssignment(Assignment assignment);
    public Assignment selectAssignment(UUID assignmentId);
    public void updateAssignment(Assignment assignment);
    public void deleteAssignment(UUID assignmentId);
}
