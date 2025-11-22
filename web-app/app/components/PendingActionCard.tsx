'use client';

import Link from 'next/link';

interface PendingActionCardProps {
  id: string;
  studentName: string;
  action: string;
  submittedDate: string;
}

export default function PendingActionCard({
  id,
  studentName,
  action,
  submittedDate,
}: PendingActionCardProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div>
        <p className="font-medium text-gray-900">{studentName} - {action}</p>
        <p className="text-sm text-gray-500">Submitted on {submittedDate}</p>
      </div>
      <Link href={`/tutor/grading/${id}`}>
        <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
          Grade
        </button>
      </Link>
    </div>
  );
}
