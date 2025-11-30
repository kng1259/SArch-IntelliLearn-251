'use client';

import { useState } from 'react';
import BaseModal from './BaseModal';

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; description: string }) => void;
}

export default function CreateCourseModal({ isOpen, onClose, onSave }: CreateCourseModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const handleSubmit = () => {
    onSave(formData);
    setFormData({ title: '', description: '' });
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Course"
      subtitle="Add a new course to your teaching portfolio"
      onSubmit={handleSubmit}
      submitText="Create Course"
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
            Course Title
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-4 py-2.5 bg-[#F3F4F6] border-0 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition-all"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief description of the course..."
            rows={4}
            className="w-full px-4 py-2.5 bg-[#F3F4F6] border-0 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition-all resize-none"
          />
        </div>
      </div>
    </BaseModal>
  );
}
