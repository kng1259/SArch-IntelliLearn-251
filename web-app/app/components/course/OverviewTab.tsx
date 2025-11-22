'use client';

interface OverviewTabProps {
  courseData: {
    stats: {
      totalMaterials: number;
      totalQuizzes: number;
      totalAssignments: number;
    };
    modules: Array<{
      id: string;
      title: string;
      materials: number;
      quizzes: number;
      assignments: number;
    }>;
  };
}

export default function OverviewTab({ courseData }: OverviewTabProps) {
  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">Total Materials</p>
          <p className="text-3xl font-semibold text-[#4F46E5]">{courseData.stats.totalMaterials}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">Total Quizzes</p>
          <p className="text-3xl font-semibold text-[#4F46E5]">{courseData.stats.totalQuizzes}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">Total Assignments</p>
          <p className="text-3xl font-semibold text-[#4F46E5]">{courseData.stats.totalAssignments}</p>
        </div>
      </div>

      {/* Course Modules */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Course Modules</h2>
          <p className="text-sm text-gray-600">Organize your course content</p>
        </div>

        <div className="space-y-4">
          {courseData.modules.map((module, index) => (
            <div
              key={module.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Module {index + 1}: {module.title}
                  </h3>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>{module.materials} materials</span>
                    <span>{module.quizzes} quizzes</span>
                    <span>{module.assignments} assignments</span>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Module
          </button>
        </div>
      </div>
    </div>
  );
}
