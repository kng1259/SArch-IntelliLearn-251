package vn.edu.hcmut.intellilearn.learningservice.domain.datatype;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class AttemptRequest {
    private UUID attemptId;
    private List<AnswerRequest> answers;
}
