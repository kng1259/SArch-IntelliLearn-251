package vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant;

import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Material;

import java.util.UUID;

public interface TeachingAssistantMaterialRepository {
    public void insertLearningMaterial(Material material);
    public void deleteLearningMaterial(UUID materialId);
    public Material getLearningMaterial(UUID materialId);
}
