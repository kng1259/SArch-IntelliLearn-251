package vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant;

import lombok.RequiredArgsConstructor;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Course;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Enrollment;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.EnrollmentId;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Student;
import vn.edu.hcmut.intellilearn.teachingservice.core.repository.CourseRepository;
import vn.edu.hcmut.intellilearn.teachingservice.core.repository.EnrollmentRepository;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeachingAssistantStudentRepositoryImpl implements TeachingAssistantStudentRepository {
    private final Keycloak keycloak;
    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;

    @Value("${keycloak.realm}")
    private String keycloakRealm;

    @Override
    public List<Student> selectCourseStudents(UUID courseId) {
        Course course = courseRepository.findById(courseId).orElse(null);
        if (course == null) {
            throw new IllegalArgumentException("Khóa học không tồn tại");
        }
        List<Enrollment> enrollments = enrollmentRepository.findByCourse(course);
        List<EnrollmentId> enrollmentIds = enrollments.stream().map(Enrollment::getId).toList();
        List<UUID> studentIds = enrollmentIds.stream().map(EnrollmentId::getStudentId).toList();
        Set<String> targetIds = studentIds.stream()
                .map(UUID::toString)
                .collect(Collectors.toSet());
        RealmResource realmResource = keycloak.realm(keycloakRealm);
        UsersResource usersResource = realmResource.users();
        List<UserRepresentation> users = usersResource.list(0, 1000);
        List<Student> students = new ArrayList<>();

        for (UserRepresentation user : users) {
            if (targetIds.contains(user.getId())) {
                String fullName = getFullName(user);
                students.add(
                        Student.builder()
                                .fullName(fullName)
                                .id(UUID.fromString(user.getId()))
                                .build()
                );
            }
        }
        return students;
    }
    private String getFullName(UserRepresentation user) {
        String firstName = user.getFirstName() != null ? user.getFirstName() : "";
        String lastName = user.getLastName() != null ? user.getLastName() : "";
        return (lastName + " " + firstName).trim();
    }
}
