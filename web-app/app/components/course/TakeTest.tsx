import { useEffect, useEffectEvent, useLayoutEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { StudentTest } from "@/lib/services/courseService";
import assessmentService, {
  questionAnswer,
} from "@/lib/services/assessmentService";
import Loader from "@/app/components/Loader";
import { useRouter } from "next/navigation";
import { convertSecondsToMinutes } from "@/lib/utils";

const answerInit: questionAnswer = {
  questionId: "",
  choices: [
    {
      order: -1,
      optionOrder: -1,
    },
  ],
};

const TakeTest = ({
  courseId,
  testId,
  testType,
}: {
  courseId: string;
  testId: string;
  testType: "QUIZ" | "EXAM";
}) => {
  const [testInfo, setTestInfo] = useState<StudentTest | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [answers, setAnswers] = useState<questionAnswer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] =
    useState<questionAnswer>(answerInit);

  const [timer, setTimer] = useState<number>(0);

  useLayoutEffect(() => {
    const interval = setInterval(() => {
        if(timer === 0) {
          clearInterval(interval);
          handleSubmit(answers);
        }
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);
    return () => clearInterval(interval);
  });

  const router = useRouter();

  const fetchTestInfo = useEffectEvent(async () => {
    setIsLoading(true);
    try {
      let res;
      if (testType === "QUIZ") {
        res = await assessmentService.attempQuiz(testId);
      } else {
        res = await assessmentService.attempExam(testId);
      }
      setTestInfo(res);
      setTimer(res.duration * 60);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  });

  useEffect(() => {
    fetchTestInfo();
  }, []);

  if (!testInfo || isLoading) {
    return <Loader />;
  }

  const handleAnswerSelect = (answerIndex: number, questionId: string) => {
    setSelectedAnswer({
      questionId,
      choices: [
        {
          order: answerIndex,
          optionOrder: answerIndex,
        },
      ],
    });
  };

  const handleNext = () => {
    if (selectedAnswer.questionId !== "") {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedAnswer;
      setAnswers(newAnswers);
      setSelectedAnswer(answerInit);

      if (currentQuestion < testInfo.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        handleSubmit(newAnswers);
      }
    }
  };

  const handleSubmit = async (finalAnswers: questionAnswer[]) => {
    setAnswers(finalAnswers);
    setShowResults(true);
    setSelectedAnswer(answerInit);

    const data = {
      attemptId: testInfo.attemptId,
      answers: finalAnswers,
    };

    console.log(data);

    try {
      await assessmentService.submitTestAttempt(data);
      // console.log("Response:", res.message);
    } catch (error) {
      console.error("Error submitting test attempt:", error);
    }
  };

  const calculateScore = () => {
    const correct = answers.filter(
      (answer, index) =>
        testInfo.questions[index].options[answer.choices[0].optionOrder - 1]
          .correct === true
    ).length;
    return Math.round((correct / testInfo.questions.length) * 100);
  };

  if (showResults) {
    const score = calculateScore();
    const passed = score >= 50;

    return (
      <div className="max-w-3xl mx-auto p-6">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {passed ? (
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircle className="w-16 h-16 text-green-600" />
                </div>
              ) : (
                <div className="bg-red-100 p-4 rounded-full">
                  <XCircle className="w-16 h-16 text-red-600" />
                </div>
              )}
            </div>
            <CardTitle className="text-3xl">
              {passed ? "Congratulations!" : "Keep Trying!"}
            </CardTitle>
            <CardDescription>
              {passed ? "You've passed the test" : "You didn't pass this time"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-6xl mb-2">{score}%</p>
              <p className="text-gray-600">Your Score</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between p-4 bg-gray-50 rounded-lg">
                <span>Correct Answers</span>
                <span>
                  {
                    answers.filter(
                      (a, i) =>
                        testInfo.questions[i].options[
                          a.choices[0].optionOrder - 1
                        ].correct
                    ).length
                  }{" "}
                  / {testInfo.questions.length}
                </span>
              </div>
              <div className="flex justify-between p-4 bg-gray-50 rounded-lg">
                <span>Passing Score</span>
                <span>50%</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                className="flex-1 bg-black text-white"
                onClick={() => {
                  router.push(`/student/my-courses/${courseId}`);
                }}
              >
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const question = testInfo.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / testInfo.questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 bg-white">
      <Card className="pb-6">
        <CardHeader>
          <div className="flex justify-between items-start mb-4">
            <div>
              <CardTitle>{testInfo.name}</CardTitle>
              <CardDescription>{testInfo.description}</CardDescription>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{convertSecondsToMinutes(timer)} min</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                Question {currentQuestion + 1} of {testInfo.questions.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Question {currentQuestion + 1}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg">{question.content}</p>

          <RadioGroup
            value={selectedAnswer?.toString()}
            onValueChange={(value) =>
              handleAnswerSelect(parseInt(value), question.id)
            }
          >
            <div className="space-y-3">
              {question.options.map((option) => (
                <div
                  key={option.order}
                  className="flex items-center space-x-3 ps-4 border rounded-lg hover:bg-gray-50 cursor-pointer "
                >
                  <RadioGroupItem
                    className={`${
                      selectedAnswer.choices[0].optionOrder === option.order
                        ? "bg-gray-500"
                        : ""
                    }`}
                    value={option.order.toString()}
                    id={`option-${option.order}`}
                  />
                  <Label
                    htmlFor={`option-${option.order}`}
                    className="flex-1 cursor-pointer p-4"
                  >
                    {option.value}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() =>
                setCurrentQuestion(Math.max(0, currentQuestion - 1))
              }
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <Button
              variant={"ghost"}
              className="bg-black text-white"
              onClick={handleNext}
              disabled={selectedAnswer === answerInit}
            >
              {currentQuestion === testInfo.questions.length - 1
                ? "Submit"
                : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TakeTest;
