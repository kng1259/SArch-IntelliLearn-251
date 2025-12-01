package vn.edu.hcmut.intellilearn.teachingservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import vn.edu.hcmut.intellilearn.teachingservice.controller.datatype.ApiResponse;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.KeycloakPrincipal;
import vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager.AssessmentManagerService;
import vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager.datatype.ExamRequest;
import vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager.datatype.ExamResponse;
import vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager.datatype.ExamUpdateRequest;

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
}
