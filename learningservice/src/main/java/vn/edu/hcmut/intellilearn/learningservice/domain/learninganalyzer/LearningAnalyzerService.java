package vn.edu.hcmut.intellilearn.learningservice.domain.learninganalyzer;

import vn.edu.hcmut.intellilearn.learningservice.domain.datatype.AttemptFilter;
import vn.edu.hcmut.intellilearn.learningservice.domain.datatype.AttemptResponse;
import vn.edu.hcmut.intellilearn.learningservice.domain.datatype.SubmissionFilter;
import vn.edu.hcmut.intellilearn.learningservice.domain.datatype.SubmissionResponse;

import java.io.File;
import java.util.List;
import java.util.UUID;

public interface LearningAnalyzerService {

    List<AttemptResponse> retrieveStudentAttempts(UUID studentId, AttemptFilter filter);

    List<SubmissionResponse> retrieveStudentSubmissions(UUID studentId, SubmissionFilter filter);

    File generateMonthlyLearningReport(UUID studentId);

    File generateYearlyLearningReport(UUID studentId);
}