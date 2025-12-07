package vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Course;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Feedback;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Material;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Module;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Student;
import vn.edu.hcmut.intellilearn.teachingservice.domain.minio.MinioService;
import vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant.datatype.*;
import vn.edu.hcmut.intellilearn.utils.mapper.CourseMapper;
import vn.edu.hcmut.intellilearn.utils.mapper.FeedbackMapper;
import vn.edu.hcmut.intellilearn.utils.mapper.MaterialMapper;
import vn.edu.hcmut.intellilearn.utils.mapper.StudentMapper;
import vn.edu.hcmut.intellilearn.utils.validator.CourseValidator;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeachingAssistantServiceImpl implements TeachingAssistantService {
    private final TeachingAssistantCourseRepository courseRepository;
    private final TeachingAssistantFeedbackRepository feedbackRepository;
    private final TeachingAssistantEnrollmentRepository enrollmentRepository;
    private final TeachingAssistantStudentRepository studentRepository;
    private final TeachingAssistantMaterialRepository materialRepository;
    private final TeachingAssistantModuleRepository moduleRepository;

    private final MinioService minioService;

    private final CourseMapper courseMapper;
    private final FeedbackMapper feedbackMapper;
    private final StudentMapper studentMapper;
    private final MaterialMapper materialMapper;

    private final CourseValidator courseValidator;

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
    public CourseResponse retrieveCourse(UUID courseId) {
        Course course = courseRepository.getCourse(courseId);
        if (course == null) {
            throw new IllegalArgumentException("Không tìm thấy khóa học");
        }
        return courseMapper.toCourseResponse(course);
    }

    @Override
    public CourseResponse updateCourse(UUID tutorId, UUID courseId, CourseRequest courseRequest) {
        Course existedCourse = courseValidator.getCourseIfOwned(tutorId, courseId);
        courseMapper.updateCourseFromDto(courseRequest, existedCourse);
        return courseMapper.toCourseResponse(courseRepository.updateCourse(existedCourse));
    }

    @Override
    public FeedbackRequest createFeedback(UUID tutorId, FeedbackRequest feedbackRequest) {
        Course existedCourse = courseValidator.getCourseIfOwned(tutorId, feedbackRequest.getCourseId());
        if (!enrollmentRepository.isStudentEnrolled(feedbackRequest.getStudentId(), feedbackRequest.getCourseId()))
            throw new IllegalArgumentException("Học viên chưa ghi danh khóa học này");
        Feedback feedback = feedbackMapper.toFeedBack(feedbackRequest);
        feedback.setTutorId(tutorId);
        feedback.setCourse(existedCourse);
        feedbackRepository.insertFeedback(feedback);
        return feedbackRequest;
    }

    @Override
    public List<StudentResponse> retrieveCourseStudents(UUID courseId){
        List<Student> studentList = studentRepository.selectCourseStudents(courseId);
        return studentList.stream().map(
                studentMapper::toStudentResponse
        ).toList();
    }

    @Override
    public LearningMaterialResponse createLearningMaterial(UUID tutorId,  LearningMaterialRequest learningMaterialRequest) {
        Course existedCourse = courseValidator.getCourseIfOwned(tutorId, learningMaterialRequest.getCourseId());
        var url = minioService.uploadFile(learningMaterialRequest.getContent());
        Material material = materialMapper.toMaterial(learningMaterialRequest);
        material.setCourse(existedCourse);
        material.setContent(url);
        materialRepository.insertLearningMaterial(material);

        return materialMapper.toLearningMaterialResponse(material);
    }

    @Override
    public List<LearningMaterialResponse> retrieveMaterialsByCourse(UUID courseId) {
        List<Material> materials = materialRepository.getMaterialsByCourse(courseId);
        return materials.stream()
                .map(materialMapper::toLearningMaterialResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteLearningMaterial(UUID tutorId, UUID materialId) {
        Material existedMaterial = materialRepository.getLearningMaterial(materialId);
        courseValidator.getCourseIfOwned(tutorId, existedMaterial.getCourse().getCourseId());
        materialRepository.deleteLearningMaterial(materialId);
    }

    // Module methods
    @Override
    public ModuleResponse createModule(UUID tutorId, ModuleRequest moduleRequest) {
        Course existedCourse = courseValidator.getCourseIfOwned(tutorId, UUID.fromString(moduleRequest.getCourseId()));
        
        Module module = Module.builder()
                .name(moduleRequest.getName())
                .description(moduleRequest.getDescription())
                .order(moduleRequest.getOrder() != null ? moduleRequest.getOrder() : moduleRepository.countModulesByCourse(existedCourse.getCourseId()))
                .course(existedCourse)
                .build();
        
        Module savedModule = moduleRepository.insertModule(module);
        return toModuleResponse(savedModule);
    }

    @Override
    public ModuleResponse updateModule(UUID tutorId, UUID moduleId, ModuleRequest moduleRequest) {
        Module existedModule = moduleRepository.getModule(moduleId);
        if (existedModule == null) {
            throw new IllegalArgumentException("Không tìm thấy module");
        }
        courseValidator.getCourseIfOwned(tutorId, existedModule.getCourse().getCourseId());
        
        if (moduleRequest.getName() != null) {
            existedModule.setName(moduleRequest.getName());
        }
        if (moduleRequest.getDescription() != null) {
            existedModule.setDescription(moduleRequest.getDescription());
        }
        if (moduleRequest.getOrder() != null) {
            existedModule.setOrder(moduleRequest.getOrder());
        }
        
        moduleRepository.updateModule(existedModule);
        return toModuleResponse(existedModule);
    }

    @Override
    public void deleteModule(UUID tutorId, UUID moduleId) {
        Module existedModule = moduleRepository.getModule(moduleId);
        if (existedModule == null) {
            throw new IllegalArgumentException("Không tìm thấy module");
        }
        courseValidator.getCourseIfOwned(tutorId, existedModule.getCourse().getCourseId());
        moduleRepository.deleteModule(moduleId);
    }

    @Override
    public List<ModuleResponse> retrieveModulesByCourse(UUID courseId) {
        List<Module> modules = moduleRepository.getModulesByCourse(courseId);
        return modules.stream()
                .map(this::toModuleResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ModuleResponse retrieveModule(UUID moduleId) {
        Module module = moduleRepository.getModule(moduleId);
        if (module == null) {
            throw new IllegalArgumentException("Không tìm thấy module");
        }
        return toModuleResponse(module);
    }

    private ModuleResponse toModuleResponse(Module module) {
        return ModuleResponse.builder()
                .id(module.getId().toString())
                .name(module.getName())
                .description(module.getDescription())
                .order(module.getOrder())
                .createdAt(module.getCreatedAt())
                .courseId(module.getCourse().getCourseId().toString())
                .build();
    }
}
