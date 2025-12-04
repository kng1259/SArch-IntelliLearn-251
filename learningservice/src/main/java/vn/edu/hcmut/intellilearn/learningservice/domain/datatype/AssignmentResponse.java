package vn.edu.hcmut.intellilearn.learningservice.domain.datatype;


import lombok.Data;

import java.util.UUID;

@Data
public class AssignmentResponse {
    private UUID id;
    private String name;
    private String description;
    private long startAt;
    private long endAt;
    private long createdAt;
    private String instruction;
    private String gradingGuidelines;
}
