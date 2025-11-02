package vn.edu.hcmut.intellilearn.learningservice.infrastructure.persistence.repository;

import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;
import vn.edu.hcmut.intellilearn.learningservice.infrastructure.persistence.jpa.repository.JpaCourseRepository;
import vn.edu.hcmut.intellilearn.learningservice.domain.model.Course;
import vn.edu.hcmut.intellilearn.learningservice.domain.repository.LearningManagerCourseRepository;
import vn.edu.hcmut.intellilearn.learningservice.infrastructure.persistence.jpa.mapper.CourseMapper;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

@Repository
@RequiredArgsConstructor
public class LearningManagerCourseRepositoryImpl implements LearningManagerCourseRepository {

  @Autowired
  private final JpaCourseRepository jpaCourseRepository;

  @Autowired
  private final CourseMapper courseMapper;

  @Override
  public List<Course> findAll() {
    return jpaCourseRepository.findAll().stream()
        .map(courseMapper::toDomain)
        .toList();
  }

}