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
public class PendingSubmissionResponse {
    private UUID assignmentId;
    private String assignmentName;
    private UUID courseId;
    private String courseName;
    private UUID studentId;
    private String studentName;
    private LocalDateTime submittedAt;
    private String content;
}
