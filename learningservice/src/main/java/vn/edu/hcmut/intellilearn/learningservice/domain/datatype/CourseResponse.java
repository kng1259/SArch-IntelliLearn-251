package vn.edu.hcmut.intellilearn.learningservice.domain.datatype;



import java.time.LocalDateTime;
import java.util.UUID;
import lombok.*;
@Data
@Builder
public class CourseResponse {
    private UUID id;
    private String name;
    private String description;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private LocalDateTime createdAt;
    private UUID tutorId;
}
