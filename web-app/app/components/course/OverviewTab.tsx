'use client';

interface Module {
  id: string;
  name: string;
  description?: string;
  order: number;
}

interface OverviewTabProps {
  courseData: {
    stats: {
      totalMaterials: number;
      totalQuizzes: number;
      totalAssignments: number;
    };
    modules: Module[];
  };
  onAddModuleClick: () => void;
  onEditModuleClick: (module: Module) => void;
  onDeleteModuleClick: (moduleId: string) => void;
}

export default function OverviewTab({ courseData, onAddModuleClick, onEditModuleClick, onDeleteModuleClick }: OverviewTabProps) {
  const handleDelete = (module: Module) => {
    if (confirm(`Bạn có chắc muốn xóa module "${module.name}"?`)) {
      onDeleteModuleClick(module.id);
    }
  };

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
          {courseData.modules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No modules available. Create the first module!</p>
            </div>
          ) : (
            courseData.modules.map((module, index) => (
              <div
                key={module.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-2">
                      Module {index + 1}: {module.name}
                    </h3>
                    {module.description && (
                      <p className="text-sm text-gray-600">{module.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onEditModuleClick(module)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      title="Edit module"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDelete(module)}
                      className="p-2 hover:bg-red-100 rounded-lg"
                      title="Delete module"
                    >
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          <button 
            onClick={onAddModuleClick}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors flex items-center justify-center gap-2"
          >
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
