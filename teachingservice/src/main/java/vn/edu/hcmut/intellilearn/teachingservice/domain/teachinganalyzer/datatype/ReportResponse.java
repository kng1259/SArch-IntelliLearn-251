package vn.edu.hcmut.intellilearn.teachingservice.domain.teachinganalyzer.datatype;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReportResponse {
    CourseAnalysisResponse courseAnalysis;
    List<QuizAnalysisResponse> quizAnalysis;
    List<ExamAnalysisResponse> examAnalysis;
    List<AssignmentAnalysisResponse> assignmentAnalysis;
    StudyTimeAnalysisResponse studyTimeAnalysis;
}
