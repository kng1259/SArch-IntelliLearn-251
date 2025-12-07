'use client';

import { useState, useEffect, useRef } from 'react';
import { useApi } from '@/lib/hooks/useApi';
import courseService, { Course, Student, FeedbackRequest } from '@/lib/services/courseService';
import TutorHeader from '@/app/components/TutorHeader';
import ProvideFeedbackModal from '@/app/components/modals/ProvideFeedbackModal';
import { useToast } from '@/app/components/Toast';

interface CourseInfo {
  courseId: string;
  courseName: string;
}

interface UniqueStudent extends Student {
  courses: CourseInfo[];
}

interface DropdownPosition {
  top: number;
  right: number;
}

export default function StudentManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<UniqueStudent | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const { data: courses, loading: coursesLoading, execute: fetchCourses } = useApi<Course[]>();
  const [uniqueStudents, setUniqueStudents] = useState<UniqueStudent[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  
  // Dropdown state for course selection
  const [dropdownStudent, setDropdownStudent] = useState<UniqueStudent | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const tutorId = typeof window !== 'undefined' ? localStorage.getItem('tutorId') : null;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownStudent(null);
        setDropdownPosition(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenDropdown = (student: UniqueStudent, event: React.MouseEvent) => {
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    setDropdownStudent(student);
    setDropdownPosition({
      top: rect.bottom + 4,
      right: window.innerWidth - rect.right,
    });
  };

  const handleSelectCourse = (student: UniqueStudent, courseId: string) => {
    setDropdownStudent(null);
    setDropdownPosition(null);
    handleProvideFeedback(student, courseId);
  };

  // Fetch courses on mount
  useEffect(() => {
    if (tutorId) {
      fetchCourses(() => courseService.getCoursesByTutor(tutorId));
    }
  }, [tutorId]);

  // Fetch students from all courses
  useEffect(() => {
    const fetchAllStudents = async () => {
      if (!courses || courses.length === 0) return;
      
      setLoadingStudents(true);
      try {
        const studentsPromises = courses.map(async (course) => {
          const students = await courseService.getCourseStudents(course.id);
          return students.map(student => ({
            ...student,
            courseName: course.name,
            courseId: course.id,
          }));
        });
        
        const studentsArrays = await Promise.all(studentsPromises);
        const flattenedStudents = studentsArrays.flat();
        
        // Group students by ID to consolidate duplicates
        const studentMap = new Map<string, UniqueStudent>();
        flattenedStudents.forEach(student => {
          const existing = studentMap.get(student.id);
          if (existing) {
            // Add course to existing student if not already present
            const courseExists = existing.courses.some(c => c.courseId === student.courseId);
            if (!courseExists) {
              existing.courses.push({
                courseId: student.courseId,
                courseName: student.courseName,
              });
            }
          } else {
            // Create new unique student entry
            studentMap.set(student.id, {
              id: student.id,
              fullName: student.fullName,
              courses: [{
                courseId: student.courseId,
                courseName: student.courseName,
              }],
            });
          }
        });
        
        setUniqueStudents(Array.from(studentMap.values()));
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchAllStudents();
  }, [courses]);

  const handleProvideFeedback = (student: UniqueStudent, courseId: string) => {
    setSelectedStudent(student);
    setSelectedCourseId(courseId);
    setFeedbackModalOpen(true);
  };

  const toast = useToast();

  const handleSaveFeedback = async (feedback: string) => {
    if (!selectedStudent || !selectedCourseId) return;
    
    try {
      const feedbackRequest: FeedbackRequest = {
        studentId: selectedStudent.id,
        courseId: selectedCourseId,
        content: feedback,
      };
      
      await courseService.createFeedback(feedbackRequest);
      toast.success('Feedback đã được gửi thành công!');
      setFeedbackModalOpen(false);
    } catch (error: any) {
      console.error('Error creating feedback:', error);
      toast.error(`Lỗi gửi feedback: ${error.message}`);
    }
  };

  const filteredStudents = uniqueStudents.filter(student =>
    student.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const loading = coursesLoading || loadingStudents;
  const totalStudents = uniqueStudents.length;
  const activeCourses = courses?.length || 0;

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TutorHeader />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Student Management</h1>
          <p className="text-gray-600">View and manage students across all your courses</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-2">Total Students</p>
            <p className="text-3xl font-semibold text-indigo-600">{totalStudents}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-2">Active Courses</p>
            <p className="text-3xl font-semibold text-indigo-600">{activeCourses}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-2">Avg Completion</p>
            <p className="text-3xl font-semibold text-indigo-600">-</p>
            <p className="text-xs text-gray-500 mt-1">Coming soon</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-2">Avg Grade</p>
            <p className="text-3xl font-semibold text-indigo-600">-</p>
            <p className="text-xs text-gray-500 mt-1">Coming soon</p>
          </div>
        </div>

        {/* Student Roster */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Student Roster</h2>
                <p className="text-sm text-gray-600">Manage and track student progress</p>
              </div>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto overflow-y-visible">
            {loading && (
              <div className="text-center py-12 text-gray-600">
                Loading students...
              </div>
            )}
            
            {!loading && filteredStudents.length === 0 && (
              <div className="text-center py-12 text-gray-600">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <p className="text-lg font-medium">No students found</p>
                <p className="text-sm mt-1">Students will appear here when they enroll in your courses</p>
              </div>
            )}
            
            {!loading && filteredStudents.length > 0 && (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Student</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Enrolled Courses</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Student ID</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-semibold text-indigo-600">
                            {getInitials(student.fullName)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{student.fullName}</p>
                            <p className="text-xs text-gray-500">{student.courses.length} course{student.courses.length > 1 ? 's' : ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {student.courses.map((course) => (
                            <span 
                              key={course.courseId}
                              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
                            >
                              {course.courseName}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 font-mono">{student.id.slice(0, 8)}...</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {student.courses.length === 1 ? (
                            <button 
                              onClick={() => handleProvideFeedback(student, student.courses[0].courseId)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                              title="Provide Feedback"
                            >
                              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                            </button>
                          ) : (
                            <button 
                              onClick={(e) => handleOpenDropdown(student, e)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                              title="Provide Feedback"
                            >
                              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* Course Selection Dropdown - Fixed position outside table */}
      {dropdownStudent && dropdownPosition && (
        <div
          ref={dropdownRef}
          className="fixed w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1"
          style={{
            top: dropdownPosition.top,
            right: dropdownPosition.right,
            zIndex: 9999,
          }}
        >
          <p className="px-3 py-1.5 text-xs text-gray-500 font-medium">Select course:</p>
          {dropdownStudent.courses.map((course) => (
            <button
              key={course.courseId}
              onClick={() => handleSelectCourse(dropdownStudent, course.courseId)}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              {course.courseName}
            </button>
          ))}
        </div>
      )}

      {/* Feedback Modal */}
      {selectedStudent && selectedCourseId && (
        <ProvideFeedbackModal
          isOpen={feedbackModalOpen}
          onClose={() => setFeedbackModalOpen(false)}
          student={{
            name: selectedStudent.fullName,
            avatar: getInitials(selectedStudent.fullName),
            course: selectedStudent.courses.find(c => c.courseId === selectedCourseId)?.courseName || '',
            progress: 0,
            avgGrade: 0,
          }}
          onSave={handleSaveFeedback}
        />
      )}
    </div>
  );
}
