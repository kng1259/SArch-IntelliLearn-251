'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import TutorHeader from '@/app/components/TutorHeader';
import UpdateCourseModal from '@/app/components/modals/UpdateCourseModal';
import AddMaterialModal from '@/app/components/modals/AddMaterialModal';
import CreateQuizModal from '@/app/components/modals/CreateQuizModal';
import CreateAssignmentModal from '@/app/components/modals/CreateAssignmentModal';
import CreateExamModal from '@/app/components/modals/CreateExamModal';
import OverviewTab from '@/app/components/course/OverviewTab';
import MaterialsTab from '@/app/components/course/MaterialsTab';
import QuizzesTab from '@/app/components/course/QuizzesTab';
import AssignmentsTab from '@/app/components/course/AssignmentsTab';
import ExamsTab from '@/app/components/course/ExamsTab';

type TabType = 'overview' | 'materials' | 'quizzes' | 'assignments' | 'exams';

export default function CourseManagement({ params }: { params: Promise<{ id: string }> }) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddMaterialModalOpen, setIsAddMaterialModalOpen] = useState(false);
  const [isAddQuizModalOpen, setIsAddQuizModalOpen] = useState(false);
  const [isAddAssignmentModalOpen, setIsAddAssignmentModalOpen] = useState(false);
  const [isAddExamModalOpen, setIsAddExamModalOpen] = useState(false);
  const [courseInfo, setCourseInfo] = useState({
    title: 'Introduction to Web Development',
    description: 'Learn the fundamentals of HTML, CSS, and JavaScript to build modern websites',
    category: 'Web Development',
  });

  // Mock data - replace with API call based on params.id
  const { id } = use(params);
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
      totalQuizzes: 1,
      totalAssignments: 2,
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
    quizzes: [
      {
        id: '1',
        title: 'HTML Fundamentals Quiz',
        module: 'HTML Basics',
        questions: 2,
        duration: 15,
      },
    ],
    assignments: [
      {
        id: '1',
        title: 'Build a Personal Portfolio Page',
        module: 'HTML Basics',
        dueDate: '11/15/2025',
      },
      {
        id: '2',
        title: 'Style Your Portfolio',
        module: 'CSS Styling',
        dueDate: '11/20/2025',
      },
    ],
    exams: [
      {
        id: '1',
        title: 'Web Development Midterm',
        date: 'Nov 18, 2025',
        duration: 90,
        marks: 100,
        status: 'completed',
      },
      {
        id: '2',
        title: 'JavaScript Final Exam',
        date: 'Dec 15, 2025',
        duration: 120,
        marks: 150,
        status: 'upcoming',
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

  const handleAddQuiz = (data: { title: string; description: string; timeLimit: number; passingScore: number }) => {
    // TODO: Call API to add quiz
    console.log('Adding quiz:', data);
  };

  const handleAddAssignment = (data: { title: string; description: string; dueDate: string; maxScore: number }) => {
    // TODO: Call API to add assignment
    console.log('Adding assignment:', data);
  };

  const handleAddExam = (data: { title: string; description: string; examDate: string; duration: number; totalMarks: number }) => {
    // TODO: Call API to add exam
    console.log('Adding exam:', data);
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
            quizzes={courseData.quizzes}
            onAddClick={() => setIsAddQuizModalOpen(true)}
          />
        )}
        {activeTab === 'assignments' && (
          <AssignmentsTab 
            assignments={courseData.assignments}
            onAddClick={() => setIsAddAssignmentModalOpen(true)}
          />
        )}
        {activeTab === 'exams' && (
          <ExamsTab 
            exams={courseData.exams}
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
