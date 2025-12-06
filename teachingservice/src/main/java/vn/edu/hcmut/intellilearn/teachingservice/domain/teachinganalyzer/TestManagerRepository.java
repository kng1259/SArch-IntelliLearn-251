package vn.edu.hcmut.intellilearn.teachingservice.domain.teachinganalyzer;

import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Test;

import java.util.List;
import java.util.UUID;

public interface TestManagerRepository {
    public List<Test> selectTestByCourseId(UUID courseId);
}
