package vn.edu.hcmut.intellilearn.learningservice.application;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.edu.hcmut.intellilearn.learningservice.domain.model.Course;
import vn.edu.hcmut.intellilearn.learningservice.domain.repository.LearningManagerCourseRepository;

@Slf4j
@Service
@RequiredArgsConstructor
public class LearningManagerApplicationServiceImpl implements LearningManagerApplicationService {

  @Autowired
  private final LearningManagerCourseRepository learningManagerCourseRepository;

  public List<Course> getAllCourses() {
    return learningManagerCourseRepository.findAll();
  }

}