'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function StudentAnalyticsTab() {
  // Student Engagement Data - Dual Y-axis
  const engagementData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Active Students',
        data: [1100, 1050, 1080, 1150],
        borderColor: '#818CF8',
        backgroundColor: 'transparent',
        tension: 0.4,
        yAxisID: 'y',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Avg Time (hours)',
        data: [4.8, 5.2, 5.0, 5.8],
        borderColor: '#10B981',
        backgroundColor: 'transparent',
        tension: 0.4,
        yAxisID: 'y1',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const engagementOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          color: '#374151',
        },
      },
      tooltip: {
        backgroundColor: '#1F2937',
        padding: 12,
        titleColor: '#F9FAFB',
        bodyColor: '#F9FAFB',
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        min: 0,
        max: 1400,
        ticks: {
          stepSize: 350,
          color: '#6B7280',
        },
        grid: {
          color: '#F3F4F6',
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        min: 0,
        max: 8,
        ticks: {
          stepSize: 2,
          color: '#6B7280',
        },
        grid: {
          drawOnChartArea: false,
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

  // Top Performers Data
  const topPerformers = [
    { name: 'Sophie Chen', grade: '95%', color: 'bg-green-500' },
    { name: 'Emily Davis', grade: '92%', color: 'bg-green-500' },
    { name: 'Alex Johnson', grade: '88%', color: 'bg-green-500' },
  ];

  // At-Risk Students Data
  const atRiskStudents = [
    { name: 'Marcus Williams', grade: '58%', color: 'bg-red-100 text-red-700' },
    { name: 'John Doe', grade: '62%', color: 'bg-red-100 text-red-700' },
    { name: 'Jane Smith', grade: '65%', color: 'bg-red-100 text-red-700' },
  ];

  // Most Active Students Data
  const mostActiveStudents = [
    { name: 'Sophie Chen', hours: '8.5h/week', color: 'bg-blue-100 text-blue-700' },
    { name: 'Emily Davis', hours: '7.2h/week', color: 'bg-blue-100 text-blue-700' },
    { name: 'Alex Johnson', hours: '6.8h/week', color: 'bg-blue-100 text-blue-700' },
  ];

  return (
    <div className="space-y-6">
      {/* Student Engagement Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Student Engagement</h3>
          <p className="text-sm text-gray-600">Active students and study time per week</p>
        </div>
        <div style={{ height: '350px' }}>
          <Line data={engagementData} options={engagementOptions} />
        </div>
      </div>

      {/* Student Lists */}
      <div className="grid grid-cols-3 gap-6">
        {/* Top Performers */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-gray-900">Top Performers</h3>
            <p className="text-sm text-gray-600">Students with highest grades</p>
          </div>
          <div className="space-y-4">
            {topPerformers.map((student, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-900">{student.name}</span>
                <span className={`px-3 py-1 ${student.color} text-white text-sm font-medium rounded`}>
                  {student.grade}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* At-Risk Students */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-gray-900">At-Risk Students</h3>
            <p className="text-sm text-gray-600">Students needing attention</p>
          </div>
          <div className="space-y-4">
            {atRiskStudents.map((student, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-900">{student.name}</span>
                <span className={`px-3 py-1 ${student.color} text-sm font-medium rounded`}>
                  {student.grade}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Most Active */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-gray-900">Most Active</h3>
            <p className="text-sm text-gray-600">Most engaged students</p>
          </div>
          <div className="space-y-4">
            {mostActiveStudents.map((student, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-900">{student.name}</span>
                <span className={`px-3 py-1 ${student.color} text-sm font-medium rounded`}>
                  {student.hours}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
