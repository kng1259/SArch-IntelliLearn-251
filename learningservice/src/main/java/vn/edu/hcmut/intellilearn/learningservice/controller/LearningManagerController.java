package vn.edu.hcmut.intellilearn.learningservice.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;
import vn.edu.hcmut.intellilearn.learningservice.controller.datatype.ApiResponse;
import vn.edu.hcmut.intellilearn.learningservice.domain.learningmanager.LearningManagerService;
import vn.edu.hcmut.intellilearn.learningservice.domain.learningmanager.datatype.CourseResponse;

@RestController
@RequestMapping("/learning-manager")
@RequiredArgsConstructor
public class LearningManagerController {

  private final LearningManagerService service;

  @GetMapping("/courses")
  public ApiResponse<List<CourseResponse>> getAllCourses() {
    return ApiResponse.success(null);
  }

}