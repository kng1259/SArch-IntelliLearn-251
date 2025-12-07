'use client';

interface Material {
  id: string;
  title: string;
  module: string;
  type: string;
  url?: string;
}

interface MaterialsTabProps {
  materials: Material[];
  onAddClick: () => void;
  onEditClick: (material: Material) => void;
  onDeleteClick: (materialId: string) => void;
}

export default function MaterialsTab({ materials, onAddClick, onEditClick, onDeleteClick }: MaterialsTabProps) {
  const handleDelete = (material: Material) => {
    if (confirm(`Bạn có chắc muốn xóa "${material.title}"?`)) {
      onDeleteClick(material.id);
    }
  };
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Learning Materials</h2>
          <p className="text-sm text-gray-600">Manage course content and resources</p>
        </div>
        <button onClick={onAddClick} className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Material
        </button>
      </div>

      <div className="space-y-3">
        {materials.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="font-medium text-lg mb-2">Chưa có tài liệu nào</p>
            <p className="text-sm">Thêm tài liệu học tập cho khóa học của bạn</p>
          </div>
        ) : (
          materials.map((material) => (
            <div
              key={material.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{material.title}</h3>
                  <p className="text-sm text-gray-600">{material.module} • {material.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Download button */}
                {material.url && (
                  <a 
                    href={material.url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-green-100 rounded-lg"
                    title="Download file"
                  >
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </a>
                )}
                <button 
                  onClick={() => onEditClick(material)}
                  className="p-2 hover:bg-gray-200 rounded-lg"
                  title="Edit material"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button 
                  onClick={() => handleDelete(material)}
                  className="p-2 hover:bg-red-100 rounded-lg"
                  title="Delete material"
                >
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
