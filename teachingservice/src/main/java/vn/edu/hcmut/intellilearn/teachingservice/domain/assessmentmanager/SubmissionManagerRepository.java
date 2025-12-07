package vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager;

import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Submission;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.SubmissionId;

import java.util.List;
import java.util.UUID;

public interface SubmissionManagerRepository {
    public void gradingSubmission(Submission submission);
    public Submission getSubmission(SubmissionId  submissionId);
    public List<Submission> selectSubmissionByCourseId(UUID courseId);
    public List<Submission> selectPendingSubmissionsByTutorId(UUID tutorId);
    public List<Submission> selectSubmissionsByAssignmentId(UUID assignmentId);
}
