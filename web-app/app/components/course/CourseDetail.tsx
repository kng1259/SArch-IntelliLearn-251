import {
  ClipboardList,
  CheckCircle,
  PlayCircle,
  FileText,
  BookOpen,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import Loader from "@/app/components/Loader";
import courseService, { CourseData } from "@/lib/services/courseService";
import { useEffect, useRef, useState } from "react";
import { Feedback } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import assessmentService from "@/lib/services/assessmentService";

const CourseDetail = ({
  id,
  isEnrolled,
}: {
  id: string;
  isEnrolled: boolean;
}) => {
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [enrolled, setEnrolled] = useState(isEnrolled);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const ALLOWED_FILE_TYPES = ".pdf, .doc, .docx, .zip";
  const MAX_FILES = 1;

  const router = useRouter();

  useEffect(() => {
    const getCourseDetails = async () => {
      try {
        const res = await courseService.getCourseDetails(id);
        setCourseData(res);

        const courseFeedbacks = await courseService.getCourseFeedbacks(id);
        setFeedbacks(courseFeedbacks);
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
      }
    };
    getCourseDetails();
  }, [id]);

  const handleEnroll = () => {
    try {
      courseService.enrollCourse(id);
      setEnrolled(true);
      router.push(`/student/my-courses/${id}`);
    } catch (error) {
      console.error("Error enrolling in course:", error);
    }
  };

  const handleStartQuiz = async (quizId: string) => {
    router.push(
      `/student/my-courses/${courseData?.course.id}/quizzes/${quizId}`
    );
  };

  const handleStartExam = async (examId: string) => {
    router.push(`/student/my-courses/${courseData?.course.id}/exams/${examId}`);
  };

  const handleSubmitAssignment = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files) return;

    if (files.length > MAX_FILES) {
      alert(`You can only upload ${MAX_FILES} file.`);
      event.target.value = "";
      return;
    }

    const allowedFileTypes = ALLOWED_FILE_TYPES.split(", ");
    const allowedFileTypesRegex = new RegExp(
      `(${allowedFileTypes.join("|")})$`
    );

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = file.name.toLowerCase();

      if (!allowedFileTypesRegex.test(fileName)) {
        alert(`File ${file.name} not allowed.`);
        event.target.value = "";
        return;
      }
    }

    setFiles(Array.from(files));
  };

  const handleUploadAssignment = async (assignmentId: string) => {
    try {
      const res = await assessmentService.submitAssignment({
        fileName: files[0].name,
        content: files[0].type,
        assignmentId: assignmentId,
      });
    } catch (error) {
      console.error("Error uploading assignment:", error);
    } finally {
      setFiles([]);
    }
  };

  return (
    <>
      {courseData ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <div className="aspect-video relative overflow-hidden rounded-lg mb-6">
                <Image
                  src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800"
                  alt={courseData.course.name}
                  className="w-full h-full object-cover"
                  width={1920}
                  height={100}
                />
              </div>
              <div className="flex items-center gap-2 mb-4">
                {/* <Badge>{course.category}</Badge> */}
                {enrolled && (
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    Enrolled
                  </Badge>
                )}
              </div>
              <h2 className="text-black mb-4">{courseData.course.name}</h2>
              <p className="text-gray-600 mb-6">
                {courseData.course.description}
              </p>

              {/* <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{course.enrolledStudents.toLocaleString()} students</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span>{course.rating} rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{course.duration}</span>
              </div>
            </div> */}

              <p className="text-sm text-gray-600">
                Instructor:{" "}
                <span className="text-gray-900">
                  {courseData.course.tutorId}
                </span>
              </p>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-black">Course Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {enrolled ? (
                    <>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">
                            Overall Progress
                          </span>
                          <span className="text-indigo-600">
                            {/* {course.progress}% */}
                            60%
                          </span>
                        </div>
                        {/* <Progress value={course.progress} className="h-2" /> */}
                        <Progress value={60} className="h-2" />
                      </div>
                      <div className="pt-4 border-t space-y-2">
                        <Button
                          className="w-full text-black"
                          onClick={() =>
                            router.push(
                              `/student/my-courses/${courseData.course.id}/content`
                            )
                          }
                        >
                          Continue Learning
                        </Button>
                        <Button
                          className="w-full text-black"
                          variant="outline"
                          onClick={() => router.push(`/student/grades`)}
                        >
                          View Grades
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600">
                        Start learning today and gain new skills
                      </p>
                      <Button
                        variant={"ghost"}
                        className="w-full bg-black text-white!"
                        onClick={handleEnroll}
                      >
                        Enroll in Course
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Course Content */}
          {enrolled && (
            <Tabs defaultValue="content" className="space-y-6">
              <TabsList>
                <TabsTrigger value="content">Course Content</TabsTrigger>
                <TabsTrigger value="feedback">Course Feedback</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4">
                <Accordion type="single" collapsible className="space-y-4">
                  <AccordionItem
                    value={courseData.course.id}
                    className="bg-white rounded-lg border px-6"
                  >
                    <AccordionTrigger>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500">Course details</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-6 pt-4">
                        {/* Materials */}
                        {courseData.materials &&
                          courseData.materials.length > 0 && (
                            <div>
                              <h4 className="text-black mb-3">
                                Learning Materials
                              </h4>
                              <div className="space-y-2">
                                {courseData.materials.map((material) => (
                                  <div
                                    key={material.id}
                                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div>
                                        <p className="text-black text-sm">
                                          {material.name}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        {/* Quizzes */}
                        {courseData.quizzes &&
                          courseData.quizzes.length > 0 && (
                            <div>
                              <h4 className="text-black mb-3">Quizzes</h4>
                              <div className="space-y-2">
                                {courseData.quizzes.map((quiz) => (
                                  <Card key={quiz.id}>
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-2">
                                        <ClipboardList className="w-5 h-5" />
                                        {quiz.name}
                                      </CardTitle>
                                      <CardDescription>
                                        {quiz.description}
                                      </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-600 space-y-1">
                                          <p>
                                            Time Limit: {quiz.duration} minutes
                                          </p>
                                          <div className="flex gap-5">
                                            <p>
                                              Start Date:{" "}
                                              {new Date(
                                                quiz.startAt
                                              ).toLocaleDateString()}
                                            </p>
                                            <p>
                                              Due Date:{" "}
                                              {new Date(
                                                quiz.endAt
                                              ).toLocaleDateString()}
                                            </p>
                                          </div>
                                          <p>Difficulity: {quiz.level}</p>
                                        </div>
                                        <Button
                                          variant="outline"
                                          onClick={() =>
                                            handleStartQuiz(quiz.id)
                                          }
                                        >
                                          Start Quiz
                                        </Button>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          )}

                        {/* Assignments */}
                        {courseData.assignments &&
                          courseData.assignments.length > 0 && (
                            <div>
                              <h4 className="text-black mb-3">Assignments</h4>
                              <div className="space-y-2">
                                {courseData.assignments.map((assignment) => (
                                  <Card key={assignment.id}>
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        {assignment.name}
                                      </CardTitle>
                                      <CardDescription>
                                        {assignment.description}
                                      </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-600 space-y-1">
                                          <div className="flex gap-5">
                                            <p>
                                              Start Date:{" "}
                                              {new Date(
                                                assignment.startAt
                                              ).toLocaleDateString()}
                                            </p>
                                            <p>
                                              Due Date:{" "}
                                              {new Date(
                                                assignment.endAt
                                              ).toLocaleDateString()}
                                            </p>
                                          </div>
                                          <div className="flex gap-5">
                                            <p>
                                              Instruction:{" "}
                                              <a
                                                className="underline text-blue-500"
                                                href={assignment.instruction}
                                                target="_blank"
                                              >
                                                Click here
                                              </a>
                                            </p>
                                            <p>
                                              Grading guidelines:{" "}
                                              <a
                                                className="underline text-blue-500"
                                                href={
                                                  assignment.gradingGuidelines
                                                }
                                                target="_blank"
                                              >
                                                Click here
                                              </a>
                                            </p>
                                          </div>
                                        </div>
                                        <div>
                                          <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept={ALLOWED_FILE_TYPES}
                                            onChange={handleFileChange}
                                          />
                                          {files.length > 0 ? (
                                            <Button
                                              variant="outline"
                                              onClick={() => {
                                                handleUploadAssignment(
                                                  assignment.id
                                                );
                                              }}
                                            >
                                              Upload
                                            </Button>
                                          ) : (
                                            <Button
                                              variant={"outline"}
                                              onClick={handleSubmitAssignment}
                                            >
                                              Submit
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          )}

                        {/* Exams */}
                        {courseData.exams && courseData.exams.length > 0 && (
                          <div>
                            <h4 className="text-black mb-3">Exams</h4>
                            <div className="space-y-2">
                              {courseData.exams.map((exam) => (
                                <Card key={exam.id}>
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                      <FileText className="w-5 h-5" />
                                      {exam.name}
                                    </CardTitle>
                                    <CardDescription>
                                      {exam.description}
                                    </CardDescription>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="flex items-center justify-between">
                                      <div className="text-sm text-gray-600 space-y-1">
                                        <p>
                                          Due Date:{" "}
                                          {new Date(
                                            exam.endAt
                                          ).toLocaleDateString()}
                                        </p>
                                        <p>Duration: {exam.duration} minutes</p>
                                      </div>
                                      <Button
                                        variant={"outline"}
                                        onClick={() => handleStartExam(exam.id)}
                                      >
                                        Start Exam
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>

              <TabsContent value="feedback">
                <Card>
                  <CardHeader>
                    <CardDescription>
                      See what turor feel about your work
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6 pt-4">
                      {feedbacks && feedbacks.length > 0 && (
                        <div>
                          <div className="space-y-2">
                            {feedbacks.map((fb) => (
                              <Card key={fb.id}>
                                <CardHeader>
                                  <CardTitle className="flex items-center justify-between gap-2">
                                    <span className="text-black">
                                      By teacherId: {fb.teacherId}
                                    </span>
                                    <span>
                                      {fb.createdAt.split("T")[0]} at{" "}
                                      {fb.createdAt
                                        .split("T")[1]
                                        .split(":")
                                        .slice(0, 2)
                                        .join(":")}
                                    </span>
                                  </CardTitle>
                                  <CardDescription>
                                    {fb.content}
                                  </CardDescription>
                                </CardHeader>
                                <CardContent></CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default CourseDetail;
