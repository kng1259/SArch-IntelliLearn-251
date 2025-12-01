package vn.edu.hcmut.intellilearn.utils.mapper;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Exam;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Test;
import vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager.datatype.ExamUpdateRequest;

@Mapper(componentModel = "spring")
public abstract class ExamMapper {

    @Autowired
    protected TestMapper testMapper;

    @Mapping(target = "test", ignore = true)
    public abstract void updateExam(ExamUpdateRequest dto, @MappingTarget Exam entity);

    @AfterMapping
    protected void updateTestRel(ExamUpdateRequest dto, @MappingTarget Exam entity) {
        if (entity.getTest() == null) {
            Test newTest = new Test();
            entity.setTest(newTest);
            newTest.setExam(entity);
        }
        testMapper.updateTest(dto, entity.getTest());
    }
}