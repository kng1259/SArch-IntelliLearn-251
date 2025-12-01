package vn.edu.hcmut.intellilearn.utils.mapper;

import org.mapstruct.Mapper;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Student;
import vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant.datatype.StudentResponse;

@Mapper(componentModel = "spring")
public interface StudentMapper {
    StudentResponse toStudentResponse(Student student);
}
