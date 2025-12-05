package vn.edu.hcmut.intellilearn.learningservice.domain.assessmenttracker;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.edu.hcmut.intellilearn.learningservice.core.*;
import vn.edu.hcmut.intellilearn.learningservice.domain.*;
import vn.edu.hcmut.intellilearn.learningservice.domain.datatype.*;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

import java.time.LocalDateTime;
import java.time.ZoneId;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssessmentTrackerServiceImpl implements AssessmentTrackerService {

    private final ExamTrackerRepository examTrackerRepository;
    private final QuizTrackerRepository quizTrackerRepository;
    private final AssignmentTrackerRepository assignmentTrackerRepository;
    private final AttemptTrackerRepository attemptTrackerRepository;
    private final SubmissionTrackerRepository submissionTrackerRepository;
    private final QuestionRepository questionRepository;

    // ====================== ASSIGNMENT ======================

    @Override
    @Transactional
    public AssignmentResponse retrieveAssignment(UUID studentId, UUID assignmentId) {
        Assignment assignment = assignmentTrackerRepository.selectAssignment(assignmentId);

        return mapAssignmentToResponse(assignment);
    }

    @Override
    @Transactional
    public File retrieveAssignmentInstruction(UUID studentId, UUID assignmentId) {
        Assignment assignment = assignmentTrackerRepository.selectAssignment(assignmentId);

        try {
            File file = File.createTempFile("assignment-instruction-", ".txt");
            try (FileWriter writer = new FileWriter(file, StandardCharsets.UTF_8)) {
                writer.write(assignment.getInstruction() != null
                        ? assignment.getInstruction()
                        : "");
            }
            return file;
        } catch (IOException e) {
            throw new RuntimeException("Cannot create assignment instruction file", e);
        }
    }

    @Override
    public void submitAssignment(UUID studentId, SubmissionRequest request) {
        UUID assignmentId = request.getAssignmentId();
        Assignment assignment = assignmentTrackerRepository.selectAssignment(assignmentId);

        if (submissionTrackerRepository
                .existsById_AssignmentIdAndId_StudentId(assignmentId, studentId)) {
            throw new IllegalStateException("Student already submitted this assignment");
        }

        Submission submission = new Submission();
        submission.setId(new SubmissionId(studentId, assignmentId, request.getFileName()));
        submission.setContent(request.getContent());
        submission.setScore(0.0f);

        submissionTrackerRepository.insertSubmission(submission);
    }

    // ====================== QUIZ / EXAM ENTER ======================

    @Override
    public QuizResponse enterQuiz(UUID studentId, UUID quizId) {
        Quiz quiz = quizTrackerRepository.selectQuiz(quizId);
        Test test = quiz.getTest();

        Attempt attempt = new Attempt();
        attempt.setStudentId(studentId);
        attempt.setTestId(test.getId());
        attempt.setStartAt(LocalDateTime.now());
        attempt.setCompleted(false);
        attempt.setScore(0.0f);

        attempt = attemptTrackerRepository.insertAttempt(attempt);

        return mapQuizToResponse(quiz, attempt.getId());
    }

    @Override
    public ExamResponse enterExam(UUID studentId, UUID examId) {
        Exam exam = examTrackerRepository.selectExam(examId);
        Test test = exam.getTest();

        Attempt attempt = new Attempt();
        attempt.setStudentId(studentId);
        attempt.setTestId(test.getId());
        attempt.setStartAt(LocalDateTime.now());
        attempt.setCompleted(false);
        attempt.setScore(0.0f);

        attempt = attemptTrackerRepository.insertAttempt(attempt);

        return mapExamToResponse(exam, attempt.getId());
    }

    // ====================== SUBMIT TEST ======================

    @Override
    public void submitTest(UUID studentId, AttemptRequest request) {
        UUID attemptId = request.getAttemptId();

        Attempt attempt = attemptTrackerRepository
                .findByIdAndStudentId(attemptId, studentId)
                .orElseThrow(() -> new EntityNotFoundException("Attempt not found"));

        if (attempt.isCompleted()) {
            throw new IllegalStateException("Attempt already completed");
        }

        List<Question> questions = questionRepository.findByTest_Id(attempt.getTestId());
        Map<UUID, Question> questionMap =
                questions.stream().collect(Collectors.toMap(Question::getId, Function.identity()));

        int totalQuestions = questions.size();
        int correctCount = 0;

        attempt.getAnswers().clear();

        for (AnswerRequest ans : request.getAnswers()) {
            Question q = questionMap.get(ans.getQuestionId());
            if (q == null) continue;

            Answer answer = new Answer();
            answer.setContent(q.getContent());
            answer.setOrder(0); // thứ tự câu hỏi, có thể thêm map order

            attempt.addAnswer(answer);

            Set<Integer> chosenOrders = new HashSet<>();

            for (ChoiceRequest cr : ans.getChoices()) {
                Choice choice = new Choice();
                ChoiceId cid = new ChoiceId(attempt.getId(), cr.getOrder());
                choice.setId(cid);

                Option matchedOpt = q.getOptions().stream()
                        .filter(o -> o.getId().getOrder().equals(cr.getOrder()))
                        .findFirst().orElse(null);

                if (matchedOpt != null) {
                    choice.setValue(matchedOpt.getValue());
                    choice.setCorrect(matchedOpt.isCorrect());
                }

                choice.setSelected(true);
                answer.addChoice(choice);
                chosenOrders.add(cr.getOrder());
            }

            boolean correct = isQuestionCorrect(q, chosenOrders);
            if (correct) correctCount++;
        }

        float score = totalQuestions == 0 ? 0 : (correctCount * 100.0f / totalQuestions);

        attempt.setScore(score);
        attempt.setCompleted(true);
        attempt.setEndAt(LocalDateTime.now());

        attemptTrackerRepository.save(attempt);
    }

    private boolean isQuestionCorrect(Question q, Set<Integer> chosenOrders) {
        Set<Integer> correctOrders = q.getOptions().stream()
                .filter(Option::isCorrect)
                .map(o -> o.getId().getOrder())
                .collect(Collectors.toSet());

        return chosenOrders.equals(correctOrders);
    }

    // ====================== MAPPING HELPERS ======================

    private AssignmentResponse mapAssignmentToResponse(Assignment a) {
        AssignmentResponse r = new AssignmentResponse();
        r.setId(a.getId());
        r.setName(a.getName());
        r.setDescription(a.getDescription());
        r.setInstruction(a.getInstruction());
        r.setGradingGuidelines(a.getGradingGuidelines());
        r.setStartAt(a.getStartAt());
        r.setEndAt(a.getEndAt());
        r.setCreatedAt(a.getCreatedAt());
        return r;
    }

    private QuizResponse mapQuizToResponse(Quiz quiz, UUID attemptId) {
        Test test = quiz.getTest();

        QuizResponse res = new QuizResponse();
        res.setId(quiz.getId());
        res.setName(test.getName());
        res.setDescription(test.getDescription());
        res.setStartAt(test.getStartAt());
        res.setEndAt(test.getEndAt());
        res.setCreatedAt(test.getCreatedAt());
        res.setDuration(test.getDuration());
        res.setLevel(quiz.getLevel().getCodename());
        res.setAttemptId(attemptId);

        List<QuestionResponse> q = test.getQuestions().stream()
                .map(this::mapQuestion)
                .collect(Collectors.toList());

        res.setQuestions(q);
        return res;
    }

    private ExamResponse mapExamToResponse(Exam exam, UUID attemptId) {
        Test test = exam.getTest();

        ExamResponse res = new ExamResponse();
        res.setId(exam.getId());
        res.setName(test.getName());
        res.setDescription(test.getDescription());
        res.setStartAt(test.getStartAt());
        res.setEndAt(test.getEndAt());
        res.setCreatedAt(test.getCreatedAt());
        res.setDuration(test.getDuration());
        res.setAttemptId(attemptId);

        List<QuestionResponse> list = test.getQuestions().stream()
                .map(this::mapQuestion)
                .collect(Collectors.toList());
        res.setQuestions(list);
        return res;
    }

    private QuestionResponse mapQuestion(Question q) {
        QuestionResponse r = new QuestionResponse();
        r.setId(q.getId());
        r.setContent(q.getContent());

        List<OptionResponse> ops = q.getOptions().stream()
                .sorted(Comparator.comparing(o -> o.getId().getOrder()))
                .map(o -> {
                    OptionResponse or = new OptionResponse();
                    or.setOrder(o.getId().getOrder());
                    or.setValue(o.getValue());
                    or.setCorrect(o.isCorrect());
                    return or;
                })
                .collect(Collectors.toList());

        r.setOptions(ops);
        return r;
    }
}