package vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager.datatype;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionResponse {
    private UUID assignmentId;
    private String assignmentName;
    private UUID studentId;
    private String studentName;
    private String fileName;
    private String content;
    private Float score;
    private String feedback;
    private LocalDateTime submittedAt;
    private boolean graded;
}
