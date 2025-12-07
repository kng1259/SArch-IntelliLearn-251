package vn.edu.hcmut.intellilearn.teachingservice.core.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Module;

import java.util.List;
import java.util.UUID;

public interface ModuleRepository extends JpaRepository<Module, UUID> {
    List<Module> findAllByCourse_CourseIdOrderByOrderAsc(UUID courseId);
    int countByCourse_CourseId(UUID courseId);
}
