'use client';

import Image from 'next/image';
import Link from 'next/link';

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  students: number;
  rating: number;
  maxRating?: number;
}

export default function CourseCard({
  id,
  title,
  description,
  image,
  students,
  rating,
  maxRating = 5.0,
}: CourseCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Course Image */}
      <div className="relative h-48 bg-gray-200">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      {/* Course Content */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {description}
        </p>

        {/* Course Stats */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <div>
            <span className="text-gray-600">Students</span>
            <p className="font-semibold text-gray-900">{students.toLocaleString('en-US')}</p>
          </div>
          <div>
            <span className="text-gray-600">Rating</span>
            <p className="font-semibold text-gray-900">
              {rating.toFixed(1)} / {maxRating.toFixed(1)}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Link href={`/tutor/courses/${id}`}>
            <button className="w-full bg-black text-white py-2.5 rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm">
              Manage Course
            </button>
          </Link>
          <Link href={`/tutor/analytics/${id}`}>
            <button className="w-full border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm">
              View Analytics
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
