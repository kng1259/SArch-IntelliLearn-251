package vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant.datatype;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CourseRequest {
    @NotBlank(message = "Tên khóa học không được để trống")
    String name;
    @NotBlank(message = "Mô tả khóa học không được để trống")
    String description;

    LocalDateTime startAt;
    @Future(message= "Thời điểm kết thúc không được trước hiện tại")
    LocalDateTime endAt;
}
