"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { use } from "react";
import { useRouter } from "next/navigation";
import CourseDetail from "@/app/components/course/CourseDetail";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/student/dashboard")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Hero */}
        <CourseDetail id={id} isEnrolled={true} />
      </main>
    </div>
  );
}
