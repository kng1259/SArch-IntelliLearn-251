package vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant.datatype;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LearningMaterialRequest {
    @NotBlank(message = "Tên material không được để trống")
    String name;
    MultipartFile content;
    UUID courseId;
}
