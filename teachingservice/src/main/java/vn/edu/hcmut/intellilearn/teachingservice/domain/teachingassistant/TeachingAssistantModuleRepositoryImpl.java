package vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Module;
import vn.edu.hcmut.intellilearn.teachingservice.core.repository.ModuleRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TeachingAssistantModuleRepositoryImpl implements TeachingAssistantModuleRepository {
    private final ModuleRepository moduleRepository;

    @Override
    public Module insertModule(Module module) {
        return moduleRepository.save(module);
    }

    @Override
    public void updateModule(Module module) {
        moduleRepository.save(module);
    }

    @Override
    public void deleteModule(UUID moduleId) {
        moduleRepository.deleteById(moduleId);
    }

    @Override
    public Module getModule(UUID moduleId) {
        return moduleRepository.findById(moduleId).orElse(null);
    }

    @Override
    public List<Module> getModulesByCourse(UUID courseId) {
        return moduleRepository.findAllByCourse_CourseIdOrderByOrderAsc(courseId);
    }

    @Override
    public int countModulesByCourse(UUID courseId) {
        return moduleRepository.countByCourse_CourseId(courseId);
    }
}
