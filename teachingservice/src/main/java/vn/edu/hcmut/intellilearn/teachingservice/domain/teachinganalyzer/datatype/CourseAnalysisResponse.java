package vn.edu.hcmut.intellilearn.teachingservice.domain.teachinganalyzer.datatype;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CourseAnalysisResponse {
    Integer totalStudents;
    Long avgCompletionPercentage;
//    Float courseRating;
    CourseCompletionResponse courseCompletionResponse;
    List<MonthlyStudentEnrollmentStatsResponse> monthlyStudentEnrollmentStats;
}
