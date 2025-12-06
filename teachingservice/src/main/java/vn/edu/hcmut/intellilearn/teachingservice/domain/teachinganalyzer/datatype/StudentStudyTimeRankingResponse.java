package vn.edu.hcmut.intellilearn.teachingservice.domain.teachinganalyzer.datatype;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StudentStudyTimeRankingResponse {
    UUID studentId;
    String studentName;
    Long totalMinutes; // Tổng thời gian học (phút)
    Integer rank; // Thứ hạng
}


