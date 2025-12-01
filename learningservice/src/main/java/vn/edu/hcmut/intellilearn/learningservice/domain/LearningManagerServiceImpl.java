package vn.edu.hcmut.intellilearn.learningservice.domain;
import vn.edu.hcmut.intellilearn.learningservice.core.Course;
import vn.edu.hcmut.intellilearn.learningservice.core.Enrollment;
import vn.edu.hcmut.intellilearn.learningservice.core.Material;
import vn.edu.hcmut.intellilearn.learningservice.domain.datatype.CourseResponse;
import vn.edu.hcmut.intellilearn.learningservice.domain.datatype.FeedbackResponse;
import vn.edu.hcmut.intellilearn.learningservice.domain.datatype.LearningMaterialResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LearningManagerServiceImpl implements LearningManagerService{
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final MaterialRepository materialRepository;
    private final FeedbackRepository feedbackRepository;

    @Override
    public CourseResponse getCourse(UUID studentId, UUID courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        return mapToCourseResponse(course);
    }

    @Override
    public List<CourseResponse> getRecommendedCourses(UUID studentId) {
        // Logic giả định: Trả về 5 khóa học mới nhất
        return courseRepository.findTop5ByOrderByCreatedAtDesc().stream()
                .map(this::mapToCourseResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void enrollCourse(UUID studentId, UUID courseId) {
        if (enrollmentRepository.existsById_StudentIdAndId_CourseId(studentId,courseId)) {
            throw new RuntimeException("Student already enrolled");
        }

        // 3. Lấy thông tin Course (Bắt buộc vì @MapsId trong Entity Enrollment)
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // 4. Lưu Enrollment
        Enrollment enrollment = new Enrollment();
        enrollment.setCourse(course);
        enrollment.setTimestamp(Instant.now());

        enrollmentRepository.save(enrollment);
    }

    @Override
    public LearningMaterialResponse getLearningMaterial(UUID studentId, UUID materialId) {
        Material material = materialRepository.findById(materialId)
                .orElseThrow(() -> new RuntimeException("Material not found"));

        return LearningMaterialResponse.builder()
                .id(material.getId())
                .name(material.getName())
                .content(material.getContent())
                .createdAt(material.getCreatedAt())
                .updatedAt(material.getUpdatedAt())
                .build();
    }

    @Override
    public File getLearningMaterialContent(UUID studentId, UUID materialId) {
        Material material = materialRepository.findById(materialId)
                .orElseThrow(() -> new RuntimeException("Material not found"));

        // Tạo file tạm thời từ nội dung text trong DB để trả về đúng kiểu File
        try {
            File tempFile = File.createTempFile("material_" + materialId, ".txt");
            try (FileWriter writer = new FileWriter(tempFile)) {
                writer.write(material.getContent());
            }
            return tempFile;
        } catch (IOException e) {
            throw new RuntimeException("Error creating file content", e);
        }
    }

    @Override
    public List<FeedbackResponse> getCourseFeedbacks(UUID studentId, UUID courseId) {
        return feedbackRepository.findByCourse_CourseId(courseId).stream()
                .map(fb -> FeedbackResponse.builder()
                        .id(fb.getId())
                        .teacherId(fb.getTutorId())
                        .content(fb.getContent())
                        .createdAt(fb.getCreatedAt())
                        .courseId(fb.getCourse().getCourseId())
                        .build())
                .collect(Collectors.toList());
    }

    // --- Helper Method ---
    private CourseResponse mapToCourseResponse(Course course) {
        return CourseResponse.builder()
                .id(course.getCourseId())
                .name(course.getName())
                .description(course.getDescription())
                .startAt(course.getStartAt())
                .endAt(course.getEndAt())
                .createdAt(course.getCreatedAt())
                .tutorId(course.getTutorId())
                .build();
    }
}
