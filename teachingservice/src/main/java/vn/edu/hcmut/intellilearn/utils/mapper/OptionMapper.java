package vn.edu.hcmut.intellilearn.utils.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Option;
import vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager.datatype.OptionRequest;

import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring")
public interface OptionMapper {
    Option toOption(OptionRequest optionRequest);
    @Mapping(source = "id.order", target = "order")
    OptionRequest toOptionRequest(Option option);
    List<OptionRequest> toDtoList(Set<Option> list);
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "question", ignore = true)
    @Mapping(target = "id.order", source = "order")
    void updateOption(OptionRequest dto, @MappingTarget Option entity);
}
