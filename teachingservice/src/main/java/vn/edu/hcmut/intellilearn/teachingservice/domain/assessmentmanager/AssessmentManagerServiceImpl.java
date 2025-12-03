package vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.*;
import vn.edu.hcmut.intellilearn.teachingservice.core.repository.LevelRepository;
import vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager.datatype.*;
import vn.edu.hcmut.intellilearn.teachingservice.domain.minio.MinioService;
import vn.edu.hcmut.intellilearn.utils.mapper.*;
import vn.edu.hcmut.intellilearn.utils.validator.AssignmentValidator;
import vn.edu.hcmut.intellilearn.utils.validator.CourseValidator;
import vn.edu.hcmut.intellilearn.utils.validator.ExamValidator;
import vn.edu.hcmut.intellilearn.utils.validator.QuizValidator;

import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
class AssessmentManagerServiceImpl implements AssessmentManagerService {
    private final ExamManagerRepository examRepository;
    private final QuizManagerRepository quizRepository;
    private final AssignmentManagerRepository assignmentRepository;
    private final SubmissionManagerRepository submissionRepository;

    private final LevelRepository levelRepository;

    private final TestMapper testMapper;
    private final OptionMapper optionMapper;
    private final QuestionMapper questionMapper;
    private final ExamMapper examMapper;
    private final AssignmentMapper assignmentMapper;
    private final QuizMapper quizMapper;

    private final CourseValidator courseValidator;
    private final ExamValidator examValidator;
    private final QuizValidator quizValidator;
    private final AssignmentValidator assignmentValidator;

    private final MinioService minioService;

    @Override
    public void createExam(UUID tutorId, ExamRequest exam) {
        Course existedCourse = courseValidator.getCourseIfOwned(tutorId, exam.getCourseId());
        Exam newExam = new Exam();
        newExam.setCourse(existedCourse);
        Test newTest = testMapper.toTest(exam);
        // Set default startAt if null
        if (newTest.getStartAt() == null) {
            newTest.setStartAt(LocalDateTime.now());
        }
        Set<Question> newQuestions = new LinkedHashSet<>();
        exam.getQuestions().forEach(
                questionRequest -> {
                    Question newQuestion = questionMapper.toQuestion(questionRequest);
                    newQuestion.setCreatedAt(exam.getStartAt());
                    newQuestion.setTest(newTest);
                    Set<Option> newOptions = new LinkedHashSet<>();
                    if(questionRequest.getOptions()!=null) {
                        for(int i=0;i<questionRequest.getOptions().size();i++) {
                            Option newOption = optionMapper.toOption(questionRequest.getOptions().get(i));
                            newOption.setId(OptionId.builder()
                                    .order(i)
                                    .questionId(newQuestion.getId())
                                    .build());
                            newOption.setQuestion(newQuestion);
                            newOptions.add(newOption);
                        }
                    }
                    newQuestion.setOptions(newOptions);
                    newQuestions.add(newQuestion);
                }
        );
        newTest.setQuestions(newQuestions);
        newExam.setTest(newTest);
        examRepository.insertExam(newExam);
    }

    @Override
    public List<ExamResponse> retrieveExamsByCourse(UUID courseId) {
        List<Exam> exams = examRepository.retrieveExamsByCourse(courseId);
        return exams.stream().map(exam -> ExamResponse.builder()
                .id(exam.getId())
                .name(exam.getTest().getName())
                .description(exam.getTest().getDescription())
                .startAt(exam.getTest().getStartAt())
                .endAt(exam.getTest().getEndAt())
                .createdAt(exam.getTest().getCreatedAt())
                .duration(exam.getTest().getDuration())
                .build()
        ).toList();
    }

    @Override
    public ExamResponse retrieveExam(UUID tutorId, UUID examId) {
        examValidator.validateExamOwnership(tutorId, examId);
        Exam exam = examRepository.retrieveExam(examId);
        return ExamResponse.builder()
                .id(exam.getId())
                .name(exam.getTest().getName())
                .description(exam.getTest().getDescription())
                .startAt(exam.getTest().getStartAt())
                .endAt(exam.getTest().getEndAt())
                .createdAt(exam.getTest().getCreatedAt())
                .duration(exam.getTest().getDuration())
                .questions(
                        exam.getTest().getQuestions().stream().map(
                                questionMapper::toQuestionResponse).toList()
                )
                .build();
    }

    @Override
    public void updateExam(UUID tutorId, UUID examId, ExamUpdateRequest exam) {
        examValidator.validateExamOwnership(tutorId, examId);
        Exam oldExam = examRepository.retrieveExam(examId);
        examMapper.updateExam(exam, oldExam);
        examRepository.updateExam(oldExam);
    }

    @Override
    public void deleteExam(UUID tutorId, UUID examId) {
        examValidator.validateExamOwnership(tutorId, examId);
        examRepository.deleteExam(examId);
    }

    @Override
    public void createQuiz(UUID tutorId, QuizRequest quiz) {
        Course existedCourse = courseValidator.getCourseIfOwned(tutorId, quiz.getCourseId());
        Quiz newQuiz = new Quiz();
        newQuiz.setCourse(existedCourse);
        Test newTest = testMapper.toTest(quiz);
        // Set default startAt if null
        if (newTest.getStartAt() == null) {
            newTest.setStartAt(LocalDateTime.now());
        }
        Set<Question> newQuestions = new LinkedHashSet<>();
        quiz.getQuestions().forEach(
                questionRequest -> {
                    Question newQuestion = questionMapper.toQuestion(questionRequest);
                    newQuestion.setCreatedAt(quiz.getStartAt());
                    newQuestion.setTest(newTest);
                    Set<Option> newOptions = new LinkedHashSet<>();
                    if(questionRequest.getOptions()!=null) {
                        for(int i=0;i<questionRequest.getOptions().size();i++) {
                            Option newOption = optionMapper.toOption(questionRequest.getOptions().get(i));
                            newOption.setId(OptionId.builder()
                                    .order(i)
                                    .questionId(newQuestion.getId())
                                    .build());
                            newOption.setQuestion(newQuestion);
                            newOptions.add(newOption);
                        }
                    }
                    newQuestion.setOptions(newOptions);
                    newQuestions.add(newQuestion);
                }
        );
        newTest.setQuestions(newQuestions);
        newQuiz.setTest(newTest);
        // Set level, fallback to NORMAL if not found
        Level level = levelRepository.findById(quiz.getLevel()).orElse(null);
        if (level == null) {
            level = levelRepository.findById("NORMAL").orElse(null);
        }
        newQuiz.setLevelCodename(level);
        quizRepository.insertQuiz(newQuiz);
    }

    @Override
    public List<QuizResponse> retrieveQuizzesByCourse(UUID courseId) {
        List<Quiz> quizzes = quizRepository.selectQuizzesByCourse(courseId);
        return quizzes.stream().map(quiz -> QuizResponse.builder()
                .id(quiz.getId())
                .name(quiz.getTest().getName())
                .description(quiz.getTest().getDescription())
                .startAt(quiz.getTest().getStartAt())
                .endAt(quiz.getTest().getEndAt())
                .createdAt(quiz.getTest().getCreatedAt())
                .duration(quiz.getTest().getDuration())
                .level(quiz.getLevelCodename() != null ? quiz.getLevelCodename().getCodename() : null)
                .questions(
                        quiz.getTest().getQuestions() != null ?
                        quiz.getTest().getQuestions().stream().map(
                                questionMapper::toQuestionResponse).toList() : List.of()
                )
                .build()
        ).toList();
    }

    @Override
    public QuizResponse retrieveQuiz(UUID tutorId, UUID quizId) {
        quizValidator.validateExamOwnership(tutorId, quizId);
        Quiz quiz = quizRepository.selectQuiz(quizId);
        return QuizResponse.builder()
                .id(quiz.getId())
                .name(quiz.getTest().getName())
                .description(quiz.getTest().getDescription())
                .startAt(quiz.getTest().getStartAt())
                .endAt(quiz.getTest().getEndAt())
                .createdAt(quiz.getTest().getCreatedAt())
                .duration(quiz.getTest().getDuration())
                .level(quiz.getLevelCodename().getCodename())
                .questions(
                        quiz.getTest().getQuestions().stream().map(
                                questionMapper::toQuestionResponse).toList()
                )
                .build();
    }

    @Override
    public void updateQuiz(UUID tutorId, UUID quizId, QuizUpdateRequest quiz) {
        quizValidator.validateExamOwnership(tutorId, quizId);
        Quiz oldQuiz =  quizRepository.selectQuiz(quizId);
        quizMapper.updateQuiz(quiz, oldQuiz);
        quizRepository.updateQuiz(oldQuiz);
    }

    @Override
    public void deleteQuiz(UUID tutorId, UUID quizId) {
        quizValidator.validateExamOwnership(tutorId, quizId);
        quizRepository.deleteQuiz(quizId);
    }

    @Override
    public void createAssignment(UUID tutorId, AssignmentRequest assignment) {
        Course existedCourse = courseValidator.getCourseIfOwned(tutorId, assignment.getCourseId());
        Assignment newAssignment = assignmentMapper.toAssignment(assignment);

        // Set default startAt if null
        if (newAssignment.getStartAt() == null) {
            newAssignment.setStartAt(LocalDateTime.now());
        }

        // Validate dates: startAt must be before endAt
        if (newAssignment.getEndAt() != null && newAssignment.getStartAt() != null 
            && !newAssignment.getStartAt().isBefore(newAssignment.getEndAt())) {
            throw new IllegalArgumentException("Start date must be before end date.");
        }

        if (assignment.getInstruction() != null && !assignment.getInstruction().isEmpty()) {
            var instructionUrl = minioService.uploadFile(assignment.getInstruction());
            newAssignment.setInstruction(instructionUrl);
        }
        if (assignment.getGradingGuidelines() != null && !assignment.getGradingGuidelines().isEmpty()) {
            var guideLineUrl = minioService.uploadFile(assignment.getGradingGuidelines());
            newAssignment.setGradingGuidelines(guideLineUrl);
        }
        newAssignment.setCourse(existedCourse);
        assignmentRepository.insertAssignment(newAssignment);
    }

    @Override
    public List<AssignmentResponse> retrieveAssignmentsByCourse(UUID courseId) {
        List<Assignment> assignments = assignmentRepository.selectAssignmentsByCourse(courseId);
        return assignments.stream().map(assignmentMapper::toAssignmentResponse).toList();
    }

    @Override
    public AssignmentResponse retrieveAssignment(UUID tutorId, UUID assignmentId) {
        assignmentValidator.validateAssignmentOwnership(tutorId, assignmentId);
        Assignment assignment = assignmentRepository.selectAssignment(assignmentId);
        return assignmentMapper.toAssignmentResponse(assignment);
    }

    @Override
    public void updateAssignment(UUID tutorId, UUID assignmentId, AssignmentRequest assignment) {
        assignmentValidator.validateAssignmentOwnership(tutorId, assignmentId);
        Assignment  oldAssignment = assignmentRepository.selectAssignment(assignmentId);
        assignmentMapper.updateAssignment(assignment, oldAssignment);
        if(assignment.getGradingGuidelines() != null && !assignment.getGradingGuidelines().isEmpty()){
            var guideLineUrl = minioService.uploadFile(assignment.getGradingGuidelines());
            oldAssignment.setGradingGuidelines(guideLineUrl);
        }
        if(assignment.getInstruction() != null && !assignment.getInstruction().isEmpty()){
            var instructionUrl = minioService.uploadFile(assignment.getInstruction());
            oldAssignment.setInstruction(instructionUrl);
        }
        assignmentRepository.updateAssignment(oldAssignment);
    }

    @Override
    public void deleteAssignment(UUID tutorId, UUID assignmentId) {
        assignmentValidator.validateAssignmentOwnership(tutorId, assignmentId);
        assignmentRepository.deleteAssignment(assignmentId);
    }

    @Override
    public void gradingSubmission(UUID tutorId, UUID studentId, UUID assignmentId, GradingRequest gradingRequest) {
        SubmissionId submissionId = new SubmissionId();
        submissionId.setAssignmentId(assignmentId);
        submissionId.setStudentId(studentId);
        submissionId.setFileName(gradingRequest.getFileName());
        Submission oldSubmission = submissionRepository.getSubmission(submissionId);
        oldSubmission.setScore(gradingRequest.getScore());
        oldSubmission.setFeedback(gradingRequest.getFeedback());
        submissionRepository.gradingSubmission(oldSubmission);
    }
}
