package vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.*;
import vn.edu.hcmut.intellilearn.teachingservice.core.repository.LevelRepository;
import vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager.datatype.*;
import vn.edu.hcmut.intellilearn.utils.mapper.*;
import vn.edu.hcmut.intellilearn.utils.validator.CourseValidator;
import vn.edu.hcmut.intellilearn.utils.validator.ExamValidator;
import vn.edu.hcmut.intellilearn.utils.validator.QuizValidator;

import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
class AssessmentManagerServiceImpl implements AssessmentManagerService {
    private final ExamManagerRepository examRepository;
    private final QuizManagerRepository quizRepository;

    private final LevelRepository levelRepository;

    private final TestMapper testMapper;
    private final OptionMapper optionMapper;
    private final QuestionMapper questionMapper;
    private final ExamMapper examMapper;

    private final CourseValidator courseValidator;
    private final ExamValidator examValidator;
    private final QuizValidator quizValidator;
    private final QuizMapper quizMapper;


    @Override
    public void createExam(UUID tutorId, ExamRequest exam) {
        Course existedCourse = courseValidator.getCourseIfOwned(tutorId, exam.getCourseId());
        Exam newExam = new Exam();
        newExam.setCourse(existedCourse);
        Test newTest = testMapper.toTest(exam);
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
        newQuiz.setLevelCodename(levelRepository.findById(quiz.getLevel()).orElse(null));
        quizRepository.insertQuiz(newQuiz);
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

}
