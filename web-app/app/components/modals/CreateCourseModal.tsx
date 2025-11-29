'use client';

import { useState } from 'react';
import BaseModal from './BaseModal';

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; description: string; category: string; startDate: string; endDate: string }) => void;
}

export default function CreateCourseModal({ isOpen, onClose, onSave }: CreateCourseModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  });

  const handleSubmit = () => {
    onSave(formData);
    setFormData({ 
      title: '', 
      description: '',
      category: 'General',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
    });
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

        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-2">
            Category
          </label>
          <input
            id="category"
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="e.g., Programming, Mathematics, Science"
            className="w-full px-4 py-2.5 bg-[#F3F4F6] border-0 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-semibold text-gray-900 mb-2">
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
              className="w-full px-4 py-2.5 bg-[#F3F4F6] border-0 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition-all"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-semibold text-gray-900 mb-2">
              End Date
            </label>
            <input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
              min={formData.startDate}
              className="w-full px-4 py-2.5 bg-[#F3F4F6] border-0 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition-all"
            />
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
