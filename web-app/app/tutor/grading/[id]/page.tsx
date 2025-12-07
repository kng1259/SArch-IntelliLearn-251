'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TutorHeader from '@/app/components/TutorHeader';
import { useToast } from '@/app/components/Toast';
import assessmentService, { AssignmentResponse, GradingRequest } from '@/lib/services/assessmentService';
import gradingService, { Submission as ApiSubmission } from '@/lib/services/gradingService';

interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  submittedDate: string;
  fileName?: string;
  content?: string;
  grade?: number;
  feedback?: string;
  status: 'Pending' | 'Graded';
}

export default function AssignmentGrading() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const assignmentId = params.id as string;
  
  const [activeTab, setActiveTab] = useState<'pending' | 'graded'>('pending');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Assignment info state
  const [assignmentInfo, setAssignmentInfo] = useState({
    title: '',
    description: '',
    maxScore: 100,
    startAt: '',
    endAt: '',
  });

  // Submissions state - fetched from API
  const [pendingSubmissions, setPendingSubmissions] = useState<Submission[]>([]);
  const [gradedSubmissions, setGradedSubmissions] = useState<Submission[]>([]);

  // Helper function to format date
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  // Fetch assignment details and submissions
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch assignment info
        const assignmentData = await assessmentService.getAssignment(assignmentId);
        setAssignmentInfo({
          title: assignmentData.name,
          description: assignmentData.description,
          maxScore: 100,
          startAt: assignmentData.startAt || '',
          endAt: assignmentData.endAt || '',
        });
        
        // Fetch submissions for this assignment
        const submissionsData = await gradingService.getSubmissionsByAssignment(assignmentId);
        
        // Map API response to component format and separate pending/graded
        const pending: Submission[] = [];
        const graded: Submission[] = [];
        
        submissionsData.forEach((s: ApiSubmission) => {
          const submission: Submission = {
            id: `${s.studentId}-${s.fileName}`,
            studentId: s.studentId,
            studentName: s.studentName,
            submittedDate: formatDate(s.submittedAt),
            fileName: s.fileName,
            content: s.content,
            grade: s.score,
            feedback: s.feedback || undefined,
            status: s.graded ? 'Graded' : 'Pending',
          };
          
          if (s.graded) {
            graded.push(submission);
          } else {
            pending.push(submission);
          }
        });
        
        setPendingSubmissions(pending);
        setGradedSubmissions(graded);
        
        // Select first pending submission by default
        if (pending.length > 0) {
          setSelectedSubmission(pending[0]);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
        toast.error('Không thể tải thông tin assignment');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assignmentId]);

  const handleSubmitGrade = async () => {
    if (!selectedSubmission) {
      toast.warning('Vui lòng chọn bài nộp để chấm điểm');
      return;
    }
    
    if (!grade) {
      toast.warning('Vui lòng nhập điểm');
      return;
    }
    
    if (!feedback.trim()) {
      toast.warning('Vui lòng nhập feedback');
      return;
    }

    const gradeNum = parseFloat(grade);
    if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 100) {
      toast.warning('Điểm phải từ 0 đến 100');
      return;
    }

    setSubmitting(true);
    try {
      const gradingData: GradingRequest = {
        score: gradeNum,
        feedback: feedback,
        fileName: selectedSubmission.fileName,
      };
      
      await assessmentService.gradeSubmission(
        assignmentId,
        selectedSubmission.studentId,
        gradingData
      );
      
      // Move submission from pending to graded
      const gradedSubmission: Submission = {
        ...selectedSubmission,
        grade: gradeNum,
        feedback: feedback,
        status: 'Graded',
      };
      
      setPendingSubmissions(prev => prev.filter(s => s.id !== selectedSubmission.id));
      setGradedSubmissions(prev => [...prev, gradedSubmission]);
      
      toast.success('Chấm điểm thành công!');
      setGrade('');
      setFeedback('');
      setSelectedSubmission(null);
      
      // Select next pending submission if available
      const remainingPending = pendingSubmissions.filter(s => s.id !== selectedSubmission.id);
      if (remainingPending.length > 0) {
        setSelectedSubmission(remainingPending[0]);
      }
    } catch (err: any) {
      console.error('Failed to submit grade:', err);
      toast.error(`Lỗi chấm điểm: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
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
                pendingSubmissions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">Không có bài nộp chờ chấm điểm</p>
                  </div>
                ) : (
                pendingSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    onClick={() => setSelectedSubmission(submission)}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedSubmission?.id === submission.id
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
                )
              ) : (
                gradedSubmissions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">Chưa có bài nộp nào được chấm điểm</p>
                  </div>
                ) : (
                gradedSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    onClick={() => setSelectedSubmission(submission)}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedSubmission?.id === submission.id
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
                )
              )}
            </div>
          </div>

          {/* Right Content - Grade Submission */}
          <div className="col-span-9 space-y-6">
            {loading ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <p className="text-gray-600">Đang tải...</p>
              </div>
            ) : !selectedSubmission ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-600">Chọn một bài nộp để chấm điểm</p>
              </div>
            ) : (
            /* Student Submission Card */
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Grade Submission</h3>
                  <p className="text-sm text-gray-600">Student: {selectedSubmission.studentName}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Assignment</p>
                    <p className="text-base font-medium text-gray-900">{assignmentInfo.title || 'Loading...'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Submitted On</p>
                    <p className="text-base font-medium text-gray-900">{selectedSubmission.submittedDate}</p>
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
                    <span className="font-medium text-gray-900">{selectedSubmission.fileName || 'No file'}</span>
                  </div>
                  {selectedSubmission.fileName && (
                  <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </button>
                  )}
                </div>
                <div className="bg-white border border-gray-200 rounded p-4">
                  <p className="text-sm text-gray-700">{selectedSubmission.content || 'Không có nội dung preview'}</p>
                </div>
              </div>

              {/* Grading Form - Only show for pending submissions */}
              {selectedSubmission.status === 'Pending' ? (
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
                  disabled={submitting}
                  className="w-full bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Submit Grade
                    </>
                  )}
                </button>
              </div>
              ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">Đã chấm điểm</h4>
                <p className="text-sm text-green-700">Điểm: {selectedSubmission.grade}/100</p>
                <p className="text-sm text-green-700 mt-1">Feedback: {selectedSubmission.feedback}</p>
              </div>
              )}
            </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
