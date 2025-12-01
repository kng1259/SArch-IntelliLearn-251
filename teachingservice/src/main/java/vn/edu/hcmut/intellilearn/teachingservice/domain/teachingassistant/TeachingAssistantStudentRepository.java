package vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant;

import vn.edu.hcmut.intellilearn.teachingservice.core.Student;
import vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant.datatype.StudentResponse;

import java.util.List;
import java.util.UUID;

public interface TeachingAssistantStudentRepository {
    public List<Student> selectCourseStudents(UUID courseId);
}
