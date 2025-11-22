'use client';

import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'orange' | 'purple';
  link?: string;
  linkText?: string;
}

export default function DashboardCard({ 
  title, 
  value, 
  icon, 
  color = 'blue',
  link,
  linkText 
}: DashboardCardProps) {
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    orange: 'text-orange-600',
    purple: 'text-purple-600',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-semibold ${colorClasses[color]}`}>
              {value}
            </span>
            <span className={colorClasses[color]}>{icon}</span>
          </div>
          {link && linkText && (
            <a 
              href={link} 
              className={`text-sm ${colorClasses[color]} hover:underline mt-2 inline-flex items-center gap-1`}
            >
              {linkText}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
