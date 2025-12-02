'use client';

import { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import { FormInput, FormTextarea } from '../FormComponents';

interface EditQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz: {
    id: string;
    name: string;
    description: string;
    startAt?: string;
    duration?: number;
    level?: string;
  } | null;
  onSave: (data: { 
    name: string; 
    description: string; 
    startAt: string; 
    duration: number; 
    level: string 
  }) => void | Promise<void>;
}

export default function EditQuizModal({
  isOpen,
  onClose,
  quiz,
  onSave,
}: EditQuizModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startAt, setStartAt] = useState('');
  const [duration, setDuration] = useState(15);
  const [level, setLevel] = useState('NORMAL');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when quiz changes
  useEffect(() => {
    if (quiz) {
      setName(quiz.name || '');
      setDescription(quiz.description || '');
      setStartAt(quiz.startAt ? quiz.startAt.split('T')[0] : '');
      setDuration(quiz.duration || 15);
      setLevel(quiz.level || 'NORMAL');
    }
  }, [quiz]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSave({ name, description, startAt, duration, level });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Quiz"
      subtitle="Update quiz details"
      onSubmit={handleSubmit}
      submitText={isSubmitting ? "Saving..." : "Save Changes"}
    >
      <FormInput
        label="Quiz Title"
        id="quizTitle"
        value={name}
        onChange={(e) => setName(e.target.value)}
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
        value={startAt}
        onChange={(e) => setStartAt(e.target.value)}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Duration (min)"
          id="duration"
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Difficulty Level
          </label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-gray-900 focus:ring-2 focus:ring-blue-500"
          >
            <option value="EASY">Easy</option>
            <option value="NORMAL">Normal</option>
            <option value="HARD">Hard</option>
          </select>
        </div>
      </div>
    </BaseModal>
  );
}
