package vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager.datatype;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuizUpdateRequest extends TestUpdateRequest {
    @NotBlank(message = "Tên bài quiz không được để trống")
    String name;

    @NotBlank(message = "Mô tả bài quiz không được để trống")
    String description;

    LocalDateTime startAt;
    LocalDateTime endAt;
    Integer duration;
    UUID courseId;
    String level;
}
