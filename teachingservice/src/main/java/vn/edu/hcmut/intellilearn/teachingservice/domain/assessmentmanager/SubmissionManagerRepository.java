package vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager;

import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Submission;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.SubmissionId;

public interface SubmissionManagerRepository {
    public void gradingSubmission(Submission submission);
    public Submission getSubmission(SubmissionId  submissionId);
}
