// Grading Service - Currently not implemented in backend
// This will be a placeholder for future grading features

import { api } from '../api';

export interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  submittedAt: string;
  status: 'pending' | 'graded';
}

// Grading features are not yet implemented in the teaching service
// These are placeholder methods for future implementation
const gradingService = {
  // Placeholder - to be implemented
  getPendingTasks: async (): Promise<Submission[]> => {
    console.warn('Grading service not yet implemented in backend');
    return [];
  },

  // Placeholder - to be implemented
  getSubmissions: async (courseId: string): Promise<Submission[]> => {
    console.warn('Grading service not yet implemented in backend');
    return [];
  },
};

export default gradingService;
