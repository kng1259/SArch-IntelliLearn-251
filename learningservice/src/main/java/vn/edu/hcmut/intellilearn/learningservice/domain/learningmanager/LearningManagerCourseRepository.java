package vn.edu.hcmut.intellilearn.learningservice.domain.learningmanager;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.hcmut.intellilearn.learningservice.core.Course;
import java.util.UUID;

@Repository
interface LearningManagerCourseRepository extends JpaRepository<Course, UUID> {
}