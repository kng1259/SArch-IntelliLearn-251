package vn.edu.hcmut.intellilearn.learningservice.domain.datatype;
import lombok.Data;

import java.util.UUID;

@Data
public class SubmissionResponse {
    private UUID studentId;
    private UUID assignmentId;
    private String fileName;
    private String content;
    private long createdAt;
    private float score;
}