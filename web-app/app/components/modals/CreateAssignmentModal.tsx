'use client';

import { useState } from 'react';
import BaseModal from './BaseModal';
import { FormInput, FormTextarea } from '../FormComponents';

interface CreateAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: { title: string; description: string; dueDate: string; maxScore: number }) => void;
}

export default function CreateAssignmentModal({
  isOpen,
  onClose,
  onAdd,
}: CreateAssignmentModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [maxScore, setMaxScore] = useState(100);

  const handleSubmit = () => {
    onAdd({ title, description, dueDate, maxScore });
    // Reset form
    setTitle('');
    setDescription('');
    setDueDate('');
    setMaxScore(100);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Assignment"
      subtitle="Add a new assignment to your course"
      onSubmit={handleSubmit}
      submitText="Create Assignment"
    >
      <FormInput
        label="Assignment Title"
        id="assignmentTitle"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g., Build a Portfolio Page"
      />
      
      <FormTextarea
        label="Description"
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Assignment instructions..."
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Due Date"
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          placeholder="mm/dd/yyyy"
        />
        
        <FormInput
          label="Max Score"
          id="maxScore"
          type="number"
          value={maxScore}
          onChange={(e) => setMaxScore(Number(e.target.value))}
        />
      </div>
    </BaseModal>
  );
}
