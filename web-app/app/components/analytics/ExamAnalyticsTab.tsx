'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { ExamAnalysisResponse } from '@/lib/services/analyticsService';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ExamAnalyticsTabProps {
  examAnalysis?: ExamAnalysisResponse[];
}

export default function ExamAnalyticsTab({ examAnalysis }: ExamAnalyticsTabProps) {
  // Transform API data or use mock
  const exams = examAnalysis?.map(exam => ({
    id: exam.id,
    name: exam.name,
    totalStudents: exam.totalStudents || 0,
    avgScore: exam.avgScore || 0,
    passRate: exam.passRate || 0,
    status: (exam.totalStudents || 0) > 0 ? 'Completed' : 'Upcoming',
  })) || [
    { id: '1', name: 'Midterm', totalStudents: 115, avgScore: 84, passRate: 92, status: 'Completed' },
    { id: '2', name: 'Final', totalStudents: 0, avgScore: 0, passRate: 0, status: 'Upcoming' },
  ];

  // Assignment Performance Data (for backward compatibility - will use exam data)
  const assignmentData = {
    labels: exams.filter(e => e.status === 'Completed').map(e => e.name),
    datasets: [
      {
        label: 'Average Score (%)',
        data: exams.filter(e => e.status === 'Completed').map(e => e.avgScore),
        backgroundColor: '#818CF8',
        borderRadius: 8,
        barThickness: 60,
      },
    ],
  };

  const assignmentOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1F2937',
        padding: 12,
        titleColor: '#F9FAFB',
        bodyColor: '#F9FAFB',
        callbacks: {
          label: function(context: any) {
            return `Average Grade: ${context.parsed.y}%`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: '#F3F4F6',
        },
        ticks: {
          color: '#6B7280',
          callback: function(value: any) {
            return value + '%';
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Exam Results Overview */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Exam Results Overview</h3>
        <p className="text-sm text-gray-600 mb-4">Performance across all exams</p>
        
        {exams.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500">No exam data available yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {exams.map((exam) => (
              <div key={exam.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-900 mb-4">{exam.name}</h4>
                    <div className="grid grid-cols-3 gap-8">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Students</p>
                        <p className={`text-2xl font-semibold ${exam.status === 'Completed' ? 'text-gray-900' : 'text-gray-400'}`}>
                          {exam.status === 'Completed' ? exam.totalStudents : '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Average Score</p>
                        <p className={`text-2xl font-semibold ${exam.status === 'Completed' ? 'text-gray-900' : 'text-gray-400'}`}>
                          {exam.status === 'Completed' ? `${exam.avgScore}%` : '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Pass Rate</p>
                        <p className={`text-2xl font-semibold ${exam.status === 'Completed' ? 'text-gray-900' : 'text-gray-400'}`}>
                          {exam.status === 'Completed' ? `${exam.passRate}%` : '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-sm font-medium rounded ${
                    exam.status === 'Completed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {exam.status}
                  </span>
                </div>
                {exam.status === 'Upcoming' && (
                  <p className="text-sm text-gray-600 mt-4">No data available yet</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Exam Performance Chart */}
      {exams.filter(e => e.status === 'Completed').length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Exam Performance</h3>
            <p className="text-sm text-gray-600">Average scores across completed exams</p>
          </div>
          <div style={{ height: '320px' }}>
            <Bar data={assignmentData} options={assignmentOptions} />
          </div>
        </div>
      )}
    </div>
  );
}
