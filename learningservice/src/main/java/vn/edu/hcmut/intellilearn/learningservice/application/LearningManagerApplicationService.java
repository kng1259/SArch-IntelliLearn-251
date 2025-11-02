package vn.edu.hcmut.intellilearn.learningservice.application;

import vn.edu.hcmut.intellilearn.learningservice.domain.model.Course;
import java.util.List;

public interface LearningManagerApplicationService {

  public List<Course> getAllCourses();

}