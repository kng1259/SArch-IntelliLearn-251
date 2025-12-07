'use client';

import { useState } from 'react';
import BaseModal from './BaseModal';
import { FormInput, FormTextarea } from '../FormComponents';

interface CreateModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: { 
    name: string; 
    description: string; 
  }) => void | Promise<void>;
}

export default function CreateModuleModal({
  isOpen,
  onClose,
  onAdd,
}: CreateModuleModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      return;
    }
    setIsSubmitting(true);
    try {
      await onAdd({ name, description });
      // Reset form
      setName('');
      setDescription('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Module"
      subtitle="Add a new module to organize course content"
      onSubmit={handleSubmit}
      submitText={isSubmitting ? "Creating..." : "Create Module"}
    >
      <FormInput
        label="Module Name"
        id="moduleName"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g., Introduction to HTML"
        required
      />
      
      <FormTextarea
        label="Description"
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Brief description of what this module covers..."
      />
    </BaseModal>
  );
}
