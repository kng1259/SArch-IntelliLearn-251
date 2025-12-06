"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import courseService, {
  Assignment,
  CourseData,
} from "@/lib/services/courseService";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import analyticsService from "@/lib/services/analyticsService";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type AssignmentGrades = {
  assignmentId: string;
  content: string;
  createdAt: number;
  fileName: string;
  score: number;
  studentId: string;
};

const GradesPage = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<CourseData[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assignmentGrades, setAssignmentGrades] = useState<AssignmentGrades[]>(
    []
  );
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    Promise.resolve(() => {})
      .then(() =>
        setStartDate(
          new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0]
        )
      )
      .then(() => {
        setEndDate(new Date().toISOString().split("T")[0]);
      });
  }, []);

  useEffect(() => {
    const getCoursesAssignments = async (): Promise<Assignment[]> => {
      let enrolledCoursesId = null;

      if (typeof window !== "undefined") {
        enrolledCoursesId = JSON.parse(
          localStorage.getItem("enrolledCourseIds") ?? "null"
        );
      }

      if (!enrolledCoursesId) {
        try {
          const res = await courseService.getEnrolledCourses();

          enrolledCoursesId = res.map((c) => c.id);

          if (typeof window !== "undefined") {
            localStorage.setItem(
              "enrolledCourseIds",
              JSON.stringify(enrolledCoursesId)
            );
          }
        } catch (err) {
          console.error(err);
          return [];
        }
      }

      const courses = await Promise.all(
        enrolledCoursesId.map((id: string) =>
          courseService.getCourseDetails(id)
        )
      );

      setEnrolledCourses(courses);

      return courses.flatMap((c) => c.assignments ?? []);
    };
    getCoursesAssignments().then(setAssignments);
  }, []);

  useEffect(() => {
    const handleSearchAssignmentSubmits = async () => {
      try {
        const res = await Promise.all(
          assignments.map((a) =>
            analyticsService.getStudentAssignmentGrades({
              assignmentId: a.id,
              createdAfter: Date.parse(startDate),
              createdBefore: Date.parse(endDate),
            })
          )
        );
        setAssignmentGrades(res[0]);
      } catch (err) {
        console.error(err);
      }
    };
    handleSearchAssignmentSubmits();
  }, [assignments, startDate, endDate]);

  return (
    <>
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
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl mb-2">Grades & Results</h1>
          <p className="text-gray-600">Track your academic performance</p>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Start date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            placeholder="End date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <Tabs defaultValue="tests" className="w-full">
          <TabsList className="gap-3">
            <TabsTrigger value="tests">Tests</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
          </TabsList>

          <TabsContent value="assignments" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Assignment Results</CardTitle>
                <CardDescription>View your graded assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assignmentGrades &&
                    assignmentGrades.map((assignment) => {
                      return (
                        <div
                          key={assignment.assignmentId}
                          className="p-4 border rounded-lg"
                        >
                          <div className="flex justify-between items-center mb-3">
                            <div>
                              <h4 className="mb-1">{assignment.fileName}</h4>
                              <p className="text-sm text-gray-600">
                                {assignment.content}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl">
                                Your score: {assignment.score}/100
                              </p>
                            </div>
                          </div>
                          {/* <Progress value={percentage} className="mb-3" />
                      {assignment.feedback && (
                        <div className="bg-gray-50 p-3 rounded text-sm">
                          <p className="mb-1">Feedback:</p>
                          <p className="text-gray-700">{assignment.feedback}</p>
                        </div>
                      )} */}
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tests" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
                <CardDescription>Your performance on tests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="uppercase font-bold">In developing</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default GradesPage;
