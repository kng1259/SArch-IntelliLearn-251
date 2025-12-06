package vn.edu.hcmut.intellilearn.teachingservice.domain.teachinganalyzer;

import vn.edu.hcmut.intellilearn.teachingservice.domain.teachinganalyzer.datatype.ReportResponse;

import java.util.UUID;

public interface TeachingAnalyzerService {
    public ReportResponse retrieveCourseAnalysis(UUID tutorId, UUID courseId);
}
