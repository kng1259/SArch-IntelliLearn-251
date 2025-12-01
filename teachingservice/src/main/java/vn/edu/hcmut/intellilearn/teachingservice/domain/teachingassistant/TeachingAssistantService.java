package vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant;

import vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant.datatype.*;

import java.util.List;
import java.util.UUID;

public interface TeachingAssistantService {
    public CourseResponse createCourse(UUID tutorId, CourseRequest course);
    public List<CourseResponse> retrieveTutorCourses (UUID tutorId);
    public CourseResponse updateCourse(UUID tutorId, UUID courseId,CourseRequest course);
    public FeedbackRequest createFeedback(UUID tutorId, FeedbackRequest feedbackRequest);
    public List<StudentResponse> retrieveCourseStudents(UUID courseId);
    public LearningMaterialResponse createLearningMaterial(UUID tutorId, LearningMaterialRequest  learningMaterialRequest);
    public void deleteLearningMaterial(UUID tutorId, UUID materialId);
}
