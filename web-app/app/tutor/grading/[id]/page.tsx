'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TutorHeader from '@/app/components/TutorHeader';
import { useToast } from '@/app/components/Toast';

export default function AssignmentGrading() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'pending' | 'graded'>('pending');
  const [selectedStudent, setSelectedStudent] = useState<string | null>('1');
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');

  // Mock data - replace with actual data from API
  const assignmentInfo = {
    title: 'Build a Personal Portfolio Page',
    submittedOn: '11/15/2025',
    maxScore: 100,
  };

  const pendingSubmissions = [
    {
      id: '1',
      studentName: 'Marcus Williams',
      submittedDate: '11/15/2025',
      status: 'Pending',
    },
  ];

  const gradedSubmissions = [
    {
      id: '2',
      studentName: 'Sophie Chen',
      submittedDate: '11/10/2025',
      grade: 95,
      status: 'Graded',
    },
    {
      id: '3',
      studentName: 'Emily Davis',
      submittedDate: '11/12/2025',
      grade: 88,
      status: 'Graded',
    },
  ];

  const currentSubmission = {
    studentName: 'Marcus Williams',
    fileName: 'portfolio.html',
    description: 'This is a mock submission. In a real application, you would see the actual student work here, either as embedded content or downloadable files.',
    details: "Student's portfolio includes: Professional header, About section, Skills showcase, Project gallery, and Contact form. Clean HTML structure with semantic tags.",
  };

  const toast = useToast();

  const handleSubmitGrade = () => {
    console.log('Submitting grade:', { grade, feedback });
    // Handle grade submission
    toast.success('Grade submitted successfully!');
    setGrade('');
    setFeedback('');
  };

  const totalSubmissions = pendingSubmissions.length + gradedSubmissions.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <TutorHeader />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Assignment Grading
          </h1>
          <p className="text-gray-600">Review and grade student submissions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Pending</p>
            <p className="text-3xl font-semibold text-blue-600">{pendingSubmissions.length}</p>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Graded</p>
            <p className="text-3xl font-semibold text-green-600">{gradedSubmissions.length}</p>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Total Submissions</p>
            <p className="text-3xl font-semibold text-gray-900">{totalSubmissions}</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Submissions List */}
          <div className="col-span-3 bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Submissions</h3>
            
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-4">
              <button
                onClick={() => setActiveTab('pending')}
                className={`flex-1 pb-3 text-sm font-medium transition-colors ${
                  activeTab === 'pending'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Pending ({pendingSubmissions.length})
              </button>
              <button
                onClick={() => setActiveTab('graded')}
                className={`flex-1 pb-3 text-sm font-medium transition-colors ${
                  activeTab === 'graded'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Graded ({gradedSubmissions.length})
              </button>
            </div>

            {/* Submissions List */}
            <div className="space-y-2">
              {activeTab === 'pending' ? (
                pendingSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    onClick={() => setSelectedStudent(submission.id)}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedStudent === submission.id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <p className="font-medium text-gray-900 text-sm mb-1">
                      {submission.studentName}
                    </p>
                    <p className="text-xs text-gray-600">
                      Submitted: {submission.submittedDate}
                    </p>
                    <span className="inline-block mt-2 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                      {submission.status}
                    </span>
                  </div>
                ))
              ) : (
                gradedSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    onClick={() => setSelectedStudent(submission.id)}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedStudent === submission.id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <p className="font-medium text-gray-900 text-sm mb-1">
                      {submission.studentName}
                    </p>
                    <p className="text-xs text-gray-600 mb-2">
                      Submitted: {submission.submittedDate}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                        {submission.status}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {submission.grade}%
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Content - Grade Submission */}
          <div className="col-span-9 space-y-6">
            {/* Student Submission Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Grade Submission</h3>
                  <p className="text-sm text-gray-600">Student: {currentSubmission.studentName}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Assignment</p>
                    <p className="text-base font-medium text-gray-900">{assignmentInfo.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Submitted On</p>
                    <p className="text-base font-medium text-gray-900">{assignmentInfo.submittedOn}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Max Score</p>
                    <p className="text-base font-medium text-gray-900">{assignmentInfo.maxScore}</p>
                  </div>
                </div>
              </div>

              {/* Student Submission Preview */}
              <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="font-medium text-gray-900">{currentSubmission.fileName}</span>
                  </div>
                  <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-4">{currentSubmission.description}</p>
                <div className="bg-white border border-gray-200 rounded p-4">
                  <p className="text-sm text-gray-700 italic">{currentSubmission.details}</p>
                </div>
              </div>

              {/* Grading Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Grade (out of {assignmentInfo.maxScore})
                  </label>
                  <input
                    type="number"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="Enter grade"
                    min="0"
                    max={assignmentInfo.maxScore}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Feedback to Student
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide constructive feedback..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <button
                  onClick={handleSubmitGrade}
                  className="w-full bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Submit Grade
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
