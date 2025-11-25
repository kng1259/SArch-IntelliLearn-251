package vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant;

import vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant.datatype.CourseRequest;
import vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant.datatype.CourseResponse;
import vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant.datatype.FeedbackRequest;

import java.util.List;
import java.util.UUID;

public interface TeachingAssistantService {
    public CourseResponse createCourse(UUID tutorId, CourseRequest course);
    public List<CourseResponse> retrieveTutorCourses (UUID tutorId);
    public CourseResponse updateCourse(UUID tutorId, UUID courseId,CourseRequest course);
    public FeedbackRequest createFeedback(UUID tutorId, FeedbackRequest feedbackRequest);
}
