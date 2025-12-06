package vn.edu.hcmut.intellilearn.teachingservice.domain.teachinganalyzer.datatype;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WeeklyStudyTimeStatsResponse {
    String week; // Format: "YYYY-WW" hoặc "YYYY-MM-DD to YYYY-MM-DD"
    Long totalMinutes; // Tổng thời gian học trong tuần (phút)
}


