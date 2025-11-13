package vn.edu.hcmut.intellilearn.learningservice.domain.learningmanager;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
class LearningManagerServiceImpl implements LearningManagerService {
    private final LearningManagerCourseRepository courseRepository;
}