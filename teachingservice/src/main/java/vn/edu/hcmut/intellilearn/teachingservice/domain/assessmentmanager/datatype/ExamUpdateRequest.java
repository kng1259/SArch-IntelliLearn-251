package vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager.datatype;

import jakarta.validation.constraints.NotBlank;
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
public class ExamUpdateRequest {
    @NotBlank(message = "Tên bài kiểm tra không được để trống")
    String name;

    @NotBlank(message = "Mô tả bài kiểm tra không được để trống")
    String description;

    LocalDateTime startAt;
    LocalDateTime endAt;
    Long duration;
    UUID courseId;
    List<QuestionUpdateRequest> questions;
}
