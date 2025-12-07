// Analytics Service - API calls for analytics features (Teaching Service)

import { api } from "../api";
import studentApi from "../studentApi";

// ============ Course Analysis Types ============
export interface CourseCompletionResponse {
  completed: number;
  inProgress: number;
  notStarted: number;
}

export interface MonthlyStudentEnrollmentStatsResponse {
  month: string;
  count: number;
}

export interface CourseAnalysisResponse {
  totalStudents: number;
  avgCompletionPercentage: number;
  courseCompletionResponse: CourseCompletionResponse;
  monthlyStudentEnrollmentStats: MonthlyStudentEnrollmentStatsResponse[];
}

// ============ Quiz Analysis Types ============
export interface QuizAnalysisResponse {
  id: string;
  name: string;
  avgScore: number;
  totalAttempts: number;
  passRate: number;
}

// ============ Exam Analysis Types ============
export interface ExamAnalysisResponse {
  id: string;
  name: string;
  avgScore: number;
  totalStudents: number;
  passRate: number;
}

// ============ Assignment Analysis Types ============
export interface AssignmentAnalysisResponse {
  id: string;
  name: string;
  totalSubmitted: number;
  totalPending: number;
  avgScore: number;
}

// ============ Study Time Analysis Types ============
export interface WeeklyStudyTimeStatsResponse {
  week: string; // Format: "YYYY-WW" or "YYYY-MM-DD to YYYY-MM-DD"
  totalMinutes: number;
}

export interface StudentStudyTimeRankingResponse {
  studentId: string;
  studentName: string;
  totalMinutes: number;
  rank: number;
}

export interface StudyTimeAnalysisResponse {
  weeklyStats: WeeklyStudyTimeStatsResponse[];
  top5MostStudied: StudentStudyTimeRankingResponse[];
  top5LeastStudied: StudentStudyTimeRankingResponse[];
  totalStudyTimeMinutes: number;
}

// ============ Full Report Response ============
export interface ReportResponse {
  courseAnalysis: CourseAnalysisResponse;
  quizAnalysis: QuizAnalysisResponse[];
  examAnalysis: ExamAnalysisResponse[];
  assignmentAnalysis: AssignmentAnalysisResponse[];
  studyTimeAnalysis: StudyTimeAnalysisResponse;
}

// Legacy type for backward compatibility
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

const analyticsService = {
  // ============ Teaching Analyzer APIs ============
  
  // Get course analysis report
  // GET /analysis/course/{courseId}
  getCourseAnalysisReport: async (courseId: string): Promise<ReportResponse> => {
    return api.get<ReportResponse>(`/analysis/course/${courseId}`);
  },

  // Legacy placeholder methods
  getCourseAnalytics: async (
    courseId: string
  ): Promise<CourseAnalytics | null> => {
    console.warn("Use getCourseAnalysisReport instead");
    return null;
  },

  getAllCoursesAnalytics: async (): Promise<CourseAnalytics[]> => {
    console.warn("Analytics not yet implemented for all courses");
    return [];
  },

  // ============ Student Analytics APIs ============
  
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
