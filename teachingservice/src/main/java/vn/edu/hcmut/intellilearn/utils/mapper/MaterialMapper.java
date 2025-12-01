package vn.edu.hcmut.intellilearn.utils.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Material;
import vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant.datatype.LearningMaterialRequest;
import vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant.datatype.LearningMaterialResponse;

@Mapper(componentModel = "spring")
public interface MaterialMapper {
    @Mapping(target="content", ignore = true)
    Material toMaterial(LearningMaterialRequest learningMaterialRequest);
    @Mapping(source = "course.courseId", target = "courseId")
    LearningMaterialResponse toLearningMaterialResponse(Material material);
}
