// Course Service - API calls for course management (Teaching Service)

import { api } from "../api";
import studentApi from "../studentApi";
import { Feedback } from "../types";

// API Response wrapper from backend
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Course types matching backend CourseRequest/CourseResponse
export interface Course {
  id: string;
  name: string;
  description: string;
  startAt: string; // ISO datetime
  endAt?: string; // ISO datetime
  createdAt?: string; // ISO datetime
  tutorId?: string;
}
export interface CourseData {
  course: Course;
  materials?: Material[];
  assignments?: Assignment[];
  quizzes?: StudentTest[];
  exams?: StudentTest[];
}

interface Material {
  id: string;
  name: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface Assignment {
  id: string;
  name: string;
  description: string;
  startAt: string;
  endAt: string;
  createdAt: string;
  instruction: string;
  gradingGuidelines: string;
}

interface QuestionOption {
  order: number;
  value: string;
  correct: boolean;
}

interface Question {
  id: string;
  content: string;
  options: QuestionOption[];
}

export interface StudentTest {
  id: string;
  name: string;
  description: string;
  startAt: string;
  endAt: string;
  createdAt: string;
  duration: number;
  questions: Question[];
  level?: string;
  attemptId: string;
}

export interface CourseRequest {
  name: string;
  description: string;
  startAt: string; // ISO datetime
  endAt: string; // ISO datetime
}

// Learning Material types matching backend
export interface LearningMaterial {
  id?: string;
  name: string;
  content: string;
  courseId: string;
}

export interface LearningMaterialRequest {
  name: string;
  content: string;
  courseId: string;
}

// Student types matching backend
export interface Student {
  id: string;
  fullName: string;
}

// Feedback types matching backend
export interface FeedbackRequest {
  studentId: string;
  courseId: string;
  content: string;
}

const courseService = {
  // Get courses by tutor ID
  // GET /course/tutor/{tutorId}
  getCoursesByTutor: async (tutorId: string): Promise<Course[]> => {
    // api.get already unwraps ApiResponse.data, so we get Course[] directly
    return api.get<Course[]>(`/course/tutor/${tutorId}`);
  },

  // Create new course
  // POST /course
  createCourse: async (courseData: CourseRequest): Promise<Course> => {
    // api.post already unwraps ApiResponse.data, so we get Course directly
    return api.post<Course>("/course", courseData);
  },

  // Update course
  // PUT /course/{courseId}
  updateCourse: async (
    courseId: string,
    courseData: CourseRequest
  ): Promise<Course> => {
    return api.put<Course>(`/course/${courseId}`, courseData);
  },

  // Get students in a course
  // GET /student/course/{courseId}
  getCourseStudents: async (courseId: string): Promise<Student[]> => {
    return api.get<Student[]>(`/student/course/${courseId}`);
  },

  // Learning Materials
  // POST /learning-material
  createLearningMaterial: async (
    material: LearningMaterialRequest
  ): Promise<LearningMaterial> => {
    return api.post<LearningMaterial>("/learning-material", material);
  },

  // DELETE /learning-material/{materialId}
  deleteLearningMaterial: async (materialId: string): Promise<void> => {
    await api.delete<void>(`/learning-material/${materialId}`);
  },

  // Feedback
  // POST /feedback
  createFeedback: async (
    feedback: FeedbackRequest
  ): Promise<FeedbackRequest> => {
    return api.post<FeedbackRequest>("/feedback", feedback);
  },

  getEnrolledCourses: async (): Promise<Course[]> => {
    const response = await studentApi.get<Course[]>(
      "/learning/my-courses"
    );
    return response;
  },

  getRecommendedCourses: async (): Promise<Course[]> => {
    const response = await studentApi.get<Course[]>(
      "/learning/course/recommended"
    );
    return response;
  },

  getCourseDetails: async (courseId: string): Promise<CourseData> => {
    const response = await studentApi.get<CourseData>(
      `/learning/course/${courseId}/details`
    );
    return response;
  },

  getCourseFeedbacks: async (courseId: string): Promise<Feedback[]> => {
    const response = await studentApi.get<Feedback[]>(
      `/learning/course/${courseId}/feedback`
    );
    return response;
  },

  enrollCourse: async (courseId: string): Promise<string> => {
    const response = await studentApi.post<string>(
      `/learning/course/${courseId}/enroll`
    );
    return response;
  },
};

export default courseService;
