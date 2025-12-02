'use client';

import { useState } from 'react';
import BaseModal from './BaseModal';
import { FormInput, FormTextarea } from '../FormComponents';

interface CreateQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: { title: string; description: string; startDate: string; timeLimit: number; passingScore: number; level: string }) => void | Promise<void>;
}

export default function CreateQuizModal({
  isOpen,
  onClose,
  onAdd,
}: CreateQuizModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [timeLimit, setTimeLimit] = useState(15);
  const [passingScore, setPassingScore] = useState(70);
  const [level, setLevel] = useState('NORMAL');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onAdd({ title, description, startDate, timeLimit, passingScore, level });
      // Reset form
      setTitle('');
      setDescription('');
      setStartDate('');
      setTimeLimit(15);
      setPassingScore(70);
      setLevel('NORMAL');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Quiz"
      subtitle="Add a new quiz to your course"
      onSubmit={handleSubmit}
      submitText={isSubmitting ? "Creating..." : "Create Quiz"}
    >
      <FormInput
        label="Quiz Title"
        id="quizTitle"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g., HTML Basics Quiz"
      />
      
      <FormTextarea
        label="Description"
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Brief description..."
      />

      <FormInput
        label="Start Date"
        id="startDate"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Time Limit (min)"
          id="timeLimit"
          type="number"
          value={timeLimit}
          onChange={(e) => setTimeLimit(Number(e.target.value))}
        />
        
        <FormInput
          label="Passing Score (%)"
          id="passingScore"
          type="number"
          value={passingScore}
          onChange={(e) => setPassingScore(Number(e.target.value))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">
          Difficulty Level
        </label>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        >
          <option value="EASY">Easy</option>
          <option value="NORMAL">Normal</option>
          <option value="HARD">Hard</option>
        </select>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mt-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-indigo-800">Questions can be added after creation</p>
            <p className="text-xs text-indigo-600 mt-1">
              After creating the quiz, click on "Questions" button to add and manage quiz questions.
            </p>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
