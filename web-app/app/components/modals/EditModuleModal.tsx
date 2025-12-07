'use client';

import { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import { FormInput, FormTextarea } from '../FormComponents';

interface EditModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  module: {
    id: string;
    name: string;
    description?: string;
    order?: number;
  } | null;
  onSave: (data: { 
    name: string; 
    description: string; 
  }) => void | Promise<void>;
}

export default function EditModuleModal({
  isOpen,
  onClose,
  module,
  onSave,
}: EditModuleModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when module changes
  useEffect(() => {
    if (module) {
      setName(module.name || '');
      setDescription(module.description || '');
    }
  }, [module]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      return;
    }
    setIsSubmitting(true);
    try {
      await onSave({ name, description });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Module"
      subtitle="Update module details"
      onSubmit={handleSubmit}
      submitText={isSubmitting ? "Saving..." : "Save Changes"}
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
