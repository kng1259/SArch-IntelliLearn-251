export type UserRole = "student" | "tutor";

export interface LocalUserInfo {
  id: string;
  name: string;
  email: string;
  role: "student" | "tutor";
}

export interface Course {
  id: string;
  title: string;
  description: string;
  tutorId: string;
  tutorName: string;
  thumbnail: string;
  category: string;
  level: string;
  enrolledStudents: number;
  duration: string;
  progress?: number;
  isEnrolled?: boolean;
  rating?: number;
  modules?: CourseModule[];
}

export interface TutorFeedback {
  id: string;
  courseId: string;
  studentId: string;
  generalFeedbacks: GeneralFeedback[];
  quizFeedbacks?: QuizzFeedback[];
  assignmentFeedbacks?: AssignmentFeedback[];
}

export interface GeneralFeedback {
  id: string;
  title?: string;
  description?: string;
  message: string;
  date?: string;
}

export interface QuizzFeedback extends GeneralFeedback {
  quiz_titile?: string;
}

export interface AssignmentFeedback extends GeneralFeedback {
  assignment_title?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  materials: LearningMaterial[];
  quizzes: Quiz[];
  assignments: Assignment[];
  exams: Exam[];
}

export interface LearningMaterial {
  id: string;
  courseId: string;
  title: string;
  type: "video" | "document" | "slides" | "link";
  url: string;
  duration?: string;
  uploadDate: string;
  completed?: boolean;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  duration: number;
  passingScore: number;
  attempts?: number;
  dueDate?: string;
  feedback?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  totalPoints: number;
  submittedDate?: string;
  grade?: number;
  feedback?: string;
  status?: "pending" | "submitted" | "graded";
}

export interface Exam {
  id: string;
  courseId: string;
  title: string;
  description: string;
  date: string;
  duration: number;
  totalPoints: number;
  grade?: number;
}

export interface StudentProgress {
  courseId: string;
  completedMaterials: string[];
  completedQuizzes: string[];
  completedAssignments: string[];
  overallProgress: number;
}

export interface Analytics {
  totalStudents: number;
  averageScore: number;
  completionRate: number;
  engagementRate: number;
}
