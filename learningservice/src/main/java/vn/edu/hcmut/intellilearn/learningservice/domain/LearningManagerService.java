package vn.edu.hcmut.intellilearn.learningservice.domain;

import vn.edu.hcmut.intellilearn.learningservice.domain.datatype.CourseResponse;
import vn.edu.hcmut.intellilearn.learningservice.domain.datatype.FeedbackResponse;
import vn.edu.hcmut.intellilearn.learningservice.domain.datatype.LearningMaterialResponse;

import java.io.File;
import java.util.List;
import java.util.UUID;

public interface LearningManagerService {
    CourseResponse getCourse(UUID studentId, UUID courseId);
    List<CourseResponse> getRecommendedCourses(UUID studentId);
    void enrollCourse(UUID studentId, UUID courseId);
    LearningMaterialResponse getLearningMaterial(UUID studentId, UUID materialId);
    File getLearningMaterialContent(UUID studentId, UUID materialId);
    List<FeedbackResponse> getCourseFeedbacks(UUID studentId, UUID courseId);
    List<CourseResponse> getStudentCourses(UUID studentId);
    vn.edu.hcmut.intellilearn.learningservice.domain.datatype.CourseDetailsResponse getCourseDetails(UUID studentId, UUID courseId);
}
