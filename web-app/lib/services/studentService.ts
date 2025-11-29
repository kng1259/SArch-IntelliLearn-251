// Student Service - Integrated with Course Service
// Student data is retrieved via courseService.getCourseStudents()

import courseService, { Student, ApiResponse } from './courseService';

// Re-export Student type
export type { Student };

const studentService = {
  // Get students in a specific course
  // Uses courseService.getCourseStudents internally
  getCourseStudents: async (courseId: string): Promise<Student[]> => {
    return courseService.getCourseStudents(courseId);
  },
};

export default studentService;
