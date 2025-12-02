package vn.edu.hcmut.intellilearn.utils.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Assignment;
import vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager.datatype.AssignmentRequest;
import vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager.datatype.AssignmentResponse;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface AssignmentMapper {
    @Mapping(target="gradingGuidelines", ignore = true)
    @Mapping(target="instruction", ignore = true)
    Assignment toAssignment(AssignmentRequest assignmentRequest);

    AssignmentResponse toAssignmentResponse(Assignment assignment);

    @Mapping(target="gradingGuidelines", ignore = true)
    @Mapping(target="instruction", ignore = true)
    @Mapping(target="course", ignore = true)
    void updateAssignment(AssignmentRequest assignmentRequest, @MappingTarget Assignment assignment);
}
