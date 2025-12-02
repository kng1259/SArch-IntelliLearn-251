package vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager;

import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Exam;

import java.util.List;
import java.util.UUID;

public interface ExamManagerRepository {
    public void insertExam(Exam exam);
    public List<Exam> retrieveExamsByCourse(UUID courseId);
    public Exam retrieveExam(UUID examId);
    public void updateExam(Exam exam);
    public void deleteExam(UUID examId);
}
