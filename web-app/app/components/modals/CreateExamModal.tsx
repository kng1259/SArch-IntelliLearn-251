'use client';

import { useState } from 'react';
import BaseModal from './BaseModal';
import { FormInput, FormTextarea } from '../FormComponents';

interface CreateExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: { title: string; description: string; examDate: string; duration: number; totalMarks: number }) => void | Promise<void>;
}

export default function CreateExamModal({
  isOpen,
  onClose,
  onAdd,
}: CreateExamModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [examDate, setExamDate] = useState('');
  const [duration, setDuration] = useState(120);
  const [totalMarks, setTotalMarks] = useState(100);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onAdd({ title, description, examDate, duration, totalMarks });
      // Reset form
      setTitle('');
      setDescription('');
      setExamDate('');
      setDuration(120);
      setTotalMarks(100);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Exam"
      subtitle="Schedule a new exam"
      onSubmit={handleSubmit}
      submitText={isSubmitting ? "Creating..." : "Schedule Exam"}
    >
      <FormInput
        label="Exam Title"
        id="examTitle"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g., Final Exam"
      />
      
      <FormTextarea
        label="Description"
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Exam description..."
      />
      
      <FormInput
        label="Exam Date"
        id="examDate"
        type="date"
        value={examDate}
        onChange={(e) => setExamDate(e.target.value)}
        placeholder="mm/dd/yyyy"
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Duration (min)"
          id="duration"
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        />
        
        <FormInput
          label="Total Marks"
          id="totalMarks"
          type="number"
          value={totalMarks}
          onChange={(e) => setTotalMarks(Number(e.target.value))}
        />
      </div>
    </BaseModal>
  );
}
