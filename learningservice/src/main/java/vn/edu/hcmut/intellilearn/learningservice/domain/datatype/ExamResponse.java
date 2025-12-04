package vn.edu.hcmut.intellilearn.learningservice.domain.datatype;

import lombok.Data;

import java.util.*;

@Data
public class ExamResponse {
    private UUID id;
    private String name;
    private String description;
    private long startAt;
    private long endAt;
    private long createdAt;
    private long duration;
    private List<QuestionResponse> questions;
    private UUID attemptId;
}
