package vn.edu.hcmut.intellilearn.learningservice.infrastructure.api;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;
import vn.edu.hcmut.intellilearn.learningservice.application.LearningManagerApplicationService;
import vn.edu.hcmut.intellilearn.learningservice.common.response.ApiResponse;
import vn.edu.hcmut.intellilearn.learningservice.infrastructure.api.dto.CourseResponse;
import vn.edu.hcmut.intellilearn.learningservice.infrastructure.api.mapper.CourseResponseMapper;

@RestController
@RequestMapping("/api/v1/learning")
@RequiredArgsConstructor
public class LearningManagerController {

  @Autowired
  private final LearningManagerApplicationService learningManagerControllerService;

  @Autowired
  private final CourseResponseMapper courseResponseMapper;

  @GetMapping("/courses")
  public ApiResponse<List<CourseResponse>> getAllCourses() {
    return ApiResponse.success(learningManagerControllerService.getAllCourses().stream()
        .map(courseResponseMapper::toResponse)
        .collect(Collectors.toList()));
  }

}