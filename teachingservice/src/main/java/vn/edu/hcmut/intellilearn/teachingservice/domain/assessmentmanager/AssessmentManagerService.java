package vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager;

import jakarta.transaction.Transactional;
import vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager.datatype.ExamRequest;
import vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager.datatype.ExamResponse;
import vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager.datatype.ExamUpdateRequest;

import java.util.UUID;

public interface AssessmentManagerService {
    public void createExam(UUID tutorId, ExamRequest exam);
    public ExamResponse retrieveExam(UUID tutorId, UUID examId);
    public void updateExam(UUID tutorId, UUID examId, ExamUpdateRequest exam);
}
