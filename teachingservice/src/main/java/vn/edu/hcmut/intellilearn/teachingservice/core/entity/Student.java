package vn.edu.hcmut.intellilearn.teachingservice.core.entity;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class Student {
    UUID id;
    String fullName;
}
