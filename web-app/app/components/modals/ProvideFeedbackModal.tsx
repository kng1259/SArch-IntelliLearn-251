'use client';

import { useState } from 'react';
import { useToast } from '@/app/components/Toast';

interface ProvideFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: {
    name: string;
    avatar: string;
    course: string;
    progress: number;
    avgGrade: number;
  };
  onSave?: (feedback: string) => void | Promise<void>;
}

export default function ProvideFeedbackModal({ isOpen, onClose, student, onSave }: ProvideFeedbackModalProps) {
  const [feedback, setFeedback] = useState('');
  const [isSending, setIsSending] = useState(false);
  const toast = useToast();

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toast.warning('Please enter feedback message');
      return;
    }

    if (onSave) {
      setIsSending(true);
      try {
        await onSave(feedback);
        setFeedback('');
        onClose();
      } catch (error) {
        console.error('Failed to send feedback:', error);
      } finally {
        setIsSending(false);
      }
    } else {
      // Fallback if no onSave provided
      console.log('Sending feedback to:', student.name, feedback);
      setFeedback('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30  flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Provide Learning Feedback</h2>
            <p className="text-sm text-gray-600 mt-1">Send personalized feedback to {student.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Student Info */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-base font-semibold text-gray-600">
              {student.avatar}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{student.name}</p>
              <p className="text-sm text-blue-600">{student.course}</p>
            </div>
          </div>

          {/* Progress & Grade */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Progress</p>
              <p className="text-lg font-semibold text-indigo-600">{student.progress}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Average Grade</p>
              <p className="text-lg font-semibold text-indigo-600">{student.avgGrade}%</p>
            </div>
          </div>

          {/* Feedback Message */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Feedback Message</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Write your feedback here..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm placeholder:text-gray-500 placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSending}
            className="px-6 py-2.5 text-white bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? 'Sending...' : 'Send Feedback'}
          </button>
        </div>
      </div>
    </div>
  );
}
