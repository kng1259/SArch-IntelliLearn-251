package vn.edu.hcmut.intellilearn.learningservice.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.hcmut.intellilearn.learningservice.core.Submission;
import vn.edu.hcmut.intellilearn.learningservice.core.SubmissionId;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface SubmissionAnalyzerRepository extends JpaRepository<Submission, SubmissionId> {

    List<Submission> findById_StudentIdAndId_AssignmentIdAndCreatedAtBetween(
            UUID studentId,
            UUID assignmentId,
            LocalDateTime createdFrom,
            LocalDateTime createdTo
    );

    List<Submission> findById_StudentIdAndCreatedAtBetween(
            UUID studentId,
            LocalDateTime createdFrom,
            LocalDateTime createdTo
    );
}