package vn.edu.hcmut.intellilearn.learningservice.domain.datatype;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.*;
@Data
@Builder
public class FeedbackResponse {
    private UUID id;
    private UUID teacherId; // Mapping từ tutorId
    private String content;
    private LocalDateTime createdAt;
    private UUID courseId;
}
