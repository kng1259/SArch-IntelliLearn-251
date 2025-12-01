package vn.edu.hcmut.intellilearn.utils.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Course;
import vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant.datatype.CourseRequest;
import vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant.datatype.CourseResponse;

@Mapper(componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface CourseMapper {
    @Mapping(target="tutorId", ignore=true)
    Course toCourse(CourseRequest courseRequest);

    @Mapping(source ="courseId", target = "id")
    CourseResponse toCourseResponse(Course course);

    @Mapping(target = "exams", ignore = true)
    @Mapping(target = "materials", ignore = true)
    @Mapping(target = "feedbacks", ignore = true)
    @Mapping(target = "enrollments", ignore = true)
    void updateCourseFromDto(CourseRequest dto, @MappingTarget Course entity);
}
