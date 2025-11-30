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

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ExamAnalyticsTab() {
  // Assignment Performance Data
  const assignmentData = {
    labels: ['Portfolio Page', 'CSS Styling', 'JavaScript Game'],
    datasets: [
      {
        label: 'Average Grade (%)',
        data: [85, 82, 75],
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

  // Assignment submissions data
  const assignments = [
    {
      name: 'Portfolio Page',
      submitted: 120,
      pending: 0,
      avgGrade: '85%',
    },
    {
      name: 'CSS Styling',
      submitted: 98,
      pending: 12,
      avgGrade: '82%',
    },
    {
      name: 'JavaScript Game',
      submitted: 76,
      pending: 14,
      avgGrade: '75%',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Exam Results Overview */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Exam Results Overview</h3>
        <p className="text-sm text-gray-600 mb-4">Performance across all exams</p>
        
        <div className="space-y-4">
          {/* Midterm */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-base font-semibold text-gray-900 mb-4">Midterm</h4>
                <div className="grid grid-cols-3 gap-8">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Students</p>
                    <p className="text-2xl font-semibold text-gray-900">115</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Average Score</p>
                    <p className="text-2xl font-semibold text-gray-900">84%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pass Rate</p>
                    <p className="text-2xl font-semibold text-gray-900">92%</p>
                  </div>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded">
                Completed
              </span>
            </div>
          </div>

          {/* Final */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-base font-semibold text-gray-900 mb-4">Final</h4>
                <div className="grid grid-cols-3 gap-8">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Students</p>
                    <p className="text-2xl font-semibold text-gray-400">-</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Average Score</p>
                    <p className="text-2xl font-semibold text-gray-400">-</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pass Rate</p>
                    <p className="text-2xl font-semibold text-gray-400">-</p>
                  </div>
                </div>
              </div>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded">
                Upcoming
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-4">No data available yet</p>
          </div>
        </div>
      </div>

      {/* Assignment Performance & Submissions */}
      <div className="grid grid-cols-2 gap-6">
        {/* Assignment Performance Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Assignment Performance</h3>
            <p className="text-sm text-gray-600">Average grades across assignments</p>
          </div>
          <div style={{ height: '320px' }}>
            <Bar data={assignmentData} options={assignmentOptions} />
          </div>
        </div>

        {/* Assignment Submissions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Assignment Submissions</h3>
            <p className="text-sm text-gray-600">Submission and grading status</p>
          </div>
          <div className="space-y-6 mt-6">
            {assignments.map((assignment, index) => (
              <div key={index} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">{assignment.name}</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Submitted</p>
                    <p className="text-base font-semibold text-gray-900">{assignment.submitted}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Pending</p>
                    <p className={`text-base font-semibold ${assignment.pending > 0 ? 'text-blue-600' : 'text-gray-900'}`}>
                      {assignment.pending}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Avg Grade</p>
                    <p className="text-base font-semibold text-green-600">{assignment.avgGrade}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
