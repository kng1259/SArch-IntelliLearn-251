package vn.edu.hcmut.intellilearn.teachingservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import vn.edu.hcmut.intellilearn.teachingservice.controller.datatype.ApiResponse;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.KeycloakPrincipal;
import vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager.AssessmentManagerService;
import vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager.datatype.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class AssessmentManagerController {
    private final AssessmentManagerService assessmentManagerService;

    @PostMapping("/exam")
    public ApiResponse<?> postExam(@AuthenticationPrincipal KeycloakPrincipal principal,@Valid @RequestBody ExamRequest examRequest) {
        assessmentManagerService.createExam(principal.userId(), examRequest);
        return ApiResponse.builder()
                .success(true)
                .message("Tạo bài thi thành công")
                .build();
    }

    @GetMapping("/exam/course/{courseId}")
    public ApiResponse<List<ExamResponse>> getExamsByCourse(@PathVariable UUID courseId) {
        var exams = assessmentManagerService.retrieveExamsByCourse(courseId);
        return ApiResponse.<List<ExamResponse>>builder()
                .data(exams)
                .success(true)
                .message("Lấy danh sách bài thi thành công")
                .build();
    }

    @GetMapping("/exam/{examId}")
    public ApiResponse<ExamResponse> getExam(@AuthenticationPrincipal KeycloakPrincipal principal, @PathVariable UUID examId) {
        var exam = assessmentManagerService.retrieveExam(principal.userId(), examId);
        return ApiResponse.<ExamResponse>builder()
                .data(exam)
                .success(true)
                .message("Lấy thông tin bài thi thành công")
                .build();
    }

    @PutMapping("/exam/{examId}")
    public ApiResponse<?> putExam(@AuthenticationPrincipal KeycloakPrincipal principal, @PathVariable UUID examId, @Valid @RequestBody ExamUpdateRequest examRequest) {
        assessmentManagerService.updateExam(principal.userId(), examId, examRequest);
        return ApiResponse.builder()
                .success(true)
                .message("Cập nhật bài thi thành công")
                .build();
    }

    @DeleteMapping("/exam/{examId}")
    public ApiResponse<?> deleteExam(@AuthenticationPrincipal KeycloakPrincipal principal, @PathVariable UUID examId) {
        assessmentManagerService.deleteExam(principal.userId(), examId);
        return ApiResponse.builder()
                .success(true)
                .message("Xóa bài thi thành công")
                .build();
    }

    @PostMapping("/quiz")
    public ApiResponse<?> postQuiz(@AuthenticationPrincipal KeycloakPrincipal principal,@Valid @RequestBody QuizRequest quizRequest) {
        assessmentManagerService.createQuiz(principal.userId(), quizRequest);
        return ApiResponse.builder()
                .success(true)
                .message("Tạo bài quiz thành công")
                .build();
    }

    @GetMapping("/quiz/course/{courseId}")
    public ApiResponse<List<QuizResponse>> getQuizzesByCourse(@PathVariable UUID courseId) {
        var quizzes = assessmentManagerService.retrieveQuizzesByCourse(courseId);
        return ApiResponse.<List<QuizResponse>>builder()
                .data(quizzes)
                .success(true)
                .message("Lấy danh sách quiz thành công")
                .build();
    }

    @GetMapping("/quiz/{quizId}")
    public ApiResponse<QuizResponse> getQuiz(@AuthenticationPrincipal KeycloakPrincipal principal, @PathVariable UUID quizId) {
        var quiz = assessmentManagerService.retrieveQuiz(principal.userId(), quizId);
        return ApiResponse.<QuizResponse>builder()
                .data(quiz)
                .success(true)
                .message("Lấy thông tin bài quiz thành công")
                .build();
    }

    @PutMapping("/quiz/{quizId}")
    public ApiResponse<?> putQuiz(@AuthenticationPrincipal KeycloakPrincipal principal, @PathVariable UUID quizId,  @Valid @RequestBody QuizUpdateRequest quizRequest) {
        assessmentManagerService.updateQuiz(principal.userId(), quizId, quizRequest);
        return ApiResponse.builder()
                .success(true)
                .message("Cập nhật bài quiz thành công")
                .build();
    }

    @DeleteMapping("/quiz/{quizId}")
    public ApiResponse<?> deleteQuiz(@AuthenticationPrincipal KeycloakPrincipal principal, @PathVariable UUID quizId) {
        assessmentManagerService.deleteQuiz(principal.userId(), quizId);
        return ApiResponse.builder()
                .success(true)
                .message("Xóa bài quiz thành công")
                .build();
    }

    @PostMapping(value = "/assignment", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<?> postAssignment(@AuthenticationPrincipal KeycloakPrincipal principal, @Valid AssignmentRequest assignmentRequest) {
        assessmentManagerService.createAssignment(principal.userId(), assignmentRequest);
        return ApiResponse.builder()
                .success(true)
                .message("Tạo assignment thành công")
                .build();
    }

    @GetMapping("/assignment/course/{courseId}")
    public ApiResponse<List<AssignmentResponse>> getAssignmentsByCourse(@PathVariable UUID courseId) {
        var assignments = assessmentManagerService.retrieveAssignmentsByCourse(courseId);
        return ApiResponse.<List<AssignmentResponse>>builder()
                .data(assignments)
                .success(true)
                .message("Lấy danh sách assignment thành công")
                .build();
    }

    @GetMapping("/assignment/{assignmentId}")
    public ApiResponse<AssignmentResponse> getAssignment(@AuthenticationPrincipal KeycloakPrincipal principal, @PathVariable UUID assignmentId) {
        var assignment = assessmentManagerService.retrieveAssignment(principal.userId(), assignmentId);
        return ApiResponse.<AssignmentResponse>builder()
                .success(true)
                .message("Lấy assignment thành công")
                .data(assignment)
                .build();
    }

    @PutMapping(value = "/assignment/{assigmentId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<?> putAssignment(@AuthenticationPrincipal KeycloakPrincipal principal, @PathVariable UUID assigmentId, @Valid AssignmentRequest assignmentRequest) {
        assessmentManagerService.updateAssignment(principal.userId(), assigmentId, assignmentRequest);
        return ApiResponse.builder()
                .success(true)
                .message("Cập nhật assignment thành công")
                .build();
    }

    @DeleteMapping("/assignment/{assignmentId}")
    public ApiResponse<?> deleteAssignment(@AuthenticationPrincipal KeycloakPrincipal principal, @PathVariable UUID assignmentId) {
        assessmentManagerService.deleteAssignment(principal.userId(), assignmentId);
        return ApiResponse.builder()
                .success(true)
                .message("Xóa assignment thành công")
                .build();
    }

//    @PatchMapping("/submission/{submissionId}")

}
