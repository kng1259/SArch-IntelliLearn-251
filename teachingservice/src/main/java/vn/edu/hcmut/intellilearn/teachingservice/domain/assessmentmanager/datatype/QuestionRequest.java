package vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager.datatype;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuestionRequest {
    String content;
    List<OptionRequest> options;
}
