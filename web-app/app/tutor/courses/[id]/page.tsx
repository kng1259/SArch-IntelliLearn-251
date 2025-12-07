'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import TutorHeader from '@/app/components/TutorHeader';
import UpdateCourseModal from '@/app/components/modals/UpdateCourseModal';
import AddMaterialModal from '@/app/components/modals/AddMaterialModal';
import CreateQuizModal from '@/app/components/modals/CreateQuizModal';
import EditQuizModal from '@/app/components/modals/EditQuizModal';
import CreateAssignmentModal from '@/app/components/modals/CreateAssignmentModal';
import EditAssignmentModal from '@/app/components/modals/EditAssignmentModal';
import CreateExamModal from '@/app/components/modals/CreateExamModal';
import EditExamModal from '@/app/components/modals/EditExamModal';
import EditMaterialModal from '@/app/components/modals/EditMaterialModal';
import CreateModuleModal from '@/app/components/modals/CreateModuleModal';
import EditModuleModal from '@/app/components/modals/EditModuleModal';
import OverviewTab from '@/app/components/course/OverviewTab';
import MaterialsTab from '@/app/components/course/MaterialsTab';
import QuizzesTab from '@/app/components/course/QuizzesTab';
import AssignmentsTab from '@/app/components/course/AssignmentsTab';
import ExamsTab from '@/app/components/course/ExamsTab';
import { useToast } from '@/app/components/Toast';
import courseService, { CourseRequest, LearningMaterial, ModuleResponse } from '@/lib/services/courseService';
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

interface UIMaterial {
  id: string;
  title: string;
  module: string;
  type: string;
  url?: string;
}

interface UIModule {
  id: string;
  name: string;
  description?: string;
  order: number;
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
  const [isEditAssignmentModalOpen, setIsEditAssignmentModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<UIAssignment | null>(null);
  const [isAddExamModalOpen, setIsAddExamModalOpen] = useState(false);
  const [isEditExamModalOpen, setIsEditExamModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<UIExam | null>(null);
  const [isEditMaterialModalOpen, setIsEditMaterialModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<UIMaterial | null>(null);
  const [isAddModuleModalOpen, setIsAddModuleModalOpen] = useState(false);
  const [isEditModuleModalOpen, setIsEditModuleModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<UIModule | null>(null);
  const [courseInfo, setCourseInfo] = useState({
    title: 'Introduction to Web Development',
    description: 'Learn the fundamentals of HTML, CSS, and JavaScript to build modern websites',
    category: 'Web Development',
  });

  // State for API data
  const [exams, setExams] = useState<UIExam[]>([]);
  const [quizzes, setQuizzes] = useState<UIQuiz[]>([]);
  const [assignments, setAssignments] = useState<UIAssignment[]>([]);
  const [materials, setMaterials] = useState<UIMaterial[]>([]);
  const [modules, setModules] = useState<UIModule[]>([]);
  const [students, setStudents] = useState<{ id: string; fullName: string }[]>([]);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [loadingExams, setLoadingExams] = useState(true);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [loadingMaterials, setLoadingMaterials] = useState(true);

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

  const fetchCourseInfo = async () => {
    try {
      const data = await courseService.getCourseById(id);
      setCourseInfo({
        title: data.name,
        description: data.description,
        category: 'General', // Backend doesn't have category field
      });
    } catch (err) {
      console.error('Failed to fetch course info:', err);
    } finally {
      setLoadingCourse(false);
    }
  };

  const fetchMaterials = async () => {
    try {
      const data = await courseService.getMaterialsByCourse(id);
      setMaterials(data.map((material: LearningMaterial): UIMaterial => ({
        id: material.id || '',
        title: material.name,
        module: 'General',
        type: 'document', // Default type
        url: material.content,
      })));
    } catch (err) {
      console.error('Failed to fetch materials:', err);
    } finally {
      setLoadingMaterials(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const data = await courseService.getCourseStudents(id);
      setStudents(data);
    } catch (err) {
      console.error('Failed to fetch students:', err);
    }
  };

  const fetchModules = async () => {
    try {
      const data = await courseService.getModulesByCourse(id);
      setModules(data.map((module: ModuleResponse): UIModule => ({
        id: module.id,
        name: module.name,
        description: module.description,
        order: module.order,
      })));
    } catch (err) {
      console.error('Failed to fetch modules:', err);
    }
  };

  // Fetch all data from API
  useEffect(() => {
    fetchCourseInfo();
    fetchExams();
    fetchQuizzes();
    fetchAssignments();
    fetchMaterials();
    fetchStudents();
    fetchModules();
  }, [id]);

  // Course data from API
  const courseData = {
    id: id,
    title: courseInfo.title,
    description: courseInfo.description,
    category: courseInfo.category,
    studentsEnrolled: students.length,
    rating: 4.8,
    maxRating: 5.0,
    duration: '8 weeks',
    stats: {
      totalMaterials: materials.length,
      totalQuizzes: quizzes.length,
      totalAssignments: assignments.length,
    },
    modules: modules,
    materials: materials,
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'materials', label: 'Learning Materials' },
    { id: 'quizzes', label: 'Quizzes' },
    { id: 'assignments', label: 'Assignments' },
    { id: 'exams', label: 'Exams' },
  ];

  const handleSaveCourse = async (data: { title: string; description: string; category: string }) => {
    try {
      const courseRequest: CourseRequest = {
        name: data.title,
        description: data.description,
        startAt: new Date().toISOString(),
        endAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
      };
      
      await courseService.updateCourse(id, courseRequest);
      setCourseInfo(data);
      toast.success('Cập nhật khóa học thành công!');
    } catch (err: any) {
      console.error('Failed to update course:', err);
      toast.error(`Lỗi cập nhật khóa học: ${err.message}`);
    }
  };

  const handleAddMaterial = async (data: { title: string; type: string; moduleId: string; file: File | null }) => {
    try {
      await courseService.createLearningMaterial({
        name: data.title,
        content: data.file,
        courseId: id,
      });
      
      toast.success('Thêm tài liệu thành công!');
      setIsAddMaterialModalOpen(false);
      fetchMaterials(); // Refresh materials list
    } catch (err: any) {
      console.error('Failed to add material:', err);
      toast.error(`Lỗi thêm tài liệu: ${err.message}`);
    }
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

  // ============ Exam Edit/Delete Handlers ============
  const handleEditExam = (exam: UIExam) => {
    setSelectedExam(exam);
    setIsEditExamModalOpen(true);
  };

  const handleUpdateExam = async (data: { name: string; description: string; startAt: string; duration: number }) => {
    if (!selectedExam) return;
    
    try {
      await assessmentService.updateExam(selectedExam.id, {
        name: data.name,
        description: data.description,
        startAt: new Date(data.startAt).toISOString(),
        duration: data.duration,
      });
      toast.success('Cập nhật exam thành công!');
      setIsEditExamModalOpen(false);
      setSelectedExam(null);
      fetchExams();
    } catch (err: any) {
      console.error('Failed to update exam:', err);
      toast.error(`Lỗi cập nhật exam: ${err.message}`);
    }
  };

  const handleDeleteExam = async (examId: string) => {
    try {
      await assessmentService.deleteExam(examId);
      toast.success('Xóa exam thành công!');
      fetchExams();
    } catch (err: any) {
      console.error('Failed to delete exam:', err);
      toast.error(`Lỗi xóa exam: ${err.message}`);
    }
  };

  // ============ Assignment Edit/Delete Handlers ============
  const handleEditAssignment = (assignment: UIAssignment) => {
    setSelectedAssignment(assignment);
    setIsEditAssignmentModalOpen(true);
  };

  const handleUpdateAssignment = async (data: { name: string; description: string; startAt: string; endAt: string }) => {
    if (!selectedAssignment) return;
    
    try {
      await assessmentService.updateAssignment(selectedAssignment.id, {
        name: data.name,
        description: data.description,
        startAt: new Date(data.startAt).toISOString(),
        endAt: new Date(data.endAt).toISOString(),
        courseId: id,
      });
      toast.success('Cập nhật assignment thành công!');
      setIsEditAssignmentModalOpen(false);
      setSelectedAssignment(null);
      fetchAssignments();
    } catch (err: any) {
      console.error('Failed to update assignment:', err);
      toast.error(`Lỗi cập nhật assignment: ${err.message}`);
    }
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    try {
      await assessmentService.deleteAssignment(assignmentId);
      toast.success('Xóa assignment thành công!');
      fetchAssignments();
    } catch (err: any) {
      console.error('Failed to delete assignment:', err);
      toast.error(`Lỗi xóa assignment: ${err.message}`);
    }
  };

  // ============ Material Edit/Delete Handlers ============
  const handleEditMaterial = (material: UIMaterial) => {
    setSelectedMaterial(material);
    setIsEditMaterialModalOpen(true);
  };

  const handleUpdateMaterial = async (data: { name: string; content: string; file?: File | null }) => {
    if (!selectedMaterial) return;
    
    try {
      // Note: Backend may need an update endpoint for learning materials
      // For now, we'll delete and recreate
      await courseService.deleteLearningMaterial(selectedMaterial.id);
      await courseService.createLearningMaterial({
        name: data.name,
        content: data.file || null,
        courseId: id,
      });
      toast.success('Cập nhật tài liệu thành công!');
      setIsEditMaterialModalOpen(false);
      setSelectedMaterial(null);
      fetchMaterials();
    } catch (err: any) {
      console.error('Failed to update material:', err);
      toast.error(`Lỗi cập nhật tài liệu: ${err.message}`);
    }
  };

  const handleDeleteMaterial = async (materialId: string) => {
    try {
      await courseService.deleteLearningMaterial(materialId);
      toast.success('Xóa tài liệu thành công!');
      fetchMaterials();
    } catch (err: any) {
      console.error('Failed to delete material:', err);
      toast.error(`Lỗi xóa tài liệu: ${err.message}`);
    }
  };

  // Module handlers
  const handleAddModule = async (data: { name: string; description: string }) => {
    try {
      await courseService.createModule({
        name: data.name,
        description: data.description,
        order: modules.length + 1,
        courseId: id,
      });
      toast.success('Thêm module thành công!');
      setIsAddModuleModalOpen(false);
      fetchModules();
    } catch (err: any) {
      console.error('Failed to add module:', err);
      toast.error(`Lỗi thêm module: ${err.message}`);
    }
  };

  const handleEditModule = (module: UIModule) => {
    setSelectedModule(module);
    setIsEditModuleModalOpen(true);
  };

  const handleUpdateModule = async (data: { name: string; description: string }) => {
    if (!selectedModule) return;
    
    try {
      await courseService.updateModule(selectedModule.id, {
        name: data.name,
        description: data.description,
        order: selectedModule.order,
        courseId: id,
      });
      toast.success('Cập nhật module thành công!');
      setIsEditModuleModalOpen(false);
      setSelectedModule(null);
      fetchModules();
    } catch (err: any) {
      console.error('Failed to update module:', err);
      toast.error(`Lỗi cập nhật module: ${err.message}`);
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    try {
      await courseService.deleteModule(moduleId);
      toast.success('Xóa module thành công!');
      fetchModules();
    } catch (err: any) {
      console.error('Failed to delete module:', err);
      toast.error(`Lỗi xóa module: ${err.message}`);
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
        {activeTab === 'overview' && (
          <OverviewTab 
            courseData={courseData} 
            onAddModuleClick={() => setIsAddModuleModalOpen(true)}
            onEditModuleClick={handleEditModule}
            onDeleteModuleClick={handleDeleteModule}
          />
        )}
        {activeTab === 'materials' && (
          <MaterialsTab 
            materials={courseData.materials} 
            onAddClick={() => setIsAddMaterialModalOpen(true)}
            onEditClick={handleEditMaterial}
            onDeleteClick={handleDeleteMaterial}
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
            onEditClick={handleEditAssignment}
            onDeleteClick={handleDeleteAssignment}
          />
        )}
        {activeTab === 'exams' && (
          <ExamsTab 
            exams={exams}
            onAddClick={() => setIsAddExamModalOpen(true)}
            onEditClick={handleEditExam}
            onDeleteClick={handleDeleteExam}
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
        modules={modules.map(m => ({ id: m.id, title: m.name }))}
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

      {/* Edit Exam Modal */}
      <EditExamModal
        isOpen={isEditExamModalOpen}
        onClose={() => {
          setIsEditExamModalOpen(false);
          setSelectedExam(null);
        }}
        exam={selectedExam ? {
          id: selectedExam.id,
          name: selectedExam.title,
          description: '',
          startAt: selectedExam.date,
          duration: selectedExam.duration,
        } : null}
        onSave={handleUpdateExam}
      />

      {/* Edit Assignment Modal */}
      <EditAssignmentModal
        isOpen={isEditAssignmentModalOpen}
        onClose={() => {
          setIsEditAssignmentModalOpen(false);
          setSelectedAssignment(null);
        }}
        assignment={selectedAssignment ? {
          id: selectedAssignment.id,
          name: selectedAssignment.title,
          description: '',
          startAt: '',
          endAt: selectedAssignment.dueDate,
        } : null}
        onSave={handleUpdateAssignment}
      />

      {/* Edit Material Modal */}
      <EditMaterialModal
        isOpen={isEditMaterialModalOpen}
        onClose={() => {
          setIsEditMaterialModalOpen(false);
          setSelectedMaterial(null);
        }}
        material={selectedMaterial ? {
          id: selectedMaterial.id,
          name: selectedMaterial.title,
          content: selectedMaterial.url || '',
        } : null}
        onSave={handleUpdateMaterial}
      />

      {/* Create Module Modal */}
      <CreateModuleModal
        isOpen={isAddModuleModalOpen}
        onClose={() => setIsAddModuleModalOpen(false)}
        onAdd={handleAddModule}
      />

      {/* Edit Module Modal */}
      <EditModuleModal
        isOpen={isEditModuleModalOpen}
        onClose={() => {
          setIsEditModuleModalOpen(false);
          setSelectedModule(null);
        }}
        module={selectedModule}
        onSave={handleUpdateModule}
      />
    </div>
  );
}
