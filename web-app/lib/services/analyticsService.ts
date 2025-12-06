// Analytics Service - Currently not implemented in backend
// This will be a placeholder for future analytics features

import { api } from "../api";
import studentApi from "../studentApi";

export interface CourseAnalytics {
  courseId: string;
  courseName: string;
  totalStudents: number;
  activeStudents: number;
}

export interface StudentAssignmentGradesRequest {
  createdAfter: number;
  createdBefore: number;
  assignmentId: string;
}

// Analytics features are not yet implemented in the teaching service
// These are placeholder methods for future implementation
const analyticsService = {
  // Placeholder - to be implemented
  getCourseAnalytics: async (
    courseId: string
  ): Promise<CourseAnalytics | null> => {
    console.warn("Analytics not yet implemented in backend");
    return null;
  },

  // Placeholder - to be implemented
  getAllCoursesAnalytics: async (): Promise<CourseAnalytics[]> => {
    console.warn("Analytics not yet implemented in backend");
    return [];
  },

  getStudentAnalyticsYearly: async (): Promise<any> => {
    const res = await studentApi.get(`/learning/analyzer/reports/yearly`);

    return res;
  },

  getStudentAnalyticsMonthly: async (): Promise<any> => {
    const res = await studentApi.get(`/learning/analyzer/reports/monthly`);

    return res;
  },

  getStudentAssignmentGrades: async (
    request: StudentAssignmentGradesRequest
  ): Promise<any> => {
    const res = await studentApi.post(
      `/learning/analyzer/submissions/search`,
      request
    );

    return res;
  },
};

export default analyticsService;
