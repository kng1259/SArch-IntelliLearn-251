'use client';

import { Line, Doughnut, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface CourseAnalyticsTabProps {
  stats: {
    totalStudents: number;
    avgCompletion: number;
    courseRating: number;
    avgStudyTime: string;
  };
}

export default function CourseAnalyticsTab({ stats }: CourseAnalyticsTabProps) {
  // Enrollment Growth Data
  const enrollmentData = {
    labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
    datasets: [
      {
        label: 'Total Students',
        data: [120, 310, 420, 890, 1150],
        borderColor: '#818CF8',
        backgroundColor: 'rgba(129, 140, 248, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const enrollmentOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          color: '#818CF8',
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: '#1F2937',
        padding: 12,
        titleColor: '#F9FAFB',
        bodyColor: '#F9FAFB',
        borderColor: '#374151',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#F3F4F6',
        },
        ticks: {
          color: '#6B7280',
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

  // Course Completion Data
  const completionData = {
    labels: ['Completed: 45%', 'In Progress: 40%', 'Not Started: 15%'],
    datasets: [
      {
        data: [45, 40, 15],
        backgroundColor: ['#10B981', '#818CF8', '#E5E7EB'],
        borderWidth: 0,
      },
    ],
  };

  const completionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: '#1F2937',
        padding: 12,
        titleColor: '#F9FAFB',
        bodyColor: '#F9FAFB',
      },
    },
  };

  // Topic Mastery Data
  const topicMasteryData = {
    labels: ['HTML', 'CSS', 'JavaScript', 'React', 'Git'],
    datasets: [
      {
        label: 'Average proficiency by topic',
        data: [85, 78, 82, 70, 75],
        backgroundColor: 'rgba(129, 140, 248, 0.2)',
        borderColor: '#818CF8',
        borderWidth: 2,
        pointBackgroundColor: '#818CF8',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#818CF8',
      },
    ],
  };

  const topicMasteryOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          color: '#6B7280',
          backdropColor: 'transparent',
        },
        grid: {
          color: '#E5E7EB',
        },
        pointLabels: {
          color: '#374151',
          font: {
            size: 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1F2937',
        padding: 12,
        titleColor: '#F9FAFB',
        bodyColor: '#F9FAFB',
      },
    },
  };

  return (
    <div>
      {/* Charts Section */}
      <div className="space-y-6">
        {/* Enrollment Growth Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Enrollment Growth</h3>
            <p className="text-sm text-gray-600">Student enrollment over time</p>
          </div>
          <div style={{ height: '300px' }}>
            <Line data={enrollmentData} options={enrollmentOptions} />
          </div>
        </div>

        {/* Course Completion & Topic Mastery */}
        <div className="grid grid-cols-2 gap-6">
          {/* Course Completion */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Course Completion</h3>
              <p className="text-sm text-gray-600">Student progress distribution</p>
            </div>
            <div style={{ height: '280px' }} className="flex items-center justify-center">
              <Doughnut data={completionData} options={completionOptions} />
            </div>
          </div>

          {/* Topic Mastery */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Topic Mastery</h3>
              <p className="text-sm text-gray-600">Average proficiency by topic</p>
            </div>
            <div style={{ height: '280px' }} className="flex items-center justify-center">
              <Radar data={topicMasteryData} options={topicMasteryOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
