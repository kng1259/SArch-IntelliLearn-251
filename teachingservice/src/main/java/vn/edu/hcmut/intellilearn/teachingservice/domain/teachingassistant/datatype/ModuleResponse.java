package vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant.datatype;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ModuleResponse {
    private String id;
    private String name;
    private String description;
    private Integer order;
    private LocalDateTime createdAt;
    private String courseId;
}
