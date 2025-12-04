package vn.edu.hcmut.intellilearn.learningservice.domain.learninganalyzer;



import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.edu.hcmut.intellilearn.learningservice.core.Attempt;
import vn.edu.hcmut.intellilearn.learningservice.core.Submission;
import vn.edu.hcmut.intellilearn.learningservice.core.SubmissionId;
import vn.edu.hcmut.intellilearn.learningservice.domain.AttemptAnalyzerRepository;
import vn.edu.hcmut.intellilearn.learningservice.domain.SubmissionAnalyzerRepository;
import vn.edu.hcmut.intellilearn.learningservice.domain.datatype.AttemptFilter;
import vn.edu.hcmut.intellilearn.learningservice.domain.datatype.AttemptResponse;
import vn.edu.hcmut.intellilearn.learningservice.domain.datatype.SubmissionFilter;
import vn.edu.hcmut.intellilearn.learningservice.domain.datatype.SubmissionResponse;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.time.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LearningAnalyzerServiceImpl implements LearningAnalyzerService {

    private final AttemptAnalyzerRepository attemptRepository;
    private final SubmissionAnalyzerRepository submissionRepository;

    // ====== ATTEMPTS ======

    @Override
    public List<AttemptResponse> retrieveStudentAttempts(UUID studentId, AttemptFilter filter) {
        LocalDateTime from = toLocalDateTimeOrDefault(filter.getStartAfter(), startOfYear());
        LocalDateTime to = toLocalDateTimeOrDefault(filter.getEndBefore(), endOfYear());

        List<Attempt> attempts;

        if (filter.getTestId() != null) {
            attempts = attemptRepository
                    .findByStudentIdAndCompletedTrueAndTestIdAndStartAtBetween(
                            studentId, filter.getTestId(), from, to);
        } else {
            attempts = attemptRepository
                    .findByStudentIdAndCompletedTrueAndStartAtBetween(
                            studentId, from, to);
        }

        return attempts.stream()
                .map(this::mapAttempt)
                .collect(Collectors.toList());
    }

    // ====== SUBMISSIONS ======

    @Override
    public List<SubmissionResponse> retrieveStudentSubmissions(UUID studentId, SubmissionFilter filter) {
        LocalDateTime from = toLocalDateTimeOrDefault(filter.getCreatedAfter(), startOfYear());
        LocalDateTime to = toLocalDateTimeOrDefault(filter.getCreatedBefore(), endOfYear());

        List<Submission> submissions;

        if (filter.getAssignmentId() != null) {
            submissions = submissionRepository
                    .findById_StudentIdAndId_AssignmentIdAndCreatedAtBetween(
                            studentId, filter.getAssignmentId(), from, to);
        } else {
            submissions = submissionRepository
                    .findById_StudentIdAndCreatedAtBetween(studentId, from, to);
        }

        return submissions.stream()
                .map(this::mapSubmission)
                .collect(Collectors.toList());
    }

    // ====== REPORTS (simple CSV) ======

    @Override
    public File generateMonthlyLearningReport(UUID studentId) {
        LocalDate firstDay = LocalDate.now().withDayOfMonth(1);
        LocalDateTime from = firstDay.atStartOfDay();
        LocalDateTime to = firstDay.plusMonths(1).minusDays(1).atTime(23, 59, 59);

        List<Attempt> attempts = attemptRepository
                .findByStudentIdAndCompletedTrueAndStartAtBetween(studentId, from, to);

        List<Submission> submissions = submissionRepository
                .findById_StudentIdAndCreatedAtBetween(studentId, from, to);

        return buildCsvReport("monthly-learning-report", attempts, submissions);
    }

    @Override
    public File generateYearlyLearningReport(UUID studentId) {
        LocalDate firstDay = LocalDate.now().withDayOfYear(1);
        LocalDateTime from = firstDay.atStartOfDay();
        LocalDateTime to = firstDay.plusYears(1).minusDays(1).atTime(23, 59, 59);

        List<Attempt> attempts = attemptRepository
                .findByStudentIdAndCompletedTrueAndStartAtBetween(studentId, from, to);

        List<Submission> submissions = submissionRepository
                .findById_StudentIdAndCreatedAtBetween(studentId, from, to);

        return buildCsvReport("yearly-learning-report", attempts, submissions);
    }

    // ====== helpers mapping & date ======

    private AttemptResponse mapAttempt(Attempt attempt) {
        AttemptResponse r = new AttemptResponse();
        r.setId(attempt.getId());
        r.setTestId(attempt.getTestId());
        r.setStartAt(toMillis(attempt.getStartAt()));
        r.setEndAt(toMillis(attempt.getEndAt()));
        r.setScore(attempt.getScore() == null ? 0f : attempt.getScore());
        r.setCompleted(attempt.isCompleted());
        return r;
    }

    private SubmissionResponse mapSubmission(Submission s) {
        SubmissionId id = s.getId();
        SubmissionResponse r = new SubmissionResponse();
        r.setStudentId(id.getStudentId());
        r.setAssignmentId(id.getAssignmentId());
        r.setFileName(id.getFileName());
        r.setContent(s.getContent());
        r.setCreatedAt(toMillis(s.getCreatedAt()));
        r.setScore(s.getScore() == null ? 0f : s.getScore());
        return r;
    }

    private long toMillis(LocalDateTime t) {
        if (t == null) return 0L;
        return t.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
    }

    private LocalDateTime toLocalDateTimeOrDefault(Long epochMillis, LocalDateTime fallback) {
        if (epochMillis == null) return fallback;
        return Instant.ofEpochMilli(epochMillis).atZone(ZoneId.systemDefault()).toLocalDateTime();
    }

    private LocalDateTime startOfYear() {
        LocalDate first = LocalDate.now().withDayOfYear(1);
        return first.atStartOfDay();
    }

    private LocalDateTime endOfYear() {
        LocalDate first = LocalDate.now().withDayOfYear(1);
        return first.plusYears(1).minusDays(1).atTime(23, 59, 59);
    }

    private File buildCsvReport(String prefix, List<Attempt> attempts, List<Submission> submissions) {
        try {
            File file = File.createTempFile(prefix + "-", ".csv");
            try (FileWriter writer = new FileWriter(file)) {
                writer.write("Type,Id,RefId,Start/CreatedAt,EndAt,Score,Extra\n");

                for (Attempt a : attempts) {
                    writer.write(String.format(
                            "ATTEMPT,%s,%s,%d,%d,%.2f,completed=%s%n",
                            a.getId(),
                            a.getTestId(),
                            toMillis(a.getStartAt()),
                            toMillis(a.getEndAt()),
                            a.getScore(),
                            a.isCompleted()
                    ));
                }

                for (Submission s : submissions) {
                    SubmissionId id = s.getId();
                    writer.write(String.format(
                            "SUBMISSION,%s,%s,%d,,%.2f,filename=%s%n",
                            id.getStudentId(),
                            id.getAssignmentId(),
                            toMillis(s.getCreatedAt()),
                            s.getScore(),
                            id.getFileName()
                    ));
                }
            }
            return file;
        } catch (IOException e) {
            throw new RuntimeException("Cannot generate report file", e);
        }
    }
}