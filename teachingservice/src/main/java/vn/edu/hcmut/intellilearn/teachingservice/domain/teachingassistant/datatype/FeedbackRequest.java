package vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant.datatype;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FeedbackRequest {
    @NotNull(message = "Student ID không được để trống")
    UUID studentId;
    @NotNull(message = "Course ID không được để trống")
    UUID courseId;
    @NotBlank(message = "Nội dung feedback không được để trống")
    @Size(min = 10, max = 1000, message = "Nội dung phải từ 10 đến 1000 ký tự")
    String content;
}
