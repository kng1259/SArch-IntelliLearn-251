// Course Service - API calls for course management (Teaching Service)

import { api } from '../api';
import studentApi from '../studentApi';

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
    const response = await api.get<ApiResponse<Course[]>>(`/course/tutor/${tutorId}`);
    return response.data;
  },

  // Create new course
  // POST /course
  createCourse: async (courseData: CourseRequest): Promise<Course> => {
    const response = await api.post<ApiResponse<Course>>('/course', courseData);
    return response.data;
  },

  // Update course
  // PUT /course/{courseId}
  updateCourse: async (courseId: string, courseData: CourseRequest): Promise<Course> => {
    const response = await api.put<ApiResponse<Course>>(`/course/${courseId}`, courseData);
    return response.data;
  },

  // Get students in a course
  // GET /student/course/{courseId}
  getCourseStudents: async (courseId: string): Promise<Student[]> => {
    const response = await api.get<ApiResponse<Student[]>>(`/student/course/${courseId}`);
    return response.data;
  },

  // Learning Materials
  // POST /learning-material
  createLearningMaterial: async (material: LearningMaterialRequest): Promise<LearningMaterial> => {
    const response = await api.post<ApiResponse<LearningMaterial>>('/learning-material', material);
    return response.data;
  },

  // DELETE /learning-material/{materialId}
  deleteLearningMaterial: async (materialId: string): Promise<void> => {
    await api.delete<ApiResponse<void>>(`/learning-material/${materialId}`);
  },

  // Feedback
  // POST /feedback
  createFeedback: async (feedback: FeedbackRequest): Promise<FeedbackRequest> => {
    const response = await api.post<ApiResponse<FeedbackRequest>>('/feedback', feedback);
    return response.data;
  },

  getRecommendedCourses: async (): Promise<Course[]> => {
    const response = await studentApi.get<Course[]>(
      "/learning/course/recommended"
    );
    return response;
  },

  getCourseDetails: async (courseId: string): Promise<Course> => {
    const response = await studentApi.get<Course>(`/learning/course/${courseId}`);
    return response;
  }
};

export default courseService;
