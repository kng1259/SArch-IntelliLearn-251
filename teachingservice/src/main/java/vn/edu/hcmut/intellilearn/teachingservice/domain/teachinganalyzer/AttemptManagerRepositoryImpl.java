package vn.edu.hcmut.intellilearn.teachingservice.domain.teachinganalyzer;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Attempt;
import vn.edu.hcmut.intellilearn.teachingservice.core.repository.AttemptRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AttemptManagerRepositoryImpl implements AttemptManagerRepository {
    private final AttemptRepository attemptRepository;

    @Override
    public List<Attempt> selectCourseAttempt(UUID courseId) {
        return attemptRepository.selectAllByCourseId(courseId);
    }
}
