package vn.edu.hcmut.intellilearn.learningservice.domain.datatype;

import lombok.Data;

@Data
public class OptionResponse {
    private int order;
    private String value;
    private boolean isCorrect;
}
