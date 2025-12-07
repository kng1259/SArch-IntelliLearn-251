'use client';

import { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import { FormInput, FormTextarea } from '../FormComponents';

interface EditExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: {
    id: string;
    name: string;
    description?: string;
    startAt?: string;
    duration?: number;
  } | null;
  onSave: (data: { 
    name: string; 
    description: string; 
    startAt: string; 
    duration: number; 
  }) => void | Promise<void>;
}

export default function EditExamModal({
  isOpen,
  onClose,
  exam,
  onSave,
}: EditExamModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startAt, setStartAt] = useState('');
  const [duration, setDuration] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when exam changes
  useEffect(() => {
    if (exam) {
      setName(exam.name || '');
      setDescription(exam.description || '');
      setStartAt(exam.startAt ? exam.startAt.split('T')[0] : '');
      setDuration(exam.duration || 60);
    }
  }, [exam]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSave({ name, description, startAt, duration });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Exam"
      subtitle="Update exam details"
      onSubmit={handleSubmit}
      submitText={isSubmitting ? "Saving..." : "Save Changes"}
    >
      <FormInput
        label="Exam Title"
        id="examTitle"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g., Midterm Exam"
      />
      
      <FormTextarea
        label="Description"
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Brief description of the exam..."
      />

      <FormInput
        label="Exam Date"
        id="startDate"
        type="date"
        value={startAt}
        onChange={(e) => setStartAt(e.target.value)}
      />
      
      <FormInput
        label="Duration (minutes)"
        id="duration"
        type="number"
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value))}
        placeholder="60"
      />
    </BaseModal>
  );
}
