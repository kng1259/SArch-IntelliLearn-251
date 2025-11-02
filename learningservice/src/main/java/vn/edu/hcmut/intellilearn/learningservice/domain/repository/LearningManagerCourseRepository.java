package vn.edu.hcmut.intellilearn.learningservice.domain.repository;

import vn.edu.hcmut.intellilearn.learningservice.domain.model.Course;
import java.util.List;

public interface LearningManagerCourseRepository {

  List<Course> findAll();

  // Optional<Course> findById(String id);

  // Course save(Course learningManagerCourse);

  // void delete(String id);

  // boolean existsById(String id);

}