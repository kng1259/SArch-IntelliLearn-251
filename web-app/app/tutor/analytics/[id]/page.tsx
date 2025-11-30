'use client';

import { use, useState } from 'react';
import TutorHeader from '@/app/components/TutorHeader';
import CourseAnalyticsTab from '@/app/components/analytics/CourseAnalyticsTab';
import QuizAnalyticsTab from '@/app/components/analytics/QuizAnalyticsTab';
import ExamAnalyticsTab from '@/app/components/analytics/ExamAnalyticsTab';
import StudentAnalyticsTab from '@/app/components/analytics/StudentAnalyticsTab';

type TabType = 'course' | 'quiz' | 'exam' | 'student';

export default function AnalyticsReports({ params }: { params: Promise<{ id: string }> }) {
  const [activeTab, setActiveTab] = useState<TabType>('course');
  const { id } = use(params);

  // Mock data - replace with API call
  const allCourses = [
    { id: '1', title: 'Introduction to Web Development' },
    { id: '2', title: 'Advanced JavaScript' },
    { id: '3', title: 'React Fundamentals' },
    { id: '4', title: 'Node.js Backend Development' },
  ];

  const currentCourse = allCourses.find((c) => c.id === id) || allCourses[0];

  // Mock data
  const courseData = {
    id: id,
    title: currentCourse.title,
    stats: {
      totalStudents: 1234,
      avgCompletion: 45,
      courseRating: 4.8,
      avgStudyTime: '5.5h',
    },
  };

  const tabs = [
    { id: 'course', label: 'Course Analytics' },
    { id: 'quiz', label: 'Quiz Analytics' },
    { id: 'exam', label: 'Exam Analytics' },
    { id: 'student', label: 'Student Analytics' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <TutorHeader />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Analytics & Reports</h1>
            <p className="text-gray-600">Track course performance and student progress</p>
          </div>
          
          {/* Course Selector Dropdown */}
          <div className="relative">
            <select
              value={id}
              onChange={(e) => {
                window.location.href = `/tutor/analytics/${e.target.value}`;
              }}
              className="appearance-none bg-gray-100 text-gray-900 px-4 py-2 pr-10 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
            >
              {allCourses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Stats Cards - Always visible */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-2">Total Students</p>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-semibold text-[#4F46E5]">{courseData.stats.totalStudents.toLocaleString()}</p>
              <div className="flex items-center text-green-600 text-sm mb-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 011 1v4a1 1 0 11-2 0V9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4A1 1 0 0112 7z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-2">Avg Completion</p>
            <p className="text-3xl font-semibold text-[#4F46E5]">{courseData.stats.avgCompletion}%</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-2">Course Rating</p>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-semibold text-[#4F46E5]">{courseData.stats.courseRating}</p>
              <span className="text-yellow-500 text-xl mb-1">★</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-2">Avg Study Time</p>
            <div className="flex items-end gap-1">
              <p className="text-3xl font-semibold text-[#4F46E5]">{courseData.stats.avgStudyTime}</p>
              <svg className="w-5 h-5 text-[#4F46E5] mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
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
        {activeTab === 'course' && <CourseAnalyticsTab stats={courseData.stats} />}
        {activeTab === 'quiz' && <QuizAnalyticsTab />}
        {activeTab === 'exam' && <ExamAnalyticsTab />}
        {activeTab === 'student' && <StudentAnalyticsTab />}
      </main>
    </div>
  );
}
