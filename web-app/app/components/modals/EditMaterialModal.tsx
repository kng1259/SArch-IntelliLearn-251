'use client';

import { useState, useEffect, useRef } from 'react';
import BaseModal from './BaseModal';
import { FormInput } from '../FormComponents';

interface EditMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: {
    id: string;
    name: string;
    content?: string;
  } | null;
  onSave: (data: { 
    name: string; 
    content: string;
    file?: File | null;
  }) => void | Promise<void>;
}

export default function EditMaterialModal({
  isOpen,
  onClose,
  material,
  onSave,
}: EditMaterialModalProps) {
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Populate form when material changes
  useEffect(() => {
    if (material) {
      setName(material.name || '');
      setFile(null);
    }
  }, [material]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      return;
    }
    setIsSubmitting(true);
    try {
      await onSave({ name, content: material?.content || '', file });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Material"
      subtitle="Update learning material details"
      onSubmit={handleSubmit}
      submitText={isSubmitting ? "Saving..." : "Save Changes"}
    >
      <FormInput
        label="Material Title"
        id="materialTitle"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g., Introduction to HTML"
        required
      />
      
      {/* Current file info */}
      {material?.content && (
        <div className="text-sm text-gray-600">
          <span className="font-medium">Current file: </span>
          <a href={material.content} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            View current file
          </a>
        </div>
      )}

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Replace File (optional)
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="edit-file-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
              >
                <span>Upload a new file</span>
                <input
                  id="edit-file-upload"
                  name="edit-file-upload"
                  type="file"
                  className="sr-only"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.mp4,.mov,.avi,.mp3,.wav,.jpg,.jpeg,.png,.gif,.zip,.rar"
                />
              </label>
            </div>
          </div>
        </div>
        {file && (
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="truncate">{file.name}</span>
            <span className="text-gray-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              className="text-red-500 hover:text-red-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </BaseModal>
  );
}
