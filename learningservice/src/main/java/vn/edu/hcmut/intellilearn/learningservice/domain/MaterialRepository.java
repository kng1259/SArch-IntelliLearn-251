package vn.edu.hcmut.intellilearn.learningservice.domain;

import vn.edu.hcmut.intellilearn.learningservice.core.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MaterialRepository extends JpaRepository<Material, UUID> {
    // Material liên kết với Course qua object 'course'
    List<Material> findByCourse_CourseId(UUID courseId);
}
