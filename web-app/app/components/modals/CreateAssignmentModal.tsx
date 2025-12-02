'use client';

import { useState } from 'react';
import BaseModal from './BaseModal';
import { FormInput, FormTextarea } from '../FormComponents';

interface CreateAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: { 
    title: string; 
    description: string; 
    startDate: string;
    dueDate: string; 
    maxScore: number;
    instructionFile?: File;
    gradingGuidelinesFile?: File;
  }) => void;
}

export default function CreateAssignmentModal({
  isOpen,
  onClose,
  onAdd,
}: CreateAssignmentModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [maxScore, setMaxScore] = useState(100);
  const [instructionFile, setInstructionFile] = useState<File | undefined>();
  const [gradingGuidelinesFile, setGradingGuidelinesFile] = useState<File | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onAdd({ 
        title, 
        description, 
        startDate,
        dueDate, 
        maxScore, 
        instructionFile, 
        gradingGuidelinesFile 
      });
      // Reset form
      setTitle('');
      setDescription('');
      setStartDate('');
      setDueDate('');
      setMaxScore(100);
      setInstructionFile(undefined);
      setGradingGuidelinesFile(undefined);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Assignment"
      subtitle="Add a new assignment to your course"
      onSubmit={handleSubmit}
      submitText={isSubmitting ? "Creating..." : "Create Assignment"}
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
          label="Start Date"
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        
        <FormInput
          label="Due Date"
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <FormInput
        label="Max Score"
        id="maxScore"
        type="number"
        value={maxScore}
        onChange={(e) => setMaxScore(Number(e.target.value))}
      />

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Instruction File (Optional)
          </label>
          <input
            type="file"
            onChange={(e) => setInstructionFile(e.target.files?.[0])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
          />
          {instructionFile && (
            <p className="text-xs text-gray-500 mt-1">Selected: {instructionFile.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Grading Guidelines File (Optional)
          </label>
          <input
            type="file"
            onChange={(e) => setGradingGuidelinesFile(e.target.files?.[0])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
          />
          {gradingGuidelinesFile && (
            <p className="text-xs text-gray-500 mt-1">Selected: {gradingGuidelinesFile.name}</p>
          )}
        </div>
      </div>
    </BaseModal>
  );
}
