package vn.edu.hcmut.intellilearn.teachingservice.core.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Assignment;

import java.util.UUID;

public interface AssignmentRepository extends JpaRepository<Assignment, UUID> {
}