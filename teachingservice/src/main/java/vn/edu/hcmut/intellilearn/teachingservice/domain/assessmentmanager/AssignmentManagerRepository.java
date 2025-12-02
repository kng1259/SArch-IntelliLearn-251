package vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager;

import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Assignment;

import java.util.List;
import java.util.UUID;

public interface AssignmentManagerRepository {
    public void insertAssignment(Assignment assignment);
    public List<Assignment> selectAssignmentsByCourse(UUID courseId);
    public Assignment selectAssignment(UUID assignmentId);
    public void updateAssignment(Assignment assignment);
    public void deleteAssignment(UUID assignmentId);
}
