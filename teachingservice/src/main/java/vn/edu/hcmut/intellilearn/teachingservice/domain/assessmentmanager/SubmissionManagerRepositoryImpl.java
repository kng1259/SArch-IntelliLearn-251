package vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Submission;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.SubmissionId;
import vn.edu.hcmut.intellilearn.teachingservice.core.repository.SubmissionRepository;


@Service
@RequiredArgsConstructor
public class SubmissionManagerRepositoryImpl implements SubmissionManagerRepository {
    private final SubmissionRepository submissionRepository;

    @Override
    public void gradingSubmission(Submission submission) {
        submissionRepository.save(submission);
    }

    @Override
    public Submission getSubmission(SubmissionId submissionId) {
        return submissionRepository.findById(submissionId).orElse(null);
    }
}
