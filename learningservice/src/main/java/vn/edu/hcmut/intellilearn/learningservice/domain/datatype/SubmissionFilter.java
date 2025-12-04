package vn.edu.hcmut.intellilearn.learningservice.domain.datatype;

import lombok.Data;

import java.util.UUID;

@Data
public class SubmissionFilter {
    // epoch millis, optional
    private Long createdAfter;
    private Long createdBefore;
    private UUID assignmentId;
}
