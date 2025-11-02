package vn.edu.hcmut.intellilearn.learningservice.infrastructure.api.mapper;

import org.springframework.stereotype.Component;

import vn.edu.hcmut.intellilearn.learningservice.domain.model.Course;
import vn.edu.hcmut.intellilearn.learningservice.infrastructure.api.dto.CourseResponse;

@Component
public class CourseResponseMapper {

  public CourseResponse toResponse(Course domain) {
    if (domain == null) {
      return null;
    }
    return CourseResponse.builder()
        .id(domain.getId())
        .name(domain.getName())
        .description(domain.getDescription())
        .startAt(domain.getStartAt())
        .createdAt(domain.getCreatedAt())
        .updatedAt(domain.getUpdatedAt())
        .build();
  }

}
