package vn.edu.hcmut.intellilearn.teachingservice.domain.teachinganalyzer;

import vn.edu.hcmut.intellilearn.teachingservice.domain.teachinganalyzer.datatype.CourseAnalysisResponse;

import java.util.UUID;

public interface TeachingAnalyzerService {
    public CourseAnalysisResponse retrieveCourseAnalysis(UUID tutorId, UUID courseId);
}
