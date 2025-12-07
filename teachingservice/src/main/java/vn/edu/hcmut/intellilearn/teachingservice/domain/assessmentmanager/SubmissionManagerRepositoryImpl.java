package vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Submission;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.SubmissionId;
import vn.edu.hcmut.intellilearn.teachingservice.core.repository.SubmissionRepository;

import java.util.List;
import java.util.UUID;


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

    @Override
    public List<Submission> selectSubmissionByCourseId(UUID courseId) {
        return submissionRepository.selectAllByCourseId(courseId);
    }

    @Override
    public List<Submission> selectPendingSubmissionsByTutorId(UUID tutorId) {
        return submissionRepository.selectPendingSubmissionsByTutorId(tutorId);
    }

    @Override
    public List<Submission> selectSubmissionsByAssignmentId(UUID assignmentId) {
        return submissionRepository.selectAllByAssignmentId(assignmentId);
    }
}
