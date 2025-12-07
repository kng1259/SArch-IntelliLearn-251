'use client';

import { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import { FormInput, FormTextarea } from '../FormComponents';

interface EditAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: {
    id: string;
    name: string;
    description?: string;
    startAt?: string;
    endAt?: string;
  } | null;
  onSave: (data: { 
    name: string; 
    description: string; 
    startAt: string; 
    endAt: string; 
  }) => void | Promise<void>;
}

export default function EditAssignmentModal({
  isOpen,
  onClose,
  assignment,
  onSave,
}: EditAssignmentModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when assignment changes
  useEffect(() => {
    if (assignment) {
      setName(assignment.name || '');
      setDescription(assignment.description || '');
      setStartAt(assignment.startAt ? assignment.startAt.split('T')[0] : '');
      setEndAt(assignment.endAt ? assignment.endAt.split('T')[0] : '');
    }
  }, [assignment]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSave({ name, description, startAt, endAt });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Assignment"
      subtitle="Update assignment details"
      onSubmit={handleSubmit}
      submitText={isSubmitting ? "Saving..." : "Save Changes"}
    >
      <FormInput
        label="Assignment Title"
        id="assignmentTitle"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g., Final Project"
      />
      
      <FormTextarea
        label="Description"
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Instructions for the assignment..."
      />

      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Start Date"
          id="startDate"
          type="date"
          value={startAt}
          onChange={(e) => setStartAt(e.target.value)}
        />
        
        <FormInput
          label="Due Date"
          id="dueDate"
          type="date"
          value={endAt}
          onChange={(e) => setEndAt(e.target.value)}
        />
      </div>
    </BaseModal>
  );
}
