// Common TypeScript types for the application

// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "instructor" | "student" | "admin";
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

// Course related types (extended)
export interface CourseWithStats {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  instructorName: string;
  startDate: string;
  endDate: string;
  status: "draft" | "published" | "archived";
  enrollmentCount: number;
  averageGrade: number;
  completionRate: number;
  createdAt: string;
  updatedAt: string;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: "info" | "warning" | "success" | "error";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "date"
    | "textarea"
    | "select";
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    message?: string;
  };
}

// File upload types
export interface FileUpload {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  url?: string;
  error?: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export interface Feedback {
  id: string;
  teacherId: string;
  courseId: string;
  createdAt: string;
  content: string;
}

export default {};
