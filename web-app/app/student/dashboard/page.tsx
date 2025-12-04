"use client";

import {
  BookOpen,
  LogOut,
  User,
  TrendingUp,
  Award,
  Clock,
  BarChart3,
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
import { mockCourses } from "@/data/mockData";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import authService, { UserInfo } from "@/lib/services/authService";
import courseService, { Course } from "@/lib/services/courseService";

export default function StudentDashboard() {
  const router = useRouter();
  const enrolledCourses = mockCourses.filter((c) => c.isEnrolled);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[] | null>(
    null
  );
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const avgProgress =
    enrolledCourses.reduce((sum, c) => sum + (c.progress || 0), 0) /
      enrolledCourses.length || 0;

  const getRecommendedCourses = async () => {
    try {
      const res = await courseService.getRecommendedCourses();
      console.log("Recommended courses:", res);
      setRecommendedCourses(res);
    } catch (error) {
      console.error("Error fetching recommended courses:", error);
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await authService.getUserInfo();
        console.log("User info:", res);
        setUserInfo(res);
        getRecommendedCourses();
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchUserInfo();
  }, []);

  const onSignOut = async () => {
    await authService.logout().then(() => router.push("/signin"));
    console.log("User signed out");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-indigo-600" />
              <h1 className="text-indigo-900">EduLearn LMS</h1>
            </div>
            <div className="flex items-center gap-4 ">
              <Button
                className="hover:cursor-pointer"
                variant="ghost"
                onClick={() => console.log("Navigate to grades")}
              >
                <Award className="w-4 h-4 mr-2" />
                My Grades
              </Button>
              <Button
                className="hover:cursor-pointer"
                variant="ghost"
                onClick={() => console.log("Navigate to profile")}
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button
                className="hover:cursor-pointer border-red-600"
                variant="outline"
                onClick={onSignOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-black">Welcome back, {userInfo?.name}!</h2>
          <p className="text-gray-600 mt-1">Continue your learning journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">
                Enrolled Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-indigo-600">
                  {enrolledCourses.length}
                </span>
                <span className="text-sm text-gray-500">active</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">
                Average Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-indigo-600">
                  {Math.round(avgProgress)}%
                </span>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">
                Assignments Due
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-indigo-600">2</span>
                <Clock className="w-4 h-4 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">
                Overall Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="ghost"
                className="p-0 h-auto hover:bg-transparent"
                onClick={() => console.log("View Analytics")}
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-indigo-600">View Analytics</span>
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Enrolled Courses */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-black">My Courses</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <Card
                key={course.id}
                className="hover:shadow-lg hover:cursor-pointer hover:opacity-90 transition-shadow cursor-pointer"
                onClick={() => {
                  console.log(`Navigate to course ${course.id}`);
                  router.push(`/student/my-courses/${course.id}`);
                }}
              >
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    width={800}
                    height={100}
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-indigo-600">Enrolled</Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-2 text-black">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2 text-gray-400">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="text-indigo-600">
                          {course.progress}%
                        </span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                    <div className="text-sm text-gray-500">
                      Instructor: {course.tutorName}
                    </div>
                    <Button
                      className="w-full bg-black text-white!"
                      variant={"ghost"}
                      onClick={() =>
                        console.log(`Continue learning ${course.id}`)
                      }
                    >
                      Continue Learning
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Recommended Courses */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-black">Recommended Courses</h3>
              <p className="text-gray-600 mt-1">
                Based on your interests and goals
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Suspense
              fallback={<div className="text-xl text-black">Loading...</div>}
            >
              {recommendedCourses &&
                recommendedCourses.map((course) => (
                  <Card
                    key={course.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <Image
                        src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800"
                        alt={course.name}
                        className="w-full h-full object-cover"
                        width={800}
                        height={100}
                      />
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="line-clamp-2 text-black">
                          {course.name}
                        </CardTitle>
                      </div>
                      <CardDescription className="line-clamp-2 text-gray-400">
                        {course.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">
                            {course.startAt.split("T")[0]} -{" "}
                            {course.endAt?.split("T")[0]}
                          </span>
                        </div>
                        <Button
                          className="w-full"
                          variant="outline"
                          onClick={() => {
                            router.push(`/student/courses/${course.id}`);
                            console.log(`View course ${course.id}`);
                          }}
                        >
                          View Course
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </Suspense>
          </div>
        </section>
      </main>
    </div>
  );
}
