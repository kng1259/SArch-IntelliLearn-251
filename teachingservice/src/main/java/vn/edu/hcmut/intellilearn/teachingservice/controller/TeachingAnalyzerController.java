package vn.edu.hcmut.intellilearn.teachingservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import vn.edu.hcmut.intellilearn.teachingservice.controller.datatype.ApiResponse;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.KeycloakPrincipal;
import vn.edu.hcmut.intellilearn.teachingservice.domain.teachinganalyzer.TeachingAnalyzerService;
import vn.edu.hcmut.intellilearn.teachingservice.domain.teachinganalyzer.datatype.ReportResponse;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class TeachingAnalyzerController {
    private final TeachingAnalyzerService teachingAnalyzerService;

    @GetMapping("/analysis/course/{courseId}")
    public ApiResponse<ReportResponse> getCourseAnalysis(@AuthenticationPrincipal KeycloakPrincipal principal, @PathVariable("courseId") UUID courseId) {
        return ApiResponse.<ReportResponse>builder()
                .success(true)
                .message("Lấy thông tin thống kê Course thành công")
                .data(teachingAnalyzerService.retrieveCourseAnalysis(principal.userId(), courseId))
                .build();
    }
}
