package vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.Exam;
import vn.edu.hcmut.intellilearn.teachingservice.core.repository.ExamRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExamManagerRepositoryImpl implements ExamManagerRepository {
    private final ExamRepository examRepository;
    @Override
    public void insertExam(Exam exam) {
        examRepository.save(exam);
    }

    @Override
    public List<Exam> retrieveExamsByCourse(UUID courseId) {
        return examRepository.findByCourse_CourseId(courseId);
    }

    @Override
    public Exam retrieveExam(UUID examId) {
        return examRepository.findDetailById(examId).orElse(null);
    }

    @Override
    public void updateExam(Exam exam) {
        examRepository.save(exam);
    }

    @Override
    public void deleteExam(UUID examId) {
        examRepository.deleteById(examId);
    }
}
