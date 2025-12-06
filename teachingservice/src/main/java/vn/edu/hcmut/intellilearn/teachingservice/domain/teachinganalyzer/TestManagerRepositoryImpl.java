package vn.edu.hcmut.intellilearn.teachingservice.domain.teachinganalyzer;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Test;
import vn.edu.hcmut.intellilearn.teachingservice.core.repository.TestRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TestManagerRepositoryImpl implements TestManagerRepository {
    private final TestRepository testRepository;

    @Override
    public List<Test> selectTestByCourseId(UUID courseId) {
        return testRepository.findAllByCourseId(courseId);
    }
}
