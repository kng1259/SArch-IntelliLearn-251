package vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager.datatype;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AssignmentResponse {
    UUID id;
    String name;

    String description;

    LocalDateTime startAt;
    LocalDateTime endAt;
    LocalDateTime createdAt;

    String instruction;
    String gradingGuidelines;
}
