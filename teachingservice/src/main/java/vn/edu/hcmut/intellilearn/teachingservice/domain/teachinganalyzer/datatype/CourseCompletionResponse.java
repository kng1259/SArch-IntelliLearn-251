package vn.edu.hcmut.intellilearn.teachingservice.domain.teachinganalyzer.datatype;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CourseCompletionResponse {
    long completed;
    long inProgress;
    long notStarted;
}
