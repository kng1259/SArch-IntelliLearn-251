package vn.edu.hcmut.intellilearn.utils.mapper;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Quiz;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Test;
import vn.edu.hcmut.intellilearn.teachingservice.core.repository.LevelRepository;
import vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager.datatype.QuizUpdateRequest;

@Mapper(componentModel = "spring")
public abstract class QuizMapper {
    @Autowired
    protected TestMapper testMapper;

    @Autowired
    protected LevelRepository levelRepository;

    @Mapping(target="test", ignore = true)
    public abstract void updateQuiz(QuizUpdateRequest quiz, @MappingTarget Quiz quizEntity);

    @AfterMapping
    protected void updateTestRel(QuizUpdateRequest dto, @MappingTarget Quiz entity) {
        if (entity.getTest() == null) {
            Test newTest = new Test();
            entity.setTest(newTest);
            newTest.setQuiz(entity);
        }
        entity.setLevelCodename(levelRepository.findById(dto.getLevel()).orElse(entity.getLevelCodename()));
        testMapper.updateTest(dto, entity.getTest());
    }
}
