package vn.edu.hcmut.intellilearn.utils.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import vn.edu.hcmut.intellilearn.teachingservice.core.Course;
import vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant.datatype.CourseRequest;
import vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant.datatype.CourseResponse;

@Mapper(componentModel = "spring")
public interface CourseMapper {
    @Mapping(target="tutorId", ignore=true)
    Course toCourse(CourseRequest courseRequest);

    @Mapping(source ="courseId", target = "id")
    CourseResponse toCourseResponse(Course course);
}
