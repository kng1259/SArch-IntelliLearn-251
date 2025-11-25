package vn.edu.hcmut.intellilearn.teachingservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import vn.edu.hcmut.intellilearn.teachingservice.controller.datatype.ApiResponse;
import vn.edu.hcmut.intellilearn.teachingservice.core.Course;
import vn.edu.hcmut.intellilearn.teachingservice.core.KeycloakPrincipal;
import vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant.TeachingAssistantService;
import vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant.datatype.CourseRequest;
import vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant.datatype.CourseResponse;
import vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant.datatype.FeedbackRequest;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class TeachingAssistantController {
    public final TeachingAssistantService teachingAssistantService;

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @PostMapping("/course")
    public ApiResponse<CourseResponse> postCourse(@AuthenticationPrincipal KeycloakPrincipal principal, @Valid @RequestBody CourseRequest courseRequest){
        var createdCourse = teachingAssistantService.createCourse(principal.userId(), courseRequest);
        return ApiResponse.<CourseResponse>builder()
                .data(createdCourse)
                .message("Tạo khóa học thành công")
                .success(true)
                .build();
    }


    @GetMapping("/course/tutor/{tutorId}")
    public ApiResponse<List<CourseResponse>> getTutorCourses(@PathVariable UUID tutorId){
        var courseList = teachingAssistantService.retrieveTutorCourses(tutorId);
        return ApiResponse.<List<CourseResponse>>builder()
                .data(courseList)
                .message("Lấy danh sách khóa học thành công")
                .success(true)
                .build();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @PutMapping("/course/{courseId}")
    public ApiResponse<CourseResponse> updateCourse(@AuthenticationPrincipal KeycloakPrincipal principal,@PathVariable UUID courseId, @Valid @RequestBody CourseRequest courseRequest){
        var updatedCourse = teachingAssistantService.updateCourse(principal.userId(), courseId, courseRequest);
        if(updatedCourse == null) return ApiResponse.<CourseResponse>builder()
                .success(false)
                .message("Khóa học không tồn tại hoặc bạn không có quyền truy cập vào khóa học này")
                .build();
        return ApiResponse.<CourseResponse>builder()
                .data(updatedCourse)
                .message("Cập nhật khóa học thành công")
                .success(true)
                .build();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @PostMapping("/feedback")
    public ApiResponse<FeedbackRequest> postFeedback(@AuthenticationPrincipal KeycloakPrincipal principal,@Valid @RequestBody FeedbackRequest feedbackRequest){
        var createdFeedback = teachingAssistantService.createFeedback(principal.userId(), feedbackRequest);
        return ApiResponse.<FeedbackRequest>builder()
                .data(createdFeedback)
                .success(true)
                .message("Tạo phản hồi thành công")
                .build();
    }
}
