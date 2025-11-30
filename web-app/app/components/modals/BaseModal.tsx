'use client';

import { ReactNode } from 'react';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  children: ReactNode;
  onSubmit: () => void;
  submitText: string;
  maxWidth?: 'sm' | 'md' | 'lg';
}

export default function BaseModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  onSubmit,
  submitText,
  maxWidth = 'md',
}: BaseModalProps) {
  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Modal */}
      <div className={`relative bg-white rounded-lg shadow-xl w-full ${widthClasses[maxWidth]} mx-4`}>
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">{children}</div>

        {/* Footer */}
        <div className="p-6 pt-0">
          <button
            onClick={onSubmit}
            className="w-full bg-[#0F172A] text-white py-3 rounded-lg hover:bg-[#1E293B] transition-colors font-medium text-sm"
          >
            {submitText}
          </button>
        </div>
      </div>
    </div>
  );
}
