'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const router = useRouter();
  const [role, setRole] = useState<'student' | 'tutor'>('tutor');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add authentication logic here
    
    if (role === 'tutor') {
      router.push('/tutor/dashboard');
    } else {
      // TODO: Redirect to student dashboard when ready
      router.push('/student/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#E8EBF3] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo and Tagline */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg className="w-8 h-8 text-[#4F46E5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-xl font-medium text-[#4F46E5]">EduLearn LMS</span>
          </div>
          <p className="text-[#6B7280] text-sm font-normal">Your gateway to knowledge and growth</p>
        </div>

        {/* Sign In Form */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-[#111827] mb-1">Sign In</h1>
            <p className="text-[#6B7280] text-sm font-normal">Choose your role and enter your credentials</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg transition-all text-sm font-medium ${
                  role === 'student'
                    ? 'bg-[#E5E7EB] text-[#111827]'
                    : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB]'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Student</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('tutor')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg transition-all text-sm font-medium ${
                  role === 'tutor'
                    ? 'bg-white border-2 border-[#111827] text-[#111827]'
                    : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB]'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Tutor</span>
              </button>
            </div>

            {/* Email Input */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-semibold text-[#111827] mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tutor@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F3F4F6] border-0 rounded-lg text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-5">
              <label htmlFor="password" className="block text-sm font-semibold text-[#111827] mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F3F4F6] border-0 rounded-lg text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition-all"
                  required
                />
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-[#0F172A] text-white py-3 rounded-lg hover:bg-[#1E293B] hover:cursor-pointer transition-colors font-medium text-sm mb-4"
            >
              Sign in as {role === 'student' ? 'Student' : 'Tutor'}
            </button>

            {/* Sign Up Link */}
            <div className="text-center text-sm">
              <span className="text-[#6B7280]">Don't have an account? </span>
              <Link href="/signup" className="text-[#4F46E5] hover:text-[#4338CA] font-medium">
                Sign up as Student
              </Link>
            </div>
          </form>
        </div>

        {/* Demo Credentials Note */}
        <p className="text-center text-xs text-[#9CA3AF] mt-5">
          Demo credentials: Use any email/password combination
        </p>
      </div>
    </div>
  );
}
