package vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant.datatype;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ModuleRequest {
    private String name;
    private String description;
    private Integer order;
    private String courseId;
}
