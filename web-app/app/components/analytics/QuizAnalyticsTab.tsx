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
import { QuizAnalysisResponse } from '@/lib/services/analyticsService';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface QuizAnalyticsTabProps {
  quizAnalysis?: QuizAnalysisResponse[];
}

export default function QuizAnalyticsTab({ quizAnalysis }: QuizAnalyticsTabProps) {
  // Transform API data or use mock data
  const quizzes = quizAnalysis?.map(quiz => ({
    id: quiz.id,
    title: quiz.name,
    totalAttempts: quiz.totalAttempts || 0,
    avgScore: quiz.avgScore || 0,
    passRate: quiz.passRate || 0,
    badge: `${quiz.avgScore || 0}% avg`,
    badgeColor: (quiz.avgScore || 0) >= 80 ? 'bg-green-100 text-green-700' : 
                (quiz.avgScore || 0) >= 60 ? 'bg-blue-100 text-blue-700' : 
                'bg-amber-100 text-amber-700',
  })) || [
    { id: '1', title: 'HTML Basics', totalAttempts: 124, avgScore: 85, passRate: 92, badge: '85% avg', badgeColor: 'bg-green-100 text-green-700' },
    { id: '2', title: 'CSS Fundamentals', totalAttempts: 98, avgScore: 78, passRate: 85, badge: '78% avg', badgeColor: 'bg-blue-100 text-blue-700' },
    { id: '3', title: 'JavaScript Intro', totalAttempts: 87, avgScore: 72, passRate: 78, badge: '72% avg', badgeColor: 'bg-blue-100 text-blue-700' },
    { id: '4', title: 'React Basics', totalAttempts: 65, avgScore: 68, passRate: 70, badge: '68% avg', badgeColor: 'bg-amber-100 text-amber-700' },
  ];

  // Quiz Performance Overview Data
  const quizPerformanceData = {
    labels: quizzes.map(q => q.title),
    datasets: [
      {
        label: 'Avg Score %',
        data: quizzes.map(q => q.avgScore),
        backgroundColor: '#818CF8',
        borderRadius: 6,
        barThickness: 50,
      },
      {
        label: 'Total Attempts',
        data: quizzes.map(q => q.totalAttempts),
        backgroundColor: '#10B981',
        borderRadius: 6,
        barThickness: 50,
      },
    ],
  };

  const quizPerformanceOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
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

  // Quiz Statistics Data - removed since we now use quizzes from props/API

  return (
    <div className="space-y-6">
      {/* Empty State */}
      {quizzes.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-500">No quiz data available yet.</p>
        </div>
      ) : (
        <>
          {/* Quiz Performance Overview Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Quiz Performance Overview</h3>
              <p className="text-sm text-gray-600">Average scores and attempt statistics</p>
            </div>
            <div style={{ height: '300px' }}>
              <Bar data={quizPerformanceData} options={quizPerformanceOptions} />
            </div>
          </div>

          {/* Quiz Statistics */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Quiz Statistics</h3>
              <p className="text-sm text-gray-600">Detailed breakdown by quiz</p>
            </div>

            <div className="space-y-4">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-base font-semibold text-gray-900">{quiz.title}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${quiz.badgeColor}`}>
                      {quiz.badge}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Attempts</p>
                      <p className="text-2xl font-semibold text-[#4F46E5]">{quiz.totalAttempts}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Average Score</p>
                      <p className="text-2xl font-semibold text-[#4F46E5]">{quiz.avgScore}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Pass Rate</p>
                      <p className="text-2xl font-semibold text-[#4F46E5]">{quiz.passRate}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
