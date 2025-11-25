package vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.edu.hcmut.intellilearn.teachingservice.core.Course;
import vn.edu.hcmut.intellilearn.teachingservice.core.Feedback;
import vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant.datatype.CourseRequest;
import vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant.datatype.CourseResponse;
import vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant.datatype.FeedbackRequest;
import vn.edu.hcmut.intellilearn.utils.mapper.CourseMapper;
import vn.edu.hcmut.intellilearn.utils.mapper.FeedbackMapper;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeachingAssistantServiceImpl implements TeachingAssistantService {
    private final TeachingAssistantCourseRepository courseRepository;
    private final TeachingAssistantFeedbackRepository feedbackRepository;
    private final TeachingAssistantEnrollmentRepository enrollmentRepository;
    private final CourseMapper courseMapper;
    private final FeedbackMapper feedbackMapper;

    @Override
    public CourseResponse createCourse(UUID tutorId, CourseRequest courseRequest) {
        Course course = courseMapper.toCourse(courseRequest);
        var createdCourse = courseRepository.insertCourse(tutorId, course);
        return courseMapper.toCourseResponse(createdCourse);
    }
    @Override
    public List<CourseResponse> retrieveTutorCourses(UUID tutorId) {
        var courseList = courseRepository.selectTutorCourses(tutorId);
        return courseList.stream().map(courseMapper::toCourseResponse).collect(Collectors.toList());
    }

    @Override
    public CourseResponse updateCourse(UUID tutorId, UUID courseId, CourseRequest courseRequest) {
        Course existedCourse = isCourseOwnedByTutor(tutorId, courseId);
        if (existedCourse == null)
            throw new IllegalArgumentException("Khóa học không tồn tại hoặc bạn không có quyền phản hồi khóa học này");
        var newCourse = courseMapper.toCourse(courseRequest);
        newCourse.setCourseId(courseId);
        newCourse.setTutorId(tutorId);
        newCourse.setCreatedAt(existedCourse.getCreatedAt());
        return courseMapper.toCourseResponse(courseRepository.updateCourse(newCourse));
    }

    @Override
    public FeedbackRequest createFeedback(UUID tutorId, FeedbackRequest feedbackRequest) {
        Course existedCourse = isCourseOwnedByTutor(tutorId, feedbackRequest.getCourseId());
        if (existedCourse == null)
            throw new IllegalArgumentException("Khóa học không tồn tại hoặc bạn không có quyền phản hồi khóa học này");
        if (!enrollmentRepository.isStudentEnrolled(feedbackRequest.getStudentId(), feedbackRequest.getCourseId()))
            throw new IllegalArgumentException("Học viên chưa ghi danh khóa học này");
        Feedback feedback = feedbackMapper.toFeedBack(feedbackRequest);
        feedback.setTutorId(tutorId);
        feedback.setCourse(existedCourse);
        feedbackRepository.insertFeedback(feedback);
        return feedbackRequest;
    }

    private Course isCourseOwnedByTutor(UUID tutorId, UUID courseId){
        var courseList =  courseRepository.selectTutorCourses(tutorId);
        var existedCourse = courseList.stream().filter(course-> course.getCourseId().equals(courseId)).findFirst();
        return existedCourse.orElse(null);
    }
}
