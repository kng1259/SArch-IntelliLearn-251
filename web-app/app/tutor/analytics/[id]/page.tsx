'use client';

import { use, useState, useEffect } from 'react';
import TutorHeader from '@/app/components/TutorHeader';
import CourseAnalyticsTab from '@/app/components/analytics/CourseAnalyticsTab';
import QuizAnalyticsTab from '@/app/components/analytics/QuizAnalyticsTab';
import ExamAnalyticsTab from '@/app/components/analytics/ExamAnalyticsTab';
import StudentAnalyticsTab from '@/app/components/analytics/StudentAnalyticsTab';
import analyticsService, { ReportResponse } from '@/lib/services/analyticsService';
import courseService, { Course } from '@/lib/services/courseService';

type TabType = 'course' | 'quiz' | 'exam' | 'student';

export default function AnalyticsReports({ params }: { params: Promise<{ id: string }> }) {
  const [activeTab, setActiveTab] = useState<TabType>('course');
  const { id } = use(params);
  
  // State for API data
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch course analysis report
        const reportData = await analyticsService.getCourseAnalysisReport(id);
        setReport(reportData);
        
        // Fetch courses for dropdown
        const tutorId = localStorage.getItem('tutorId');
        if (tutorId) {
          const coursesData = await courseService.getCoursesByTutor(tutorId);
          setCourses(coursesData);
        }
      } catch (err: any) {
        console.error('Failed to fetch analytics:', err);
        setError(err.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  // Calculate stats from report data
  const courseStats = report?.courseAnalysis ? {
    totalStudents: report.courseAnalysis.totalStudents || 0,
    avgCompletion: report.courseAnalysis.avgCompletionPercentage || 0,
    courseRating: 4.8, // Not available in API yet
    avgStudyTime: report.studyTimeAnalysis?.totalStudyTimeMinutes 
      ? `${(report.studyTimeAnalysis.totalStudyTimeMinutes / 60).toFixed(1)}h` 
      : '0h',
  } : {
    totalStudents: 0,
    avgCompletion: 0,
    courseRating: 0,
    avgStudyTime: '0h',
  };

  const currentCourse = courses.find((c) => c.id === id);

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
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
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

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F46E5] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">Error: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Stats Cards - Always visible */}
            <div className="grid grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <p className="text-sm text-gray-600 mb-2">Total Students</p>
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-semibold text-[#4F46E5]">{courseStats.totalStudents.toLocaleString()}</p>
                  <div className="flex items-center text-green-600 text-sm mb-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 011 1v4a1 1 0 11-2 0V9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4A1 1 0 0112 7z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <p className="text-sm text-gray-600 mb-2">Avg Completion</p>
                <p className="text-3xl font-semibold text-[#4F46E5]">{courseStats.avgCompletion}%</p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <p className="text-sm text-gray-600 mb-2">Course Rating</p>
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-semibold text-[#4F46E5]">{courseStats.courseRating}</p>
                  <span className="text-yellow-500 text-xl mb-1">★</span>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <p className="text-sm text-gray-600 mb-2">Avg Study Time</p>
                <div className="flex items-end gap-1">
                  <p className="text-3xl font-semibold text-[#4F46E5]">{courseStats.avgStudyTime}</p>
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
            {activeTab === 'course' && (
              <CourseAnalyticsTab 
                stats={courseStats}
                enrollmentStats={report?.courseAnalysis?.monthlyStudentEnrollmentStats}
                completionData={report?.courseAnalysis?.courseCompletionResponse}
              />
            )}
            {activeTab === 'quiz' && (
              <QuizAnalyticsTab quizAnalysis={report?.quizAnalysis} />
            )}
            {activeTab === 'exam' && (
              <ExamAnalyticsTab examAnalysis={report?.examAnalysis} />
            )}
            {activeTab === 'student' && (
              <StudentAnalyticsTab 
                studyTimeAnalysis={report?.studyTimeAnalysis}
                assignmentAnalysis={report?.assignmentAnalysis}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
