package vn.edu.hcmut.intellilearn.learningservice.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {

  @NonNull
  private Long id;

  @NonNull
  private String name;

  private String description;

  private LocalDateTime startAt;

  private LocalDateTime createdAt;

  private LocalDateTime updatedAt;

}