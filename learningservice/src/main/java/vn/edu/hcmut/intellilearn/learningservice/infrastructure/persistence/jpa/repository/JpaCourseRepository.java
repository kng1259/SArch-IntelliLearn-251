package vn.edu.hcmut.intellilearn.learningservice.infrastructure.persistence.jpa.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import vn.edu.hcmut.intellilearn.learningservice.infrastructure.persistence.jpa.entity.CourseEntity;

public interface JpaCourseRepository extends JpaRepository<CourseEntity, Long> {

}
