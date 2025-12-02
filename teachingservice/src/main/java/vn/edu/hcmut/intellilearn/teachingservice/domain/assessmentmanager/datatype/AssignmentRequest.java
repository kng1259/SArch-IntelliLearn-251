package vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager.datatype;


import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AssignmentRequest {
    @NotBlank(message = "Tên bài kiểm tra không được để trống")
    String name;

    @NotBlank(message = "Mô tả bài kiểm tra không được để trống")
    String description;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    LocalDateTime startAt;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    LocalDateTime endAt;
    UUID courseId;

    MultipartFile instruction;
    MultipartFile gradingGuidelines;
}
