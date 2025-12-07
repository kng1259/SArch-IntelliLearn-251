// Grading Service - API for managing assignment submissions and grading

import { api } from '../api';

export interface PendingSubmission {
  assignmentId: string;
  assignmentName: string;
  courseId: string;
  courseName: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  content: string;
}

export interface Submission {
  assignmentId: string;
  assignmentName: string;
  studentId: string;
  studentName: string;
  fileName: string;
  content: string;
  score: number;
  feedback: string | null;
  submittedAt: string;
  graded: boolean;
}

export interface GradingRequest {
  fileName: string;
  score: number;
  feedback: string;
}

const gradingService = {
  // Get all pending submissions that need grading
  getPendingSubmissions: async (): Promise<PendingSubmission[]> => {
    return api.get<PendingSubmission[]>('/submission/pending');
  },

  // Get all submissions for a specific assignment
  getSubmissionsByAssignment: async (assignmentId: string): Promise<Submission[]> => {
    return api.get<Submission[]>(`/submission/assignment/${assignmentId}`);
  },

  // Grade a submission
  gradeSubmission: async (assignmentId: string, studentId: string, request: GradingRequest): Promise<void> => {
    return api.patch<void>(`/submission/${assignmentId}/${studentId}`, request);
  },
};

export default gradingService;
