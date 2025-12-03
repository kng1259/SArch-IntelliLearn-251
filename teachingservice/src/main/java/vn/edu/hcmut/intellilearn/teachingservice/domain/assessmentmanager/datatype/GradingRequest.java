package vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager.datatype;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GradingRequest {
    @Min(value = 0, message = "Điểm phải từ 0 đến 100")
    @Max(value = 100, message = "Điểm phải từ 0 đến 100")
    Float score;
    @NotBlank(message = "Phản hồi không được để trống")
    String feedback;
    String fileName;
}
