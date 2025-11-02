package vn.edu.hcmut.intellilearn.learningservice.infrastructure.persistence.jpa.mapper;

import org.springframework.stereotype.Component;
import vn.edu.hcmut.intellilearn.learningservice.domain.model.Course;
import vn.edu.hcmut.intellilearn.learningservice.infrastructure.persistence.jpa.entity.CourseEntity;

@Component
public class CourseMapper {

  public Course toDomain(CourseEntity entity) {
    if (entity == null) {
      return null;
    }
    return Course.builder()
        .id(entity.getId())
        .name(entity.getName())
        .description(entity.getDescription())
        .startAt(entity.getStartAt())
        .createdAt(entity.getCreatedAt())
        .updatedAt(entity.getUpdatedAt())
        .build();
  }

  public CourseEntity toEntity(Course domain) {
    if (domain == null) {
      return null;
    }
    return CourseEntity.builder()
        .id(domain.getId())
        .name(domain.getName())
        .description(domain.getDescription())
        .startAt(domain.getStartAt())
        .createdAt(domain.getCreatedAt())
        .updatedAt(domain.getUpdatedAt())
        .build();
  }
}