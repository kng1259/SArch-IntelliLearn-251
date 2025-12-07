package vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant.datatype;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LearningMaterialResponse {
    UUID id;
    String name;
    String content;
    UUID courseId;
}
