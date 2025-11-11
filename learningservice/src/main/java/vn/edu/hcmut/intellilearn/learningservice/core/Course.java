package vn.edu.hcmut.intellilearn.learningservice.core;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {
    private Long id;

    private String name;

    private String description;

    private LocalDateTime startAt;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}