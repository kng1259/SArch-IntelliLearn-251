'use client';

import { useState, useEffect } from 'react';
import { useApi } from '@/lib/hooks/useApi';
import courseService, { Course, CourseRequest } from '@/lib/services/courseService';
import Header from '@/app/components/Header';
import DashboardCard from '@/app/components/DashboardCard';
import CourseCard from '@/app/components/CourseCard';
import PendingActionCard from '@/app/components/PendingActionCard';
import CreateCourseModal from '@/app/components/modals/CreateCourseModal';

export default function TutorDashboard() {
  const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false);
  const { data: courses, loading, error, execute } = useApi<Course[]>();
  
  // Get tutor ID from localStorage or auth context
  // For now, using a placeholder - replace with actual auth
  const [tutorId, setTutorId] = useState<string>('');
  const tutorName = "Dr. Sarah Mitchell";
  
  // Fetch courses on component mount
  useEffect(() => {
    const storedTutorId = localStorage.getItem('tutorId');
    if (storedTutorId) {
      setTutorId(storedTutorId);
      execute(() => courseService.getCoursesByTutor(storedTutorId));
    }
  }, []);
  
  // Calculate dashboard stats from actual data
  const dashboardStats = {
    activeCourses: courses?.length || 0,
    totalStudents: 0, // TODO: Sum students from all courses
    pendingGrading: 0, // TODO: Get from grading service when implemented
  };

  // Transform API courses to CourseCard format
  const courseCards = courses?.map(course => ({
    id: course.id,
    title: course.name,
    description: course.description,
    image: '/placeholder-course-1.jpg', // TODO: Add image support to backend
    students: 0, // TODO: Get from course students endpoint
    rating: 0, // TODO: Add rating support
  })) || [];

  const pendingActions = [
    // TODO: Get from grading service when implemented
    // Create mock data for now
    { id: '1', studentName: 'John Doe', action: 'Submit Assignment 1 for Math 101', submittedDate: '2024-08-10' },
    { id: '2', studentName: 'Jane Smith', action: 'Submit Quiz 2 for Physics 201', submittedDate: '2024-08-11' },
    { id: '3', studentName: 'Alice Johnson', action: 'Submit Project Proposal for CS 301', submittedDate: '2024-08-12' },
    
  ];

  // Handle create course
  const handleCreateCourse = async (data: { title: string; description: string; category: string; startDate: string; endDate: string }) => {
    try {
      const courseRequest: CourseRequest = {
        name: data.title,
        description: data.description,
        startAt: new Date(data.startDate).toISOString(),
        endAt: new Date(data.endDate).toISOString(),
      };
      
      const newCourse = await courseService.createCourse(courseRequest);
      console.log('Course created:', newCourse);
      
      // Refresh courses list
      if (tutorId) {
        execute(() => courseService.getCoursesByTutor(tutorId));
      }
      
      setIsCreateCourseModalOpen(false);
      alert(`Khóa học "${newCourse.name}" đã được tạo thành công!`);
    } catch (err: any) {
      console.error('Failed to create course:', err);
      alert(`Lỗi tạo khóa học: ${err.message}`);
    }
  };

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
          
          {loading && (
            <div className="text-center py-8 text-gray-600">
              Loading courses...
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-700">Error loading courses: {error}</p>
              <p className="text-sm text-red-600 mt-1">Please make sure you have a valid tutor ID set.</p>
            </div>
          )}
          
          {!loading && !error && courseCards.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
              <p className="text-gray-600 mb-4">Create your first course to get started</p>
              <button 
                onClick={() => setIsCreateCourseModalOpen(true)}
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Course
              </button>
            </div>
          )}
          
          {!loading && !error && courseCards.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courseCards.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          )}
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
        onSave={handleCreateCourse}
      />
      
      {/* Tutor ID Helper (Remove this in production) */}
      {!tutorId && (
        <div className="fixed bottom-4 right-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 max-w-sm shadow-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">⚠️ No Tutor ID Set</h4>
          <p className="text-sm text-yellow-700 mb-3">
            Enter your tutor ID to load courses:
          </p>
          <input
            type="text"
            placeholder="Enter Tutor ID (UUID)"
            className="w-full px-3 py-2 border rounded mb-2 text-sm"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const input = e.currentTarget.value;
                if (input) {
                  localStorage.setItem('tutorId', input);
                  setTutorId(input);
                  execute(() => courseService.getCoursesByTutor(input));
                }
              }
            }}
          />
          <p className="text-xs text-yellow-600">Press Enter to save</p>
        </div>
      )}
    </div>
  );
}
