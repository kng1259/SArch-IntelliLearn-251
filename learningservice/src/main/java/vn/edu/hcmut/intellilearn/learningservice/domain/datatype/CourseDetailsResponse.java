package vn.edu.hcmut.intellilearn.learningservice.domain.datatype;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class CourseDetailsResponse {
    private CourseResponse course;
    private List<LearningMaterialResponse> materials;
    private List<AssignmentResponse> assignments;
    private List<QuizResponse> quizzes;
    private List<ExamResponse> exams;
}
