package vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager.datatype;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuizResponse {
    UUID id;
    String name;
    String description;
    LocalDateTime startAt;
    LocalDateTime endAt;
    LocalDateTime createdAt;
    Integer duration;
    String level;
    List<QuestionResponse> questions;
}
