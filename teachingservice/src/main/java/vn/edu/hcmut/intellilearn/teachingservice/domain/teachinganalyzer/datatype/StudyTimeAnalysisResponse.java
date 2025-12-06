package vn.edu.hcmut.intellilearn.teachingservice.domain.teachinganalyzer.datatype;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StudyTimeAnalysisResponse {
    List<WeeklyStudyTimeStatsResponse> weeklyStats; // Thống kê theo tuần
    List<StudentStudyTimeRankingResponse> top5MostStudied; // Top 5 học nhiều nhất
    List<StudentStudyTimeRankingResponse> top5LeastStudied; // Top 5 học ít nhất
    Long totalStudyTimeMinutes; // Tổng thời gian học của tất cả học sinh (phút)
}


