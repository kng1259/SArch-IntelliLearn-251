package vn.edu.hcmut.intellilearn.teachingservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import vn.edu.hcmut.intellilearn.teachingservice.controller.datatype.ApiResponse;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.KeycloakPrincipal;
import vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant.TeachingAssistantService;
import vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant.datatype.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class TeachingAssistantController {
    public final TeachingAssistantService teachingAssistantService;

    @PreAuthorize("hasAnyRole('TUTOR')")
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

    @GetMapping("/course/{courseId}")
    public ApiResponse<CourseResponse> getCourse(@PathVariable UUID courseId){
        var course = teachingAssistantService.retrieveCourse(courseId);
        return ApiResponse.<CourseResponse>builder()
                .data(course)
                .message("Lấy thông tin khóa học thành công")
                .success(true)
                .build();
    }

    @PreAuthorize("hasAnyRole('TUTOR')")
    @PutMapping("/course/{courseId}")
    public ApiResponse<CourseResponse> updateCourse(@AuthenticationPrincipal KeycloakPrincipal principal,@PathVariable UUID courseId, @Valid @RequestBody CourseRequest courseRequest){
        var updatedCourse = teachingAssistantService.updateCourse(principal.userId(), courseId, courseRequest);
        return ApiResponse.<CourseResponse>builder()
                .data(updatedCourse)
                .message("Cập nhật khóa học thành công")
                .success(true)
                .build();
    }

    @PreAuthorize("hasAnyRole('TUTOR')")
    @PostMapping("/feedback")
    public ApiResponse<FeedbackRequest> postFeedback(@AuthenticationPrincipal KeycloakPrincipal principal,@Valid @RequestBody FeedbackRequest feedbackRequest){
        var createdFeedback = teachingAssistantService.createFeedback(principal.userId(), feedbackRequest);
        return ApiResponse.<FeedbackRequest>builder()
                .data(createdFeedback)
                .success(true)
                .message("Tạo phản hồi thành công")
                .build();
    }

    @PreAuthorize("hasAnyRole('TUTOR')")
    @GetMapping("/student/course/{courseId}")
    public ApiResponse<List<StudentResponse>> getCourseStudents(@PathVariable UUID courseId){
        var students = teachingAssistantService.retrieveCourseStudents(courseId);
        return ApiResponse.<List<StudentResponse>>builder()
                .data(students)
                .success(true)
                .message("Lấy danh sách học viên ghi danh khóa học thành công")
                .build();
    }

    @PreAuthorize("hasAnyRole('TUTOR')")
    @PostMapping(value="/learning-material", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<LearningMaterialResponse> postLearningMaterial(@AuthenticationPrincipal KeycloakPrincipal principal, @Valid LearningMaterialRequest learningMaterialRequest){
        var learningMaterial = teachingAssistantService.createLearningMaterial(principal.userId(), learningMaterialRequest);
        return ApiResponse.<LearningMaterialResponse>builder()
                .data(learningMaterial)
                .success(true)
                .message("Tạo tài liệu cho khóa học thành công")
                .build();
    }

    @GetMapping("/learning-material/course/{courseId}")
    public ApiResponse<List<LearningMaterialResponse>> getMaterialsByCourse(@PathVariable UUID courseId){
        var materials = teachingAssistantService.retrieveMaterialsByCourse(courseId);
        return ApiResponse.<List<LearningMaterialResponse>>builder()
                .data(materials)
                .message("Lấy danh sách tài liệu thành công")
                .success(true)
                .build();
    }

    @PreAuthorize("hasAnyRole('TUTOR')")
    @DeleteMapping("/learning-material/{materialId}")
    public ApiResponse<?> deleteLearningMaterial(@AuthenticationPrincipal KeycloakPrincipal principal, @PathVariable UUID materialId){
        teachingAssistantService.deleteLearningMaterial(principal.userId(), materialId);
        return ApiResponse.builder()
                .success(true)
                .message("Xóa tài liệu thành công")
                .build();
    }

    // ============ Module Endpoints ============

    @PreAuthorize("hasAnyRole('TUTOR')")
    @PostMapping("/module")
    public ApiResponse<ModuleResponse> postModule(@AuthenticationPrincipal KeycloakPrincipal principal, @Valid @RequestBody ModuleRequest moduleRequest){
        var module = teachingAssistantService.createModule(principal.userId(), moduleRequest);
        return ApiResponse.<ModuleResponse>builder()
                .data(module)
                .success(true)
                .message("Tạo module thành công")
                .build();
    }

    @GetMapping("/module/{moduleId}")
    public ApiResponse<ModuleResponse> getModule(@PathVariable UUID moduleId){
        var module = teachingAssistantService.retrieveModule(moduleId);
        return ApiResponse.<ModuleResponse>builder()
                .data(module)
                .message("Lấy thông tin module thành công")
                .success(true)
                .build();
    }

    @GetMapping("/module/course/{courseId}")
    public ApiResponse<List<ModuleResponse>> getModulesByCourse(@PathVariable UUID courseId){
        var modules = teachingAssistantService.retrieveModulesByCourse(courseId);
        return ApiResponse.<List<ModuleResponse>>builder()
                .data(modules)
                .message("Lấy danh sách module thành công")
                .success(true)
                .build();
    }

    @PreAuthorize("hasAnyRole('TUTOR')")
    @PutMapping("/module/{moduleId}")
    public ApiResponse<ModuleResponse> updateModule(@AuthenticationPrincipal KeycloakPrincipal principal, @PathVariable UUID moduleId, @Valid @RequestBody ModuleRequest moduleRequest){
        var module = teachingAssistantService.updateModule(principal.userId(), moduleId, moduleRequest);
        return ApiResponse.<ModuleResponse>builder()
                .data(module)
                .success(true)
                .message("Cập nhật module thành công")
                .build();
    }

    @PreAuthorize("hasAnyRole('TUTOR')")
    @DeleteMapping("/module/{moduleId}")
    public ApiResponse<?> deleteModule(@AuthenticationPrincipal KeycloakPrincipal principal, @PathVariable UUID moduleId){
        teachingAssistantService.deleteModule(principal.userId(), moduleId);
        return ApiResponse.builder()
                .success(true)
                .message("Xóa module thành công")
                .build();
    }
}
