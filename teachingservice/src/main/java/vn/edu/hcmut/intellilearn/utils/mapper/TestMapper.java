package vn.edu.hcmut.intellilearn.utils.mapper;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Option;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.OptionId;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Question;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Test;
import vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager.datatype.*;

import java.util.*;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public abstract class TestMapper {
    @Autowired
    protected QuestionMapper questionMapper;
    @Autowired
    protected OptionMapper optionMapper;

    public abstract Test toTest(ExamRequest examRequest);
    public abstract Test toTest(QuizRequest quizRequest);

    @Mapping(target = "questions", ignore = true)
    public abstract void updateTest(ExamUpdateRequest dto, @MappingTarget Test entity);

    @Mapping(target = "questions", ignore = true)
    public abstract void updateTest(QuizUpdateRequest dto, @MappingTarget Test entity);


    @AfterMapping
    public void updateQuestions(TestUpdateRequest dto, @MappingTarget Test entity) {
        if (dto.getQuestions() == null) return;

        // DELETE logic...
        Set<UUID> dtoIds = dto.getQuestions().stream()
                .map(QuestionUpdateRequest::getId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Map<UUID, Question> existingQuestions = entity.getQuestions().stream()
                .collect(Collectors.toMap(Question::getId, q -> q));

        Set<UUID> needRemoveIds = entity.getQuestions().stream()
                .map(Question::getId)
                .filter(Objects::nonNull)
                .filter(id -> !dtoIds.contains(id))
                .collect(Collectors.toSet());


        for (var qDto : dto.getQuestions()) {
            if (qDto.getId() != null && existingQuestions.containsKey(qDto.getId())) {
                questionMapper.updateQuestion(qDto, existingQuestions.get(qDto.getId()));
            } else {
                Question newQ = questionMapper.toQuestion(qDto);
                newQ.setTest(entity);
                entity.getQuestions().add(newQ);
            }
        }

        entity.getQuestions().removeIf(existingQ ->
                existingQ.getId() != null && needRemoveIds.contains(existingQ.getId())
        );
    }
}
