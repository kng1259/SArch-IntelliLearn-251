package vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant;

import vn.edu.hcmut.intellilearn.teachingservice.core.Feedback;

public interface TeachingAssistantFeedbackRepository {
    public void insertFeedback(Feedback feedback);
}
