package vn.edu.hcmut.intellilearn.utils.mapper;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Option;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.OptionId;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Question;
import vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager.datatype.OptionRequest;
import vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager.datatype.QuestionRequest;
import vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager.datatype.QuestionResponse;
import vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager.datatype.QuestionUpdateRequest;

import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {OptionMapper.class}, imports = UUID.class)
public abstract class QuestionMapper {
    @Autowired
    protected OptionMapper optionMapper;
    @Mapping(target = "id", expression = "java(UUID.randomUUID())")
    public abstract Question toQuestion(QuestionRequest questionRequest);
    @Mapping(target = "id", expression = "java(UUID.randomUUID())")
    @Mapping(target = "test", ignore = true)
    @Mapping(target = "options", ignore = true)
    public abstract Question toQuestion(QuestionUpdateRequest questionUpdateRequest);
    public abstract QuestionResponse toQuestionResponse(Question question);
    @Mapping(target = "test", ignore = true)
    @Mapping(target = "options", ignore = true) // Tự xử lý list option
    public abstract void updateQuestion(QuestionUpdateRequest dto, @MappingTarget Question entity);

    @AfterMapping
    public void updateOptions(QuestionUpdateRequest dto, @MappingTarget Question entity) {
        if (dto.getOptions() == null) return;

        Map<OptionId, Option> existingOptions = entity.getOptions().stream()
                .collect(Collectors.toMap(Option::getId, o -> o));

        for (var oDto : dto.getOptions()) {
            OptionId oId = new OptionId(entity.getId(), oDto.getOrder());

            if (existingOptions.containsKey(oId)) {
                optionMapper.updateOption(oDto, existingOptions.get(oId));
            } else {
                Option newOption = optionMapper.toOption(oDto);
                newOption.setId(oId);
                newOption.setQuestion(entity);
                entity.getOptions().add(newOption);
            }
        }

        Set<OptionId> validIds = dto.getOptions().stream()
                .map(req -> {
                    return new OptionId(entity.getId(), req.getOrder());
                })
                .collect(Collectors.toSet());

        entity.getOptions().removeIf(option -> {
            return option.getId() != null && !validIds.contains(option.getId());
        });
    }
}
