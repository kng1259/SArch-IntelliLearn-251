package vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant;

import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Course;

import java.util.List;
import java.util.UUID;

public interface TeachingAssistantCourseRepository{
    public Course insertCourse(UUID tutorId, Course course);
    public List<Course> selectTutorCourses(UUID tutorId);
    public Course getCourse(UUID courseId);
    public Course updateCourse(Course course);
}
