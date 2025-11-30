'use client';

import { useState } from 'react';
import BaseModal from './BaseModal';
import { FormInput, FormSelect, FormTextarea } from '../FormComponents';

interface UpdateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseData: {
    title: string;
    description: string;
    category?: string;
  };
  onSave: (data: { title: string; description: string; category: string }) => void;
}

export default function UpdateCourseModal({
  isOpen,
  onClose,
  courseData,
  onSave,
}: UpdateCourseModalProps) {
  const [title, setTitle] = useState(courseData.title);
  const [description, setDescription] = useState(courseData.description);
  const [category, setCategory] = useState(courseData.category || 'Web Development');

  const handleSubmit = () => {
    onSave({ title, description, category });
    onClose();
  };

  const categoryOptions = [
    { value: 'Web Development', label: 'Web Development' },
    { value: 'Mobile Development', label: 'Mobile Development' },
    { value: 'Data Science', label: 'Data Science' },
    { value: 'Machine Learning', label: 'Machine Learning' },
    { value: 'Design', label: 'Design' },
    { value: 'Business', label: 'Business' },
  ];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Course"
      subtitle="Edit course details"
      onSubmit={handleSubmit}
      submitText="Save Changes"
      maxWidth="lg"
    >
      <FormInput
        label="Course Title"
        id="courseTitle"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <FormTextarea
        label="Description"
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <FormSelect
        label="Category"
        id="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        options={categoryOptions}
      />
    </BaseModal>
  );
}
