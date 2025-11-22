'use client';

import { useState } from 'react';
import BaseModal from './BaseModal';
import { FormInput, FormSelect } from '../FormComponents';

interface AddMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  modules: { id: string; title: string }[];
  onAdd: (data: { title: string; type: string; module: string }) => void;
}

export default function AddMaterialModal({
  isOpen,
  onClose,
  modules,
  onAdd,
}: AddMaterialModalProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('video');
  const [module, setModule] = useState(modules[0]?.id || '');

  const handleSubmit = () => {
    onAdd({ title, type, module });
    // Reset form
    setTitle('');
    setType('video');
    setModule(modules[0]?.id || '');
    onClose();
  };

  const typeOptions = [
    { value: 'video', label: 'Video' },
    { value: 'document', label: 'Document' },
    { value: 'slides', label: 'Slides' },
    { value: 'article', label: 'Article' },
  ];

  const moduleOptions = modules.map((m) => ({ value: m.id, label: m.title }));

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Learning Material"
      subtitle="Upload new course content"
      onSubmit={handleSubmit}
      submitText="Add Material"
    >
      <FormInput
        label="Material Title"
        id="materialTitle"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g., Introduction to HTML"
      />
      
      <FormSelect
        label="Type"
        id="type"
        value={type}
        onChange={(e) => setType(e.target.value)}
        options={typeOptions}
      />
      
      <FormSelect
        label="Module"
        id="module"
        value={module}
        onChange={(e) => setModule(e.target.value)}
        options={moduleOptions}
      />
    </BaseModal>
  );
}
