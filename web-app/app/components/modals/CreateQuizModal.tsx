'use client';

import { useState } from 'react';
import BaseModal from './BaseModal';
import { FormInput, FormTextarea } from '../FormComponents';

interface CreateQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: { title: string; description: string; timeLimit: number; passingScore: number }) => void;
}

export default function CreateQuizModal({
  isOpen,
  onClose,
  onAdd,
}: CreateQuizModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState(15);
  const [passingScore, setPassingScore] = useState(70);

  const handleSubmit = () => {
    onAdd({ title, description, timeLimit, passingScore });
    // Reset form
    setTitle('');
    setDescription('');
    setTimeLimit(15);
    setPassingScore(70);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Quiz"
      subtitle="Add a new quiz to your course"
      onSubmit={handleSubmit}
      submitText="Create Quiz"
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
    </BaseModal>
  );
}
