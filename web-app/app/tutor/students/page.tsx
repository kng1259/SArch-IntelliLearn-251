'use client';

import { useState } from 'react';
import TutorHeader from '@/app/components/TutorHeader';
import ProvideFeedbackModal from '@/app/components/modals/ProvideFeedbackModal';

interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  course: string;
  enrollmentDate: string;
  progress: number;
  avgGrade: number;
  lastActive: string;
}

export default function StudentManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const handleProvideFeedback = (student: Student) => {
    setSelectedStudent(student);
    setFeedbackModalOpen(true);
  };

  const students: Student[] = [
    {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      avatar: 'AJ',
      course: 'Introduction to Web Development',
      enrollmentDate: '9/1/2025',
      progress: 65,
      avgGrade: 88,
      lastActive: '11/5/2025',
    },
    {
      id: '2',
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      avatar: 'ED',
      course: 'Introduction to Web Development',
      enrollmentDate: '9/1/2025',
      progress: 72,
      avgGrade: 92,
      lastActive: '11/4/2025',
    },
    {
      id: '3',
      name: 'Marcus Williams',
      email: 'marcus.w@example.com',
      avatar: 'MW',
      course: 'Introduction to Web Development',
      enrollmentDate: '9/15/2025',
      progress: 58,
      avgGrade: 75,
      lastActive: '11/3/2025',
    },
    {
      id: '4',
      name: 'Sophie Chen',
      email: 'sophie.chen@example.com',
      avatar: 'SC',
      course: 'Introduction to Web Development',
      enrollmentDate: '9/1/2025',
      progress: 85,
      avgGrade: 95,
      lastActive: '11/5/2025',
    },
  ];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (grade >= 75) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-orange-600 bg-orange-50 border-orange-200';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TutorHeader />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Student Management</h1>
          <p className="text-gray-600">View and manage students across all your courses</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-2">Total Students</p>
            <p className="text-3xl font-semibold text-indigo-600">4</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-2">Active Courses</p>
            <p className="text-3xl font-semibold text-indigo-600">2</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-2">Avg Completion</p>
            <p className="text-3xl font-semibold text-indigo-600">70%</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-2">Avg Grade</p>
            <p className="text-3xl font-semibold text-indigo-600">88%</p>
          </div>
        </div>

        {/* Student Roster */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Student Roster</h2>
                <p className="text-sm text-gray-600">Manage and track student progress</p>
              </div>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Student</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Course</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Enrollment Date</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Progress</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Avg Grade</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Last Active</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600">
                          {student.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-blue-600">{student.course}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{student.enrollmentDate}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                          <div
                            className="bg-black h-2 rounded-full"
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{student.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded text-xs font-medium border ${getGradeColor(student.avgGrade)}`}>
                        {student.avgGrade}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{student.lastActive}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View Analytics">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleProvideFeedback(student)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                          title="Provide Feedback"
                        >
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Email">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Feedback Modal */}
      {selectedStudent && (
        <ProvideFeedbackModal
          isOpen={feedbackModalOpen}
          onClose={() => setFeedbackModalOpen(false)}
          student={selectedStudent}
        />
      )}
    </div>
  );
}
