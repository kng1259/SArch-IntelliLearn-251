'use client';

import { useState } from 'react';
import Header from '@/app/components/Header';
import DashboardCard from '@/app/components/DashboardCard';
import CourseCard from '@/app/components/CourseCard';
import PendingActionCard from '@/app/components/PendingActionCard';
import CreateCourseModal from '@/app/components/modals/CreateCourseModal';

export default function TutorDashboard() {
  const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false);
  
  // Mock data - replace with actual data from API
  const tutorName = "Dr. Sarah Mitchell";
  
  const dashboardStats = {
    activeCourses: 2,
    totalStudents: 1801,
    pendingGrading: 1,
  };

  const courses = [
    {
      id: '1',
      title: 'Introduction to Web Development',
      description: 'Learn the fundamentals of HTML, CSS, and JavaScript to build modern websites',
      image: '/placeholder-course-1.jpg',
      students: 1234,
      rating: 4.8,
    },
    {
      id: '2',
      title: 'Advanced React Patterns',
      description: 'Deep dive into advanced React concepts and design patterns',
      image: '/placeholder-course-2.jpg',
      students: 567,
      rating: 4.7,
    },
  ];

  const pendingActions = [
    {
      id: '1',
      studentName: 'Marcus Williams',
      action: 'Assignment Submission',
      submittedDate: '11/15/2025',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              Welcome, {tutorName}
            </h1>
            <p className="text-gray-600">Manage your courses and students</p>
          </div>
          <button 
            onClick={() => setIsCreateCourseModalOpen(true)}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Course
          </button>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="Active Courses"
            value={dashboardStats.activeCourses}
            color="blue"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
          />
          
          <DashboardCard
            title="Total Students"
            value={dashboardStats.totalStudents.toLocaleString('en-US')}
            color="green"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          />
          
          <DashboardCard
            title="Pending Grading"
            value={dashboardStats.pendingGrading}
            color="orange"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
          
          <DashboardCard
            title="Course Analytics"
            value="View Reports"
            color="purple"
            link="/tutor/analytics"
            linkText="View Reports"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          />
        </div>

        {/* My Courses Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">My Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        </div>

        {/* Pending Actions Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Pending Actions
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Items that need your attention
          </p>
          
          <div className="space-y-2">
            {pendingActions.map((action) => (
              <PendingActionCard
                key={action.id}
                id={action.id}
                studentName={action.studentName}
                action={action.action}
                submittedDate={action.submittedDate}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Create Course Modal */}
      <CreateCourseModal
        isOpen={isCreateCourseModalOpen}
        onClose={() => setIsCreateCourseModalOpen(false)}
        onSave={(data) => {
          console.log('Creating course:', data);
          // TODO: Call API to create course
        }}
      />
    </div>
  );
}
