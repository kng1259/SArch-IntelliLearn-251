package vn.edu.hcmut.intellilearn.teachingservice.core.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Material;

import java.util.List;
import java.util.UUID;

public interface MaterialRepository extends JpaRepository<Material, UUID> {
    List<Material> findAllByCourse_CourseId(UUID courseId);
}
