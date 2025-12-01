package vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager.datatype;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OptionRequest {
    int order;
    String value;
    boolean correct;
}
