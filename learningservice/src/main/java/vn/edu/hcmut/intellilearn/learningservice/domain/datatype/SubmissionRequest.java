package vn.edu.hcmut.intellilearn.learningservice.domain.datatype;

import lombok.Data;

import java.util.UUID;

@Data
public class SubmissionRequest {
    private String fileName;
    private String content;
    private UUID assignmentId;
}
