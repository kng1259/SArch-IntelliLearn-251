"use client";

import {
  ArrowLeft,
  BookOpen,
  PlayCircle,
  FileText,
  ClipboardList,
  CheckCircle,
  Clock,
  Star,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { mockCourses, mockFeedbacks } from "@/data/mockData";
import { use, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import courseService, { Course } from "@/lib/services/courseService";
import Loader from "@/app/components/Loader";

export default function CourseDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [course, setCourse] = useState<Course | null>(null);
  const mockCourse = mockCourses.find((c) => c.id === "1");
  const feedbacks = useMemo(
    () => mockFeedbacks.find((f) => f.courseId === id && f.studentId === "101"),
    [id]
  );
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    const getCourseDetails = async () => {
      try {
        const res = await courseService.getCourseDetails(id);
        console.log("Course details:", res);
        setCourse(res);
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
      }
    };
    getCourseDetails();
  }, [id]);

  const handleEnroll = () => {
    setEnrolled(true);
  };

  const handleStartQuiz = (quizId: string) => {
    console.log(`Starting quiz with ID: ${quizId}`);
  };

  const handleViewAssignment = (assignmentId: string) => {
    console.log(`Viewing assignment with ID: ${assignmentId}`);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "video":
        return <PlayCircle className="w-4 h-4" />;
      case "document":
        return <FileText className="w-4 h-4" />;
      case "slides":
        return <BookOpen className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/student/dashboard")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Hero */}
        {course ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2">
                <div className="aspect-video relative overflow-hidden rounded-lg mb-6">
                  <Image
                    src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800"
                    alt={course.name}
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
                <h2 className="text-black mb-4">{course.name}</h2>
                <p className="text-gray-600 mb-6">{course.description}</p>

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
                  <span className="text-gray-900">{course.tutorId}</span>
                </p>
              </div>

              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Course Progress</CardTitle>
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
                            className="w-full"
                            onClick={() =>
                              router.push(
                                `/student/my-courses/${course.id}/content`
                              )
                            }
                          >
                            Continue Learning
                          </Button>
                          <Button
                            className="w-full"
                            variant="outline"
                            onClick={() =>
                              router.push(
                                `/student/my-courses/${course.id}/grades`
                              )
                            }
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
                        <Button className="w-full" onClick={handleEnroll}>
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
                    {mockCourse?.modules?.map((module, index) => (
                      <AccordionItem
                        key={module.id}
                        value={module.id}
                        className="bg-white rounded-lg border px-6"
                      >
                        <AccordionTrigger>
                          <div className="flex items-center gap-3">
                            <span className="text-gray-500">
                              Module {index + 1}
                            </span>
                            <span className="text-black">{module.title}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-6 pt-4">
                            {/* Materials */}
                            {module.materials.length > 0 && (
                              <div>
                                <h4 className="text-black mb-3">
                                  Learning Materials
                                </h4>
                                <div className="space-y-2">
                                  {module.materials.map((material) => (
                                    <div
                                      key={material.id}
                                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="text-indigo-600">
                                          {getIcon(material.type)}
                                        </div>
                                        <div>
                                          <p className="text-black text-sm">
                                            {material.title}
                                          </p>
                                          {material.duration && (
                                            <p className="text-xs text-gray-500">
                                              {material.duration}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                      {material.completed && (
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Quizzes */}
                            {module.quizzes.length > 0 && (
                              <div>
                                <h4 className="text-black mb-3">Quizzes</h4>
                                <div className="space-y-2">
                                  {module.quizzes.map((quiz) => (
                                    <Card key={quiz.id}>
                                      <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                          <ClipboardList className="w-5 h-5" />
                                          {quiz.title}
                                        </CardTitle>
                                        <CardDescription>
                                          {quiz.description}
                                        </CardDescription>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="flex items-center justify-between">
                                          <div className="text-sm text-gray-600 space-y-1">
                                            <p>
                                              Time Limit: {quiz.duration}{" "}
                                              minutes
                                            </p>
                                            <p>
                                              Passing Score: {quiz.passingScore}
                                              %
                                            </p>
                                            <p>
                                              Attempts: {quiz.attempts}/
                                              {quiz.attempts}
                                            </p>
                                          </div>
                                          <Button
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
                            {module.assignments.length > 0 && (
                              <div>
                                <h4 className="text-black mb-3">Assignments</h4>
                                <div className="space-y-2">
                                  {module.assignments.map((assignment) => (
                                    <Card key={assignment.id}>
                                      <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                          <FileText className="w-5 h-5" />
                                          {assignment.title}
                                        </CardTitle>
                                        <CardDescription>
                                          {assignment.description}
                                        </CardDescription>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="flex items-center justify-between">
                                          <div className="text-sm text-gray-600 space-y-1">
                                            <p>
                                              Due Date:{" "}
                                              {new Date(
                                                assignment.dueDate
                                              ).toLocaleDateString()}
                                            </p>
                                            <p>Max Score: {assignment.grade}</p>
                                            {assignment.status ==
                                              "submitted" && (
                                              <Badge className="bg-green-500">
                                                Submitted
                                              </Badge>
                                            )}
                                          </div>
                                          <Button
                                            variant={
                                              assignment.status === "submitted"
                                                ? "outline"
                                                : "default"
                                            }
                                            onClick={() =>
                                              handleViewAssignment(
                                                assignment.id
                                              )
                                            }
                                          >
                                            {assignment.status === "submitted"
                                              ? "View Submission"
                                              : "Submit Assignment"}
                                          </Button>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Exams */}
                            {module.exams.length > 0 && (
                              <div>
                                <h4 className="text-black mb-3">Exams</h4>
                                <div className="space-y-2">
                                  {module.exams.map((exam) => (
                                    <Card key={exam.id}>
                                      <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                          <FileText className="w-5 h-5" />
                                          {exam.title}
                                        </CardTitle>
                                        <CardDescription>
                                          {exam.description}
                                        </CardDescription>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="flex items-center justify-between">
                                          <div className="text-sm text-gray-600 space-y-1">
                                            <p>
                                              Date:{" "}
                                              {new Date(
                                                exam.date
                                              ).toLocaleDateString()}
                                            </p>
                                            <p>
                                              Duration: {exam.duration} minutes
                                            </p>
                                          </div>
                                          <Button
                                            onClick={() =>
                                              console.log("Starting exam")
                                            }
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
                    ))}
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
                        {feedbacks?.generalFeedbacks &&
                          feedbacks.generalFeedbacks.length > 0 && (
                            <div>
                              <h4 className="text-black mb-3">General</h4>
                              <div className="space-y-2">
                                {feedbacks.generalFeedbacks.map((fb) => (
                                  <Card key={fb.id}>
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-2">
                                        {fb.title}{" "}
                                        {fb.date && (
                                          <span>
                                            (
                                            {new Date(
                                              fb.date
                                            ).toLocaleDateString()}
                                            )
                                          </span>
                                        )}
                                      </CardTitle>
                                      <CardDescription>
                                        {fb.message}
                                      </CardDescription>
                                    </CardHeader>
                                    <CardContent></CardContent>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          )}
                        {feedbacks?.quizFeedbacks &&
                          feedbacks.quizFeedbacks.length > 0 && (
                            <div>
                              <h4 className="text-black mb-3">Quizzes</h4>
                              <div className="space-y-2">
                                {feedbacks.quizFeedbacks.map((fb) => (
                                  <Card key={fb.id}>
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-2">
                                        <ClipboardList className="w-5 h-5" />
                                        {fb.quiz_titile}
                                      </CardTitle>
                                      <CardDescription>
                                        {fb.description}
                                      </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-600 space-y-1">
                                          <p className="text-md text-black">
                                            {fb.title}:
                                          </p>
                                          <p>{fb.message}</p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          )}
                        {feedbacks?.assignmentFeedbacks &&
                          feedbacks.assignmentFeedbacks.length > 0 && (
                            <div>
                              <h4 className="text-black mb-3">Assignments</h4>
                              <div className="space-y-2">
                                {feedbacks.assignmentFeedbacks.map((fb) => (
                                  <Card key={fb.id}>
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-2">
                                        <ClipboardList className="w-5 h-5" />
                                        {fb.assignment_title}
                                      </CardTitle>
                                      <CardDescription>
                                        {fb.description}
                                      </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-600 space-y-1">
                                          <p className="text-md text-black">
                                            {fb.title}:
                                          </p>
                                          <p>{fb.message}</p>
                                        </div>
                                      </div>
                                    </CardContent>
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
      </main>
    </div>
  );
}
