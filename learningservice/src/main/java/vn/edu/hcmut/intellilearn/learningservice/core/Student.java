package vn.edu.hcmut.intellilearn.learningservice.core;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class Student {
    UUID id;
    String fullName;
}
