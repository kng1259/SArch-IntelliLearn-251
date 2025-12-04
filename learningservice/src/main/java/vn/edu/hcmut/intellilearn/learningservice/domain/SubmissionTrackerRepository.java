package vn.edu.hcmut.intellilearn.learningservice.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.hcmut.intellilearn.learningservice.core.Submission;
import vn.edu.hcmut.intellilearn.learningservice.core.SubmissionId;

import java.util.UUID;

@Repository
public interface SubmissionTrackerRepository extends JpaRepository<Submission, SubmissionId> {

    default Submission insertSubmission(Submission submission) {
        return save(submission);
    }

    boolean existsById_AssignmentIdAndId_StudentId(UUID assignmentId, UUID studentId);
}
