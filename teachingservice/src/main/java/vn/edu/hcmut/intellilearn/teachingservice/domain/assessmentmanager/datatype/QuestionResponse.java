package vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager.datatype;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuestionResponse {
    UUID id;
    String content;
    List<OptionRequest> options;
}
