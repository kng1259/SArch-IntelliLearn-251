package vn.edu.hcmut.intellilearn.learningservice.controller;

import org.springframework.core.io.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.edu.hcmut.intellilearn.learningservice.controller.datatype.ApiResponse;
import vn.edu.hcmut.intellilearn.learningservice.domain.assessmenttracker.AssessmentTrackerService;
import vn.edu.hcmut.intellilearn.learningservice.domain.datatype.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import vn.edu.hcmut.intellilearn.learningservice.core.KeycloakPrincipal;

import java.io.File;
import java.util.UUID;

@RestController
@RequestMapping("/learning/assessment")
@RequiredArgsConstructor
public class AssessmentTrackerController {

    private final AssessmentTrackerService assessmentTrackerService;

    /**
     * Xem chi tiết assignment (metadata + câu hỏi).
     */
    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/assignments/{assignmentId}")
    public ApiResponse<AssignmentResponse> getAssignment(
            @AuthenticationPrincipal KeycloakPrincipal principal,
            @PathVariable UUID assignmentId
    ) {
        UUID studentId = principal.userId();
        AssignmentResponse result = assessmentTrackerService
                .retrieveAssignment(studentId, assignmentId);
        return ApiResponse.success(result);
    }

    /**
     * Tải file hướng dẫn assignment (instruction).
     */
    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/assignments/{assignmentId}/instruction")
    public ResponseEntity<Resource> getAssignmentInstruction(
            @AuthenticationPrincipal KeycloakPrincipal principal,
            @PathVariable UUID assignmentId
    ) {
        UUID studentId = principal.userId();
        File file = assessmentTrackerService
                .retrieveAssignmentInstruction(studentId, assignmentId);

        FileSystemResource resource = new FileSystemResource(file);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + file.getName() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body((Resource) resource);
    }

    /**
     * Submit assignment (bài làm dạng file / text).
     * UML: submitAssignment(studentId, submission: SubmissionRequest)
     */
    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/assignments/{assignmentId}/submission")
    public ApiResponse<Void> submitAssignment(
            @AuthenticationPrincipal KeycloakPrincipal principal,
            @PathVariable UUID assignmentId,
            @RequestBody SubmissionRequest request
    ) {
        UUID studentId = principal.userId();
        // đảm bảo trong body cũng mang đúng assignmentId (nếu muốn)
        request.setAssignmentId(assignmentId);

        assessmentTrackerService.submitAssignment(studentId, request);
        return ApiResponse.success(null, "Nộp assignment thành công");
    }

    /**
     * Vào làm quiz – trả về cấu trúc quiz (câu hỏi + lựa chọn),
     * có thể kèm attemptId mới tạo.
     * UML: enterQuiz(studentId, quizId): QuizResponse
     */
    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/quizzes/{quizId}")
    public ApiResponse<QuizResponse> enterQuiz(
            @AuthenticationPrincipal KeycloakPrincipal principal,
            @PathVariable UUID quizId
    ) {
        UUID studentId = principal.userId();
        QuizResponse result = assessmentTrackerService
                .enterQuiz(studentId, quizId);
        return ApiResponse.success(result);
    }

    /**
     * Vào làm exam – tương tự quiz.
     * UML: enterExam(studentId, examId): ExamResponse
     */
    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/exams/{examId}")
    public ApiResponse<ExamResponse> enterExam(
            @AuthenticationPrincipal KeycloakPrincipal principal,
            @PathVariable UUID examId
    ) {
        UUID studentId = principal.userId();
        ExamResponse result = assessmentTrackerService
                .enterExam(studentId, examId);
        return ApiResponse.success(result);
    }

    /**
     * Submit kết quả làm test (quiz/exam) – gửi attemptId + danh sách answer.
     * UML: submitTest(studentId, attempt: AttemptRequest)
     */
    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/tests/attempts")
    public ApiResponse<Void> submitTest(
            @AuthenticationPrincipal KeycloakPrincipal principal,
            @RequestBody AttemptRequest request
    ) {
        UUID studentId = principal.userId();
        assessmentTrackerService.submitTest(studentId, request);
        return ApiResponse.success(null, "Nộp bài kiểm tra thành công");
    }
}