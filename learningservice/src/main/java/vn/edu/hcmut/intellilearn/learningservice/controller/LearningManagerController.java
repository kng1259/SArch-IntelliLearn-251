package vn.edu.hcmut.intellilearn.learningservice.controller;

import vn.edu.hcmut.intellilearn.learningservice.controller.datatype.ApiResponse;
import vn.edu.hcmut.intellilearn.learningservice.core.KeycloakPrincipal;
import vn.edu.hcmut.intellilearn.learningservice.domain.LearningManagerService;
import vn.edu.hcmut.intellilearn.learningservice.domain.datatype.CourseResponse;
import vn.edu.hcmut.intellilearn.learningservice.domain.datatype.CourseDetailsResponse;
import vn.edu.hcmut.intellilearn.learningservice.domain.datatype.FeedbackResponse;
import vn.edu.hcmut.intellilearn.learningservice.domain.datatype.LearningMaterialResponse;
import org.springframework.security.access.prepost.PreAuthorize;
import java.io.File;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/learning") // Hoặc /api/learning tùy config context-path
@RequiredArgsConstructor
public class LearningManagerController {
    private final LearningManagerService learningManagerService;

    @PreAuthorize("hasRole('STUDENT')") // Giả định role cho người học
    @GetMapping("/course/{courseId}")
    public ApiResponse<CourseResponse> getCourse(
            @AuthenticationPrincipal KeycloakPrincipal principal,
            @PathVariable UUID courseId) {

        var course = learningManagerService.getCourse(principal.userId(), courseId);

        return ApiResponse.<CourseResponse>builder()
                .data(course)
                .success(true)
                .message("Lấy thông tin khóa học thành công")
                .build();
    }

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/course/{courseId}/details")
    public ApiResponse<CourseDetailsResponse> getCourseDetails(
            @AuthenticationPrincipal KeycloakPrincipal principal,
            @PathVariable UUID courseId) {

        var courseDetails = learningManagerService.getCourseDetails(principal.userId(), courseId);

        return ApiResponse.<CourseDetailsResponse>builder()
                .data(courseDetails)
                .success(true)
                .message("Lấy thông tin chi tiết khóa học thành công")
                .build();
    }

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/course/recommended")
    public ApiResponse<List<CourseResponse>> getRecommendedCourses(
            @AuthenticationPrincipal KeycloakPrincipal principal) {

        var recommendedCourses = learningManagerService.getRecommendedCourses(principal.userId());

        return ApiResponse.<List<CourseResponse>>builder()
                .data(recommendedCourses)
                .success(true)
                .message("Lấy danh sách khóa học đề xuất thành công")
                .build();
    }

    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/course/{courseId}/enroll")
    public ApiResponse<Void> enrollCourse(
            @AuthenticationPrincipal KeycloakPrincipal principal,
            @PathVariable UUID courseId) {

        learningManagerService.enrollCourse(principal.userId(), courseId);

        return ApiResponse.<Void>builder()
                .success(true)
                .message("Ghi danh khóa học thành công")
                .build();
    }

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/my-courses")
    public ApiResponse<List<CourseResponse>> getStudentCourses(
            @AuthenticationPrincipal KeycloakPrincipal principal) {

        var courses = learningManagerService.getStudentCourses(principal.userId());

        return ApiResponse.<List<CourseResponse>>builder()
                .data(courses)
                .success(true)
                .message("Lấy danh sách khóa học của tôi thành công")
                .build();
    }

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/material/{materialId}")
    public ApiResponse<LearningMaterialResponse> getLearningMaterial(
            @AuthenticationPrincipal KeycloakPrincipal principal,
            @PathVariable UUID materialId) {

        var material = learningManagerService.getLearningMaterial(principal.userId(), materialId);

        return ApiResponse.<LearningMaterialResponse>builder()
                .data(material)
                .success(true)
                .message("Lấy thông tin tài liệu thành công")
                .build();
    }

    // API Download File:
    // Lưu ý: Với API download file (binary), ta vẫn giữ nguyên ResponseEntity<Resource>
    // vì ApiResponse (JSON) không phù hợp để stream file trực tiếp cho trình duyệt download.
    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/material/{materialId}/content")
    public ResponseEntity<Resource> getLearningMaterialContent(
            @AuthenticationPrincipal KeycloakPrincipal principal,
            @PathVariable UUID materialId) {

        File file = learningManagerService.getLearningMaterialContent(principal.userId(), materialId);
        Resource resource = new FileSystemResource(file);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/course/{courseId}/feedback")
    public ApiResponse<List<FeedbackResponse>> getCourseFeedbacks(
            @AuthenticationPrincipal KeycloakPrincipal principal,
            @PathVariable UUID courseId) {

        var feedbacks = learningManagerService.getCourseFeedbacks(principal.userId(), courseId);

        return ApiResponse.<List<FeedbackResponse>>builder()
                .data(feedbacks)
                .success(true)
                .message("Lấy danh sách phản hồi thành công")
                .build();
    }
}
