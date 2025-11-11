package vn.edu.hcmut.intellilearn.learningservice.domain.learningmanager.repository;

import vn.edu.hcmut.intellilearn.learningservice.core.Course;
import java.util.List;

interface LearningManagerCourseRepository {

  List<Course> findAll();

  // Optional<Course> findById(String id);

  // Course save(Course learningManagerCourse);

  // void delete(String id);

  // boolean existsById(String id);

}