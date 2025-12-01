package vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Course;
import vn.edu.hcmut.intellilearn.teachingservice.core.repository.CourseRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TeachingAssistantCourseRepositoryImpl implements TeachingAssistantCourseRepository {
    private final CourseRepository courseRepository;

    @Override
    public Course insertCourse(UUID tutorId, Course course){
        course.setTutorId(tutorId);
        return courseRepository.save(course);
    }

    @Override
    public List<Course> selectTutorCourses(UUID tutorId) {
        return courseRepository.findAllByTutorId(tutorId);
    }

    @Override
    public Course updateCourse(Course course) {
        return courseRepository.save(course);
    }
}
