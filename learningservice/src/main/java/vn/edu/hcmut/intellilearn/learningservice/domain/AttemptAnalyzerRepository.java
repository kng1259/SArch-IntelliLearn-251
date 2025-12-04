package vn.edu.hcmut.intellilearn.learningservice.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.hcmut.intellilearn.learningservice.core.Attempt;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface AttemptAnalyzerRepository extends JpaRepository<Attempt, UUID> {

    // student + completed = true, filter theo testId và khoảng thời gian
    List<Attempt> findByStudentIdAndCompletedTrueAndTestIdAndStartAtBetween(
            UUID studentId,
            UUID testId,
            LocalDateTime startFrom,
            LocalDateTime startTo
    );

    // overload: không filter theo testId
    List<Attempt> findByStudentIdAndCompletedTrueAndStartAtBetween(
            UUID studentId,
            LocalDateTime startFrom,
            LocalDateTime startTo
    );
}