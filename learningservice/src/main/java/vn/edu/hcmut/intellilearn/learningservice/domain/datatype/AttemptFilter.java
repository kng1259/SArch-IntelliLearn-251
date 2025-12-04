package vn.edu.hcmut.intellilearn.learningservice.domain.datatype;

import lombok.Data;

import java.util.UUID;

@Data
public class AttemptFilter {
    // epoch millis, optional
    private Long startAfter;
    private Long endBefore;
    private UUID testId;
}
