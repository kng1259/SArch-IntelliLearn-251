'use client';

import Link from 'next/link';

interface Quiz {
  id: string;
  title: string;
  description?: string;
  startAt?: string;
  duration: number;
  level?: string;
  questions: number;
}

interface QuizzesTabProps {
  quizzes: Quiz[];
  courseId: string;
  onAddClick: () => void;
  onEditClick: (quiz: Quiz) => void;
  onDeleteClick: (quizId: string) => void;
}

const getLevelBadgeColor = (level?: string) => {
  switch (level?.toUpperCase()) {
    case 'EASY':
      return 'bg-green-100 text-green-700';
    case 'HARD':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-yellow-100 text-yellow-700';
  }
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'Not set';
  return new Date(dateStr).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function QuizzesTab({ quizzes, courseId, onAddClick, onEditClick, onDeleteClick }: QuizzesTabProps) {
  const handleDelete = (quizId: string, quizTitle: string) => {
    if (confirm(`Bạn có chắc muốn xóa quiz "${quizTitle}"?`)) {
      onDeleteClick(quizId);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Quizzes</h2>
          <p className="text-sm text-gray-600">Create and manage course quizzes ({quizzes.length} total)</p>
        </div>
        <button onClick={onAddClick} className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Quiz
        </button>
      </div>

      {quizzes.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p>No quizzes yet. Create your first quiz!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900">{quiz.title}</h3>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getLevelBadgeColor(quiz.level)}`}>
                      {quiz.level || 'NORMAL'}
                    </span>
                  </div>
                  {quiz.description && (
                    <p className="text-sm text-gray-500 mb-1 line-clamp-1">{quiz.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {quiz.questions} questions
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {quiz.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(quiz.startAt)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/tutor/courses/${courseId}/quiz/${quiz.id}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors text-sm font-medium"
                  title="Manage Questions"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Questions
                </Link>
                <button 
                  onClick={() => onEditClick(quiz)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Edit Quiz"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button 
                  onClick={() => handleDelete(quiz.id, quiz.title)}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                  title="Delete Quiz"
                >
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
