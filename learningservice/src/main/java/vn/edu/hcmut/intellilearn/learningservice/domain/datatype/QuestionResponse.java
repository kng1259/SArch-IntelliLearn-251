package vn.edu.hcmut.intellilearn.learningservice.domain.datatype;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class QuestionResponse {
    private UUID id;
    private String content;
    private List<OptionResponse> options;
}
