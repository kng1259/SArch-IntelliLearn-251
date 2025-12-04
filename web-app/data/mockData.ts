import {
  Course,
  LearningMaterial,
  Quiz,
  Assignment,
  Exam,
  StudentProgress,
  TutorFeedback,
} from "../types";

export const mockMaterials: LearningMaterial[] = [
  {
    id: "1",
    courseId: "1",
    title: "Introduction to React Components",
    type: "video",
    url: "#",
    duration: "15 min",
    uploadDate: "2024-01-15",
  },
  {
    id: "2",
    courseId: "1",
    title: "React Hooks Deep Dive",
    type: "video",
    url: "#",
    duration: "25 min",
    uploadDate: "2024-01-20",
  },
  {
    id: "3",
    courseId: "1",
    title: "Course Syllabus",
    type: "document",
    url: "#",
    uploadDate: "2024-01-10",
  },
  {
    id: "4",
    courseId: "1",
    title: "State Management Slides",
    type: "slides",
    url: "#",
    uploadDate: "2024-01-25",
  },
];

export const mockQuizzes: Quiz[] = [
  {
    id: "1",
    courseId: "1",
    title: "React Basics Quiz",
    description: "Test your understanding of React fundamentals",
    duration: 30,
    passingScore: 70,
    attempts: 2,
    dueDate: "2024-12-20",
    questions: [
      {
        id: "1",
        question: "What is JSX?",
        options: [
          "A JavaScript framework",
          "A syntax extension for JavaScript",
          "A CSS preprocessor",
          "A database query language",
        ],
        correctAnswer: 1,
      },
      {
        id: "2",
        question: "Which hook is used for side effects?",
        options: ["useState", "useEffect", "useContext", "useReducer"],
        correctAnswer: 1,
      },
    ],
  },
];

export const mockAssignments: Assignment[] = [
  {
    id: "1",
    courseId: "1",
    title: "Build a Todo App",
    description: "Create a functional todo application using React hooks",
    dueDate: "2024-12-15",
    totalPoints: 100,
    submittedDate: "2024-12-14",
    grade: 85,
    feedback: "Good work! Consider adding error handling for edge cases.",
    status: "graded",
  },
  {
    id: "2",
    courseId: "1",
    title: "Component Composition Exercise",
    description: "Build a complex UI using component composition patterns",
    dueDate: "2024-12-25",
    totalPoints: 100,
    status: "pending",
  },
  {
    id: "3",
    courseId: "2",
    title: "TypeScript Generics Implementation",
    description:
      "Implement a type-safe data structure using TypeScript generics",
    dueDate: "2024-12-18",
    totalPoints: 100,
    submittedDate: "2024-12-17",
    status: "submitted",
  },
];

export const mockExams: Exam[] = [
  {
    id: "1",
    courseId: "1",
    title: "React Final Exam",
    description: "Comprehensive exam covering all React concepts",
    date: "2024-12-30",
    duration: 120,
    totalPoints: 200,
    grade: 175,
  },
  {
    id: "2",
    courseId: "2",
    title: "TypeScript Midterm",
    description: "Midterm examination on TypeScript fundamentals",
    date: "2024-12-20",
    duration: 90,
    totalPoints: 150,
  },
];

export const mockCourses: Course[] = [
  {
    id: "1",
    title: "Introduction to React",
    description:
      "Learn the fundamentals of React including components, hooks, and state management.",
    tutorId: "2",
    tutorName: "Dr. Sarah Williams",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    category: "Web Development",
    level: "Beginner",
    enrolledStudents: 245,
    duration: "8 weeks",
    rating: 4.8,
    isEnrolled: true,
    progress: 65,
    modules: [
      {
        id: "m1",
        title: "Getting Started with React",
        materials: mockMaterials,
        quizzes: mockQuizzes,
        assignments: mockAssignments,
        exams: mockExams,
      },
      {
        id: "m2",
        title: "React Components and Props",
        materials: [],
        quizzes: [],
        assignments: [],
        exams: [],
      },
      {
        id: "m3",
        title: "State and Lifecycle",
        materials: [],
        quizzes: [],
        assignments: [],
        exams: [],
      },
    ],
  },
  {
    id: "2",
    title: "Advanced TypeScript",
    description:
      "Master TypeScript with advanced types, generics, and design patterns.",
    tutorId: "2",
    tutorName: "Dr. Sarah Williams",
    thumbnail:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800",
    category: "Programming",
    level: "Advanced",
    enrolledStudents: 189,
    duration: "10 weeks",
    rating: 4.9,
    isEnrolled: true,
    progress: 30,
  },
  {
    id: "3",
    title: "UI/UX Design Principles",
    description:
      "Learn the fundamentals of user interface and user experience design.",
    tutorId: "3",
    tutorName: "Emily Chen",
    thumbnail:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
    category: "Design",
    level: "Beginner",
    enrolledStudents: 312,
    duration: "6 weeks",
    rating: 4.7,
    isEnrolled: false,
  },
  {
    id: "4",
    title: "Data Structures & Algorithms",
    description:
      "Comprehensive course on data structures and algorithmic problem solving.",
    tutorId: "4",
    tutorName: "Prof. Michael Lee",
    thumbnail:
      "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=800",
    category: "Computer Science",
    level: "Intermediate",
    enrolledStudents: 421,
    duration: "12 weeks",
    rating: 4.9,
    isEnrolled: false,
  },
];

export const mockFeedbacks: TutorFeedback[] = [
  {
    id: "1",
    courseId: "1",
    studentId: "101",
    generalFeedbacks: [
      {
        id: "f1",
        message: "Great course! The modules were well-structured.",
        date: "2024-02-10",
        title: "Course Structure",
      },
      {
        id: "f2",
        message: "The assignments helped solidify my understanding.",
        date: "2024-02-15",
        title: "Assignments",
      },
    ],
    quizFeedbacks: [
      {
        id: "qf1",
        quiz_titile: "React Basics Quiz",
        title: "Quiz 1 Feedback",
        description: "React Basics Quiz",
        message: "Good attempt! Review the JSX section for better clarity.",
      },
    ],
    assignmentFeedbacks: [
      {
        id: "af1",
        assignment_title: "Assignment 1",
        title: "Assignment 1 Feedback",
        description: "Build a Todo App",
        message:
          "Well done! Consider optimizing the state management for scalability.",
      },
    ],
  },
];

export const mockProgress: StudentProgress[] = [
  {
    courseId: "1",
    completedMaterials: ["1", "2"],
    completedQuizzes: ["1"],
    completedAssignments: ["1"],
    overallProgress: 65,
  },
  {
    courseId: "2",
    completedMaterials: ["5"],
    completedQuizzes: [],
    completedAssignments: [],
    overallProgress: 30,
  },
];
