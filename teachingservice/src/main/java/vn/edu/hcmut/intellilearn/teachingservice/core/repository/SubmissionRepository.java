package vn.edu.hcmut.intellilearn.teachingservice.core.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Submission;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.SubmissionId;

public interface SubmissionRepository extends JpaRepository<Submission, SubmissionId> {
}