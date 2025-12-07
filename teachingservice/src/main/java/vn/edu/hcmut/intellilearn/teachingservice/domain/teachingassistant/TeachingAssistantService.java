package vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant;

import vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant.datatype.*;

import java.util.List;
import java.util.UUID;

public interface TeachingAssistantService {
    public CourseResponse createCourse(UUID tutorId, CourseRequest course);
    public List<CourseResponse> retrieveTutorCourses (UUID tutorId);
    public CourseResponse retrieveCourse(UUID courseId);
    public CourseResponse updateCourse(UUID tutorId, UUID courseId,CourseRequest course);
    public FeedbackRequest createFeedback(UUID tutorId, FeedbackRequest feedbackRequest);
    public List<StudentResponse> retrieveCourseStudents(UUID courseId);
    public LearningMaterialResponse createLearningMaterial(UUID tutorId, LearningMaterialRequest  learningMaterialRequest);
    public List<LearningMaterialResponse> retrieveMaterialsByCourse(UUID courseId);
    public void deleteLearningMaterial(UUID tutorId, UUID materialId);
    
    // Module methods
    public ModuleResponse createModule(UUID tutorId, ModuleRequest moduleRequest);
    public ModuleResponse updateModule(UUID tutorId, UUID moduleId, ModuleRequest moduleRequest);
    public void deleteModule(UUID tutorId, UUID moduleId);
    public List<ModuleResponse> retrieveModulesByCourse(UUID courseId);
    public ModuleResponse retrieveModule(UUID moduleId);
}
