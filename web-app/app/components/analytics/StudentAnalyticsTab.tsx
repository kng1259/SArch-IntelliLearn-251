'use client';

import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { 
  StudyTimeAnalysisResponse, 
  AssignmentAnalysisResponse 
} from '@/lib/services/analyticsService';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface StudentAnalyticsTabProps {
  studyTimeAnalysis?: StudyTimeAnalysisResponse;
  assignmentAnalysis?: AssignmentAnalysisResponse[];
}

export default function StudentAnalyticsTab({ studyTimeAnalysis, assignmentAnalysis }: StudentAnalyticsTabProps) {
  // Weekly study time data from API
  const weeklyLabels = studyTimeAnalysis?.weeklyStats?.map(w => w.week) || ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const weeklyMinutes = studyTimeAnalysis?.weeklyStats?.map(w => w.totalMinutes || 0) || [288, 312, 300, 348];
  const weeklyHours = weeklyMinutes.map(m => (m / 60).toFixed(1));
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

  // Most Active Students from API - top 5 most studied
  const mostActiveStudents = studyTimeAnalysis?.top5MostStudied?.map(student => ({
    name: student.studentName,
    hours: `${(student.totalMinutes / 60).toFixed(1)}h`,
    color: 'bg-blue-100 text-blue-700'
  })) || [];

  // Least Active Students from API - top 5 least studied (at-risk)
  const leastActiveStudents = studyTimeAnalysis?.top5LeastStudied?.map(student => ({
    name: student.studentName,
    hours: `${(student.totalMinutes / 60).toFixed(1)}h`,
    color: 'bg-red-100 text-red-700'
  })) || [];

  // Calculate assignment scores from assignmentAnalysis for top performers
  const topPerformers = assignmentAnalysis?.slice(0, 3).map(assignment => ({
    name: assignment.name,
    grade: `${assignment.avgScore.toFixed(0)}%`,
    color: 'bg-green-500'
  })) || [];

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
        {/* Top Performers - Best assignment scores */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-gray-900">Top Assignments</h3>
            <p className="text-sm text-gray-600">Assignments with highest avg scores</p>
          </div>
          <div className="space-y-4">
            {topPerformers.length > 0 ? topPerformers.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-900 truncate flex-1 mr-2">{item.name}</span>
                <span className={`px-3 py-1 ${item.color} text-white text-sm font-medium rounded`}>
                  {item.grade}
                </span>
              </div>
            )) : (
              <p className="text-sm text-gray-500 text-center py-4">No data available</p>
            )}
          </div>
        </div>

        {/* Least Active Students */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-gray-900">Least Active Students</h3>
            <p className="text-sm text-gray-600">Students with low study time</p>
          </div>
          <div className="space-y-4">
            {leastActiveStudents.length > 0 ? leastActiveStudents.map((student, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-900 truncate flex-1 mr-2">{student.name}</span>
                <span className={`px-3 py-1 ${student.color} text-sm font-medium rounded`}>
                  {student.hours}
                </span>
              </div>
            )) : (
              <p className="text-sm text-gray-500 text-center py-4">No data available</p>
            )}
          </div>
        </div>

        {/* Most Active */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-gray-900">Most Active</h3>
            <p className="text-sm text-gray-600">Most engaged students</p>
          </div>
          <div className="space-y-4">
            {mostActiveStudents.length > 0 ? mostActiveStudents.map((student, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-900 truncate flex-1 mr-2">{student.name}</span>
                <span className={`px-3 py-1 ${student.color} text-sm font-medium rounded`}>
                  {student.hours}
                </span>
              </div>
            )) : (
              <p className="text-sm text-gray-500 text-center py-4">No data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
