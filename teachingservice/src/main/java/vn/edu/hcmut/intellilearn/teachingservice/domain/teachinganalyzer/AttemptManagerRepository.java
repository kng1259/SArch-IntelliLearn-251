package vn.edu.hcmut.intellilearn.teachingservice.domain.teachinganalyzer;

import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Attempt;

import java.util.List;
import java.util.UUID;

public interface AttemptManagerRepository {
    public List<Attempt> selectExamAttempt(UUID courseId);
    public List<Attempt> selectQuizAttempt(UUID courseId);
}
