package vn.edu.hcmut.intellilearn.learningservice.domain.datatype;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.*;
@Data
@Builder
public class LearningMaterialResponse {
    private UUID id;
    private String name;
    private String content; // Nội dung dạng text/preview
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
