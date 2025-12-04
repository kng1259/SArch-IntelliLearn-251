package vn.edu.hcmut.intellilearn.learningservice.domain.datatype;

import lombok.Data;

import java.util.UUID;

@Data
public class AttemptResponse {
    private UUID id;
    private UUID testId;
    private long startAt;
    private long endAt;
    private float score;
    private boolean completed;
}