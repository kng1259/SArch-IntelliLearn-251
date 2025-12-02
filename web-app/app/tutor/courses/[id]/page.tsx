'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import TutorHeader from '@/app/components/TutorHeader';
import UpdateCourseModal from '@/app/components/modals/UpdateCourseModal';
import AddMaterialModal from '@/app/components/modals/AddMaterialModal';
import CreateQuizModal from '@/app/components/modals/CreateQuizModal';
import EditQuizModal from '@/app/components/modals/EditQuizModal';
import CreateAssignmentModal from '@/app/components/modals/CreateAssignmentModal';
import CreateExamModal from '@/app/components/modals/CreateExamModal';
import OverviewTab from '@/app/components/course/OverviewTab';
import MaterialsTab from '@/app/components/course/MaterialsTab';
import QuizzesTab from '@/app/components/course/QuizzesTab';
import AssignmentsTab from '@/app/components/course/AssignmentsTab';
import ExamsTab from '@/app/components/course/ExamsTab';
import { useToast } from '@/app/components/Toast';
import assessmentService, { 
  ExamRequest, 
  ExamResponse,
  QuizRequest, 
  QuizResponse,
  QuizUpdateRequest,
  AssignmentRequest,
  AssignmentResponse 
} from '@/lib/services/assessmentService';

type TabType = 'overview' | 'materials' | 'quizzes' | 'assignments' | 'exams';

// UI types that match what the Tab components expect
interface UIQuiz {
  id: string;
  title: string;
  description?: string;
  startAt?: string;
  duration: number;
  level?: string;
  questions: number;
}

interface UIAssignment {
  id: string;
  title: string;
  module: string;
  dueDate: string;
}

interface UIExam {
  id: string;
  title: string;
  date: string;
  duration: number;
  marks: number;
  status: string;
}

export default function CourseManagement({ params }: { params: Promise<{ id: string }> }) {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddMaterialModalOpen, setIsAddMaterialModalOpen] = useState(false);
  const [isAddQuizModalOpen, setIsAddQuizModalOpen] = useState(false);
  const [isEditQuizModalOpen, setIsEditQuizModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<UIQuiz | null>(null);
  const [isAddAssignmentModalOpen, setIsAddAssignmentModalOpen] = useState(false);
  const [isAddExamModalOpen, setIsAddExamModalOpen] = useState(false);
  const [courseInfo, setCourseInfo] = useState({
    title: 'Introduction to Web Development',
    description: 'Learn the fundamentals of HTML, CSS, and JavaScript to build modern websites',
    category: 'Web Development',
  });

  // State for API data
  const [exams, setExams] = useState<UIExam[]>([]);
  const [quizzes, setQuizzes] = useState<UIQuiz[]>([]);
  const [assignments, setAssignments] = useState<UIAssignment[]>([]);
  const [loadingExams, setLoadingExams] = useState(true);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const [loadingAssignments, setLoadingAssignments] = useState(true);

  // Unwrap params
  const { id } = use(params);

  // Fetch functions (reusable for refresh after create)
  const fetchExams = async () => {
    try {
      const data = await assessmentService.getExamsByCourse(id);
      setExams(data.map((exam: ExamResponse): UIExam => ({
        id: exam.id,
        title: exam.name,
        date: exam.startAt ? new Date(exam.startAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD',
        duration: exam.duration || 0,
        marks: 100, // Default value
        status: exam.startAt && new Date(exam.startAt) < new Date() ? 'completed' : 'upcoming',
      })));
    } catch (err) {
      console.error('Failed to fetch exams:', err);
    } finally {
      setLoadingExams(false);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const data = await assessmentService.getQuizzesByCourse(id);
      setQuizzes(data.map((quiz: QuizResponse): UIQuiz => ({
        id: quiz.id,
        title: quiz.name,
        description: quiz.description,
        startAt: quiz.startAt,
        duration: quiz.duration || 0,
        level: quiz.level,
        questions: quiz.questions?.length || 0,
      })));
    } catch (err) {
      console.error('Failed to fetch quizzes:', err);
    } finally {
      setLoadingQuizzes(false);
    }
  };

  const fetchAssignments = async () => {
    try {
      const data = await assessmentService.getAssignmentsByCourse(id);
      setAssignments(data.map((assignment: AssignmentResponse): UIAssignment => ({
        id: assignment.id,
        title: assignment.name,
        module: 'General', // Default value
        dueDate: assignment.endAt ? new Date(assignment.endAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : 'TBD',
      })));
    } catch (err) {
      console.error('Failed to fetch assignments:', err);
    } finally {
      setLoadingAssignments(false);
    }
  };

  // Fetch assessments from API
  useEffect(() => {
    fetchExams();
    fetchQuizzes();
    fetchAssignments();
  }, [id]);

  // Course data (materials and modules still mock, exams/quizzes/assignments from API)
  const courseData = {
    id: id,
    title: courseInfo.title,
    description: courseInfo.description,
    category: courseInfo.category,
    studentsEnrolled: 1234,
    rating: 4.8,
    maxRating: 5.0,
    duration: '8 weeks',
    stats: {
      totalMaterials: 5,
      totalQuizzes: quizzes.length,
      totalAssignments: assignments.length,
    },
    modules: [
      {
        id: '1',
        title: 'HTML Basics',
        materials: 3,
        quizzes: 1,
        assignments: 1,
      },
      {
        id: '2',
        title: 'CSS Styling',
        materials: 2,
        quizzes: 0,
        assignments: 1,
      },
    ],
    materials: [
      {
        id: '1',
        title: 'Introduction to HTML',
        module: 'HTML Basics',
        type: 'video',
      },
      {
        id: '2',
        title: 'HTML Elements',
        module: 'HTML Basics',
        type: 'document',
      },
      {
        id: '3',
        title: 'HTML5 Semantic Tags',
        module: 'HTML Basics',
        type: 'slides',
      },
      {
        id: '4',
        title: 'CSS Basics',
        module: 'CSS Styling',
        type: 'video',
      },
      {
        id: '5',
        title: 'Flexbox Layout',
        module: 'CSS Styling',
        type: 'video',
      },
    ],
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'materials', label: 'Learning Materials' },
    { id: 'quizzes', label: 'Quizzes' },
    { id: 'assignments', label: 'Assignments' },
    { id: 'exams', label: 'Exams' },
  ];

  const handleSaveCourse = (data: { title: string; description: string; category: string }) => {
    setCourseInfo(data);
    // TODO: Call API to update course
    console.log('Saving course:', data);
  };

  const handleAddMaterial = (data: { title: string; type: string; module: string }) => {
    // TODO: Call API to add material
    console.log('Adding material:', data);
  };

  const handleAddQuiz = async (data: { title: string; description: string; startDate: string; timeLimit: number; passingScore: number; level: string }) => {
    try {
      const quizRequest: QuizRequest = {
        name: data.title,
        description: data.description,
        startAt: new Date(data.startDate).toISOString(),
        duration: data.timeLimit,
        courseId: id,
        level: data.level,
        questions: [],
      };
      
      await assessmentService.createQuiz(quizRequest);
      toast.success('Tạo quiz thành công!');
      setIsAddQuizModalOpen(false);
      fetchQuizzes(); // Refresh quizzes list
    } catch (err: any) {
      console.error('Failed to create quiz:', err);
      toast.error(`Lỗi tạo quiz: ${err.message}`);
    }
  };

  const handleEditQuiz = (quiz: UIQuiz) => {
    setSelectedQuiz(quiz);
    setIsEditQuizModalOpen(true);
  };

  const handleUpdateQuiz = async (data: { name: string; description: string; startAt: string; duration: number; level: string }) => {
    if (!selectedQuiz) return;
    
    try {
      const updateRequest: QuizUpdateRequest = {
        name: data.name,
        description: data.description,
        startAt: new Date(data.startAt).toISOString(),
        duration: data.duration,
        level: data.level,
      };
      
      await assessmentService.updateQuiz(selectedQuiz.id, updateRequest);
      toast.success('Cập nhật quiz thành công!');
      setIsEditQuizModalOpen(false);
      setSelectedQuiz(null);
      fetchQuizzes(); // Refresh quizzes list
    } catch (err: any) {
      console.error('Failed to update quiz:', err);
      toast.error(`Lỗi cập nhật quiz: ${err.message}`);
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    try {
      await assessmentService.deleteQuiz(quizId);
      toast.success('Xóa quiz thành công!');
      fetchQuizzes(); // Refresh quizzes list
    } catch (err: any) {
      console.error('Failed to delete quiz:', err);
      toast.error(`Lỗi xóa quiz: ${err.message}`);
    }
  };

  const handleAddAssignment = async (data: { 
    title: string; 
    description: string; 
    startDate: string;
    dueDate: string; 
    maxScore: number;
    instructionFile?: File;
    gradingGuidelinesFile?: File;
  }) => {
    try {
      const assignmentRequest: AssignmentRequest = {
        name: data.title,
        description: data.description,
        startAt: new Date(data.startDate).toISOString(),
        endAt: new Date(data.dueDate).toISOString(),
        courseId: id,
        instruction: data.instructionFile,
        gradingGuidelines: data.gradingGuidelinesFile,
      };
      
      await assessmentService.createAssignment(assignmentRequest);
      toast.success('Tạo assignment thành công!');
      setIsAddAssignmentModalOpen(false);
      fetchAssignments(); // Refresh assignments list
    } catch (err: any) {
      console.error('Failed to create assignment:', err);
      toast.error(`Lỗi tạo assignment: ${err.message}`);
    }
  };

  const handleAddExam = async (data: { title: string; description: string; examDate: string; duration: number; totalMarks: number }) => {
    try {
      const examRequest: ExamRequest = {
        name: data.title,
        description: data.description,
        startAt: new Date(data.examDate).toISOString(),
        duration: data.duration,
        courseId: id,
        questions: [],
      };
      
      await assessmentService.createExam(examRequest);
      toast.success('Tạo exam thành công!');
      setIsAddExamModalOpen(false);
      fetchExams(); // Refresh exams list
    } catch (err: any) {
      console.error('Failed to create exam:', err);
      toast.error(`Lỗi tạo exam: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/tutor/dashboard"
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href={`/tutor/analytics/${id}`}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              View Analytics
            </Link>
            <span className="text-sm text-gray-600 font-medium">Tutor View</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Course Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                {courseData.title}
              </h1>
              <p className="text-gray-600 mb-4">{courseData.description}</p>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span className="text-[#4F46E5]">{courseData.studentsEnrolled.toLocaleString('en-US')} students enrolled</span>
                <span className="text-[#4F46E5]">
                  Rating: {courseData.rating} / {courseData.maxRating}
                </span>
                <span className="text-[#4F46E5]">{courseData.duration}</span>
              </div>
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Course
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && <OverviewTab courseData={courseData} />}
        {activeTab === 'materials' && (
          <MaterialsTab 
            materials={courseData.materials} 
            onAddClick={() => setIsAddMaterialModalOpen(true)}
          />
        )}
        {activeTab === 'quizzes' && (
          <QuizzesTab 
            quizzes={quizzes}
            courseId={id}
            onAddClick={() => setIsAddQuizModalOpen(true)}
            onEditClick={handleEditQuiz}
            onDeleteClick={handleDeleteQuiz}
          />
        )}
        {activeTab === 'assignments' && (
          <AssignmentsTab 
            assignments={assignments}
            onAddClick={() => setIsAddAssignmentModalOpen(true)}
          />
        )}
        {activeTab === 'exams' && (
          <ExamsTab 
            exams={exams}
            onAddClick={() => setIsAddExamModalOpen(true)}
          />
        )}
      </main>

      {/* Update Course Modal */}
      <UpdateCourseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        courseData={{
          title: courseInfo.title,
          description: courseInfo.description,
          category: courseInfo.category,
        }}
        onSave={handleSaveCourse}
      />

      {/* Add Material Modal */}
      <AddMaterialModal
        isOpen={isAddMaterialModalOpen}
        onClose={() => setIsAddMaterialModalOpen(false)}
        modules={courseData.modules}
        onAdd={handleAddMaterial}
      />

      {/* Create Quiz Modal */}
      <CreateQuizModal
        isOpen={isAddQuizModalOpen}
        onClose={() => setIsAddQuizModalOpen(false)}
        onAdd={handleAddQuiz}
      />

      {/* Edit Quiz Modal */}
      <EditQuizModal
        isOpen={isEditQuizModalOpen}
        onClose={() => {
          setIsEditQuizModalOpen(false);
          setSelectedQuiz(null);
        }}
        quiz={selectedQuiz ? {
          id: selectedQuiz.id,
          name: selectedQuiz.title,
          description: selectedQuiz.description || '',
          startAt: selectedQuiz.startAt,
          duration: selectedQuiz.duration,
          level: selectedQuiz.level,
        } : null}
        onSave={handleUpdateQuiz}
      />

      {/* Create Assignment Modal */}
      <CreateAssignmentModal
        isOpen={isAddAssignmentModalOpen}
        onClose={() => setIsAddAssignmentModalOpen(false)}
        onAdd={handleAddAssignment}
      />

      {/* Create Exam Modal */}
      <CreateExamModal
        isOpen={isAddExamModalOpen}
        onClose={() => setIsAddExamModalOpen(false)}
        onAdd={handleAddExam}
      />
    </div>
  );
}
