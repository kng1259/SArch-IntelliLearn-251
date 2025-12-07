package vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant;

import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Module;

import java.util.List;
import java.util.UUID;

public interface TeachingAssistantModuleRepository {
    Module insertModule(Module module);
    void updateModule(Module module);
    void deleteModule(UUID moduleId);
    Module getModule(UUID moduleId);
    List<Module> getModulesByCourse(UUID courseId);
    int countModulesByCourse(UUID courseId);
}
