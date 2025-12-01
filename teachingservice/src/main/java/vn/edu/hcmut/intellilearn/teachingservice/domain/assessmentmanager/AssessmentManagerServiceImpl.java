package vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.edu.hcmut.intellilearn.teachingservice.core.entity.*;
import vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager.datatype.ExamRequest;
import vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager.datatype.ExamResponse;
import vn.edu.hcmut.intellilearn.teachingservice.domain.assessmentmanager.datatype.ExamUpdateRequest;
import vn.edu.hcmut.intellilearn.utils.mapper.ExamMapper;
import vn.edu.hcmut.intellilearn.utils.mapper.OptionMapper;
import vn.edu.hcmut.intellilearn.utils.mapper.QuestionMapper;
import vn.edu.hcmut.intellilearn.utils.mapper.TestMapper;
import vn.edu.hcmut.intellilearn.utils.validator.CourseValidator;
import vn.edu.hcmut.intellilearn.utils.validator.ExamValidator;

import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
class AssessmentManagerServiceImpl implements AssessmentManagerService {
    private final ExamManagerRepository examManagerRepository;

    private final TestMapper testMapper;
    private final OptionMapper optionMapper;
    private final QuestionMapper questionMapper;
    private final ExamMapper examMapper;

    private final CourseValidator courseValidator;
    private final ExamValidator  examValidator;


    @Override
    public void createExam(UUID tutorId, ExamRequest exam) {
        Exam newExam = buildExam(tutorId, exam);
        examManagerRepository.insertExam(newExam);
    }

    @Override
    public ExamResponse retrieveExam(UUID tutorId, UUID examId) {
        examValidator.validateExamOwnership(tutorId, examId);
        Exam exam = examManagerRepository.retrieveExam(examId);
        return ExamResponse.builder()
                .id(exam.getId())
                .name(exam.getTest().getName())
                .description(exam.getTest().getDescription())
                .startAt(exam.getTest().getStartAt())
                .endAt(exam.getTest().getEndAt())
                .questions(
                        exam.getTest().getQuestions().stream().map(
                                questionMapper::toQuestionResponse).toList()
                )
                .build();
    }

    @Override
    public void updateExam(UUID tutorId, UUID examId, ExamUpdateRequest exam) {
        examValidator.validateExamOwnership(tutorId, examId);
        Exam oldExam = examManagerRepository.retrieveExam(examId);
        examMapper.updateExam(exam, oldExam);
        examManagerRepository.updateExam(oldExam);
    }



    private Exam buildExam(UUID tutorId, ExamRequest exam) {
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
        return newExam;
    }
}
