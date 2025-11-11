package vn.edu.hcmut.intellilearn.learningservice.domain.learningmanager.datatype;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseResponse {
  private Long id;
  private String name;
  private String description;
  private LocalDateTime startAt;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}