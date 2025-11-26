package vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.edu.hcmut.intellilearn.teachingservice.core.Feedback;

@Service
@RequiredArgsConstructor
public class TeachingAssistantFeedbackRepositoryImpl implements TeachingAssistantFeedbackRepository {
    private final FeedbackRepository feedbackRepository;

    @Override
    public void insertFeedback(Feedback feedback) {
        feedbackRepository.save(feedback);
    }
}
