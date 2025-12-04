package vn.edu.hcmut.intellilearn.learningservice.controller;
import org.springframework.core.io.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import vn.edu.hcmut.intellilearn.learningservice.controller.datatype.ApiResponse;
import vn.edu.hcmut.intellilearn.learningservice.core.KeycloakPrincipal;
import vn.edu.hcmut.intellilearn.learningservice.domain.datatype.AttemptFilter;
import vn.edu.hcmut.intellilearn.learningservice.domain.datatype.AttemptResponse;
import vn.edu.hcmut.intellilearn.learningservice.domain.datatype.SubmissionFilter;
import vn.edu.hcmut.intellilearn.learningservice.domain.datatype.SubmissionResponse;
import vn.edu.hcmut.intellilearn.learningservice.domain.learninganalyzer.LearningAnalyzerService;

import java.io.File;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/learning/analyzer")
@RequiredArgsConstructor
public class LearningAnalyzerController {
    private final LearningAnalyzerService learningAnalyzerService;

    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/attempts/search")
    public ApiResponse<List<AttemptResponse>> getStudentAttempts(
            @AuthenticationPrincipal KeycloakPrincipal principal,
            @RequestBody AttemptFilter filter
    ) {
        UUID studentId = principal.userId();
        List<AttemptResponse> result =
                learningAnalyzerService.retrieveStudentAttempts(studentId, filter);
        return ApiResponse.success(result);
    }

    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/submissions/search")
    public ApiResponse<List<SubmissionResponse>> getStudentSubmissions(
            @AuthenticationPrincipal KeycloakPrincipal principal,
            @RequestBody SubmissionFilter filter
    ) {
        UUID studentId = principal.userId();
        List<SubmissionResponse> result =
                learningAnalyzerService.retrieveStudentSubmissions(studentId, filter);
        return ApiResponse.success(result);
    }

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/reports/monthly")
    public ResponseEntity<Resource> generateMonthlyLearningReport(
            @AuthenticationPrincipal KeycloakPrincipal principal
    ) {
        UUID studentId = principal.userId();
        File report = learningAnalyzerService.generateMonthlyLearningReport(studentId);
        return buildFileResponse(report, "monthly-learning-report.csv");
    }

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/reports/yearly")
    public ResponseEntity<Resource> generateYearlyLearningReport(
            @AuthenticationPrincipal KeycloakPrincipal principal
    ) {
        UUID studentId = principal.userId();
        File report = learningAnalyzerService.generateYearlyLearningReport(studentId);
        return buildFileResponse(report, "yearly-learning-report.csv");
    }

    private ResponseEntity<Resource> buildFileResponse(File file, String downloadName) {
        FileSystemResource resource = new FileSystemResource(file);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + downloadName + "\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body((Resource) resource);
    }
}
