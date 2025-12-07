// Assessment Service - API calls for exam, quiz, assignment management (Teaching Service)

import { api } from "../api";
import studentApi from "../studentApi";
import { StudentTest } from "./courseService";

// ============ Common Types ============
export interface Option {
  order: number;
  value: string;
  correct: boolean;
}

export interface Question {
  id?: string;
  content: string;
  options: Option[];
}

export interface AssignmentSubmit {
  fileName: string;
  content: string;
  assignmentId: string;
}

export interface questionAnswer {
  questionId: string;
  choices: {
    order: number;
    optionOrder: number;
  }[];
}

export interface testSubmit {
  attemptId: string;
  answers: questionAnswer[];
}

export interface testAttemptResponse {
  success: boolean;
  message: string;
}

// ============ Exam Types ============
export interface ExamRequest {
  name: string;
  description: string;
  startAt?: string; // ISO datetime
  endAt?: string; // ISO datetime
  duration?: number; // minutes
  courseId: string;
  questions?: Question[];
}

export interface ExamResponse {
  id: string;
  name: string;
  description: string;
  startAt?: string;
  endAt?: string;
  createdAt?: string;
  duration?: number;
  questions?: Question[];
}

export interface ExamUpdateRequest {
  name?: string;
  description?: string;
  startAt?: string;
  endAt?: string;
  duration?: number;
}

// ============ Quiz Types ============
export interface QuizRequest {
  name: string;
  description: string;
  startAt?: string;
  endAt?: string;
  duration?: number;
  courseId: string;
  level?: string; // e.g., 'EASY', 'MEDIUM', 'HARD'
  questions?: Question[];
}

export interface QuizResponse {
  id: string;
  name: string;
  description: string;
  startAt?: string;
  endAt?: string;
  createdAt?: string;
  duration?: number;
  level?: string;
  questions?: Question[];
}

export interface QuizUpdateRequest {
  name?: string;
  description?: string;
  startAt?: string;
  endAt?: string;
  duration?: number;
  level?: string;
}

export interface QuestionUpdateRequest {
  id?: string; // UUID - if provided, updates existing question; if not, creates new
  content: string;
  options: Option[];
}

export interface QuizUpdateWithQuestionsRequest {
  name?: string;
  description?: string;
  startAt?: string;
  endAt?: string;
  duration?: number;
  level?: string;
  questions?: QuestionUpdateRequest[];
}

// ============ Assignment Types ============
export interface AssignmentRequest {
  name: string;
  description: string;
  startAt?: string;
  endAt?: string;
  courseId: string;
  instruction?: File;
  gradingGuidelines?: File;
}

export interface AssignmentResponse {
  id: string;
  name: string;
  description: string;
  startAt?: string;
  endAt?: string;
  createdAt?: string;
  instruction?: string; // URL to file
  gradingGuidelines?: string; // URL to file
}

// ============ Grading Types ============
export interface GradingRequest {
  score: number; // 0-100
  feedback: string;
  fileName?: string;
}

const assessmentService = {
  // ============ Exam APIs ============

  // Create new exam
  // POST /exam
  createExam: async (examData: ExamRequest): Promise<void> => {
    await api.post<void>("/exam", examData);
  },

  // Get exam by ID
  // GET /exam/{examId}
  getExam: async (examId: string): Promise<ExamResponse> => {
    return api.get<ExamResponse>(`/exam/${examId}`);
  },

  // Update exam
  // PUT /exam/{examId}
  updateExam: async (
    examId: string,
    examData: ExamUpdateRequest
  ): Promise<void> => {
    await api.put<void>(`/exam/${examId}`, examData);
  },

  // Delete exam
  // DELETE /exam/{examId}
  deleteExam: async (examId: string): Promise<void> => {
    await api.delete<void>(`/exam/${examId}`);
  },

  // Get exams by course ID
  // GET /exam/course/{courseId}
  getExamsByCourse: async (courseId: string): Promise<ExamResponse[]> => {
    return api.get<ExamResponse[]>(`/exam/course/${courseId}`);
  },

  // ============ Quiz APIs ============

  // Create new quiz
  // POST /quiz
  createQuiz: async (quizData: QuizRequest): Promise<void> => {
    await api.post<void>("/quiz", quizData);
  },

  // Get quiz by ID
  // GET /quiz/{quizId}
  getQuiz: async (quizId: string): Promise<QuizResponse> => {
    return api.get<QuizResponse>(`/quiz/${quizId}`);
  },

  // Update quiz
  // PUT /quiz/{quizId}
  updateQuiz: async (
    quizId: string,
    quizData: QuizUpdateRequest
  ): Promise<void> => {
    await api.put<void>(`/quiz/${quizId}`, quizData);
  },

  // Update quiz with questions
  // PUT /quiz/{quizId}
  updateQuizWithQuestions: async (
    quizId: string,
    quizData: QuizUpdateWithQuestionsRequest
  ): Promise<void> => {
    await api.put<void>(`/quiz/${quizId}`, quizData);
  },

  // Delete quiz
  // DELETE /quiz/{quizId}
  deleteQuiz: async (quizId: string): Promise<void> => {
    await api.delete<void>(`/quiz/${quizId}`);
  },

  // Get quizzes by course ID
  // GET /quiz/course/{courseId}
  getQuizzesByCourse: async (courseId: string): Promise<QuizResponse[]> => {
    return api.get<QuizResponse[]>(`/quiz/course/${courseId}`);
  },

  // ============ Assignment APIs ============

  // Create new assignment (multipart/form-data)
  // POST /assignment
  createAssignment: async (
    assignmentData: AssignmentRequest
  ): Promise<void> => {
    const formData = new FormData();
    formData.append("name", assignmentData.name);
    formData.append("description", assignmentData.description);
    formData.append("courseId", assignmentData.courseId);

    if (assignmentData.startAt) {
      formData.append("startAt", assignmentData.startAt);
    }
    if (assignmentData.endAt) {
      formData.append("endAt", assignmentData.endAt);
    }
    if (assignmentData.instruction) {
      formData.append("instruction", assignmentData.instruction);
    }
    if (assignmentData.gradingGuidelines) {
      formData.append("gradingGuidelines", assignmentData.gradingGuidelines);
    }

    await api.postFormData<void>("/assignment", formData);
  },

  // Get assignment by ID
  // GET /assignment/{assignmentId}
  getAssignment: async (assignmentId: string): Promise<AssignmentResponse> => {
    return api.get<AssignmentResponse>(`/assignment/${assignmentId}`);
  },

  // Update assignment (multipart/form-data)
  // PUT /assignment/{assignmentId}
  updateAssignment: async (
    assignmentId: string,
    assignmentData: Partial<AssignmentRequest>
  ): Promise<void> => {
    const formData = new FormData();

    if (assignmentData.name) formData.append("name", assignmentData.name);
    if (assignmentData.description)
      formData.append("description", assignmentData.description);
    if (assignmentData.courseId)
      formData.append("courseId", assignmentData.courseId);
    if (assignmentData.startAt)
      formData.append("startAt", assignmentData.startAt);
    if (assignmentData.endAt) formData.append("endAt", assignmentData.endAt);
    if (assignmentData.instruction)
      formData.append("instruction", assignmentData.instruction);
    if (assignmentData.gradingGuidelines)
      formData.append("gradingGuidelines", assignmentData.gradingGuidelines);

    await api.putFormData<void>(`/assignment/${assignmentId}`, formData);
  },

  // Delete assignment
  // DELETE /assignment/{assignmentId}
  deleteAssignment: async (assignmentId: string): Promise<void> => {
    await api.delete<void>(`/assignment/${assignmentId}`);
  },

  // Get assignments by course ID
  // GET /assignment/course/{courseId}
  getAssignmentsByCourse: async (
    courseId: string
  ): Promise<AssignmentResponse[]> => {
    return api.get<AssignmentResponse[]>(`/assignment/course/${courseId}`);
  },

  // ============ Grading APIs ============
  
  // Grade assignment submission
  // PATCH /submission/{assignmentId}/{studentId}
  gradeSubmission: async (
    assignmentId: string,
    studentId: string,
    gradingData: GradingRequest
  ): Promise<void> => {
    await api.patch<void>(`/submission/${assignmentId}/${studentId}`, gradingData);
  },

  attempQuiz: async (quizId: string): Promise<StudentTest> => {
    const response = await studentApi.get<StudentTest>(
      `/learning/assessment/quizzes/${quizId}`
    );
    return response;
  },

  attempExam: async (ExamId: string): Promise<StudentTest> => {
    const response = await studentApi.get<StudentTest>(
      `/learning/assessment/exams/${ExamId}`
    );
    return response;
  },

  submitTestAttempt: async (
    testSubmit: testSubmit
  ): Promise<testAttemptResponse> => {
    const response = await studentApi.post<testAttemptResponse>(
      `/learning/assessment/tests/attempts`,
      { ...testSubmit }
    );

    return response;
  },

  submitAssignment: async (assignmentSubmit: AssignmentSubmit ): Promise<any> => {
    const response = await studentApi.post<any>(
      `/learning/assessment/assignments/${assignmentSubmit.assignmentId}/submission`,
      { ...assignmentSubmit }
    );
    return response;
  },
};

export default assessmentService;
