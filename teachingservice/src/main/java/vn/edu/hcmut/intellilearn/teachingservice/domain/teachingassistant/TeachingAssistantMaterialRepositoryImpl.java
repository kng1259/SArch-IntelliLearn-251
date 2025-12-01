package vn.edu.hcmut.intellilearn.teachingservice.domain.teachingassistant;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Material;
import vn.edu.hcmut.intellilearn.teachingservice.core.repository.MaterialRepository;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TeachingAssistantMaterialRepositoryImpl implements  TeachingAssistantMaterialRepository {
    private final MaterialRepository materialRepository;

    @Override
    public void insertLearningMaterial(Material material) {
        materialRepository.save(material);
    }

    @Override
    public void deleteLearningMaterial(UUID materialId) {
        materialRepository.deleteById(materialId);
    }

    @Override
    public Material getLearningMaterial(UUID materialId) {
        return materialRepository.findById(materialId).orElse(null);
    }
}
