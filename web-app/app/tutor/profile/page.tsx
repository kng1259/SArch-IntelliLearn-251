'use client';

import { useState, useEffect } from 'react';
import TutorHeader from '@/app/components/TutorHeader';
import { useToast } from '@/app/components/Toast';
import authService from '@/lib/services/authService';

export default function TutorProfile() {
  const toast = useToast();
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    location: '',
    bio: '',
    organization: '',
    website: '',
  });

  const [passwordData, setPasswordData] = useState({
    lastChanged: 'Unknown',
  });

  // Fetch user info on mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await authService.getUserInfo();
        setProfileData(prev => ({
          ...prev,
          fullName: userInfo.name || `${userInfo.given_name || ''} ${userInfo.family_name || ''}`.trim() || 'Unknown',
          email: userInfo.email || '',
        }));
      } catch (err) {
        console.error('Failed to fetch user info:', err);
        toast.error('Không thể tải thông tin người dùng');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleSavePersonal = async () => {
    setSaving(true);
    try {
      // TODO: Implement profile update API when available
      // For now, just show success message and close edit mode
      toast.success('Lưu thông tin thành công!');
      setIsEditingPersonal(false);
    } catch (err) {
      console.error('Failed to save profile:', err);
      toast.error('Lỗi khi lưu thông tin');
    } finally {
      setSaving(false);
    }
  };

  const handleEditProfile = () => {
    setIsEditingPersonal(true);
  };

  const handleChangePassword = () => {
    // TODO: Implement password change - redirect to Keycloak account page
    toast.info('Tính năng đổi mật khẩu sẽ sớm được hỗ trợ');
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion
    toast.warning('Tính năng này cần xác nhận từ quản trị viên');
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n.charAt(0).toUpperCase())
      .slice(0, 3)
      .join('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TutorHeader />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TutorHeader />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-3xl font-semibold text-gray-600">
                {getInitials(profileData.fullName)}
              </div>
              <button className="absolute bottom-0 right-0 bg-black text-white text-xs px-3 py-1 rounded-full hover:bg-gray-800 transition-colors">
                Edit
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-xl font-semibold text-gray-900">{profileData.fullName}</h2>
                <div className="flex items-center gap-3">
                  {isEditingPersonal && (
                    <button
                      onClick={() => setIsEditingPersonal(false)}
                      className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={isEditingPersonal ? handleSavePersonal : handleEditProfile}
                    disabled={saving}
                    className="bg-black text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang lưu...
                      </>
                    ) : isEditingPersonal ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save Changes
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Profile
                      </>
                    )}
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mb-3">{profileData.email}</p>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-black text-white text-xs font-medium rounded">
                  Tutor
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded border border-gray-300">
                  Verified Educator
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Personal Information</h3>
            <p 
              className="text-sm text-blue-600 cursor-pointer hover:underline" 
              onClick={handleEditProfile}
            >
              Update your personal details
            </p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Full Name</label>
                {isEditingPersonal ? (
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-100 border-0 rounded-lg text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 text-sm">{profileData.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Email Address</label>
                {isEditingPersonal ? (
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-100 border-0 rounded-lg text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 text-sm">{profileData.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Phone Number</label>
                {isEditingPersonal ? (
                  <input
                    type="tel"
                    value={profileData.phoneNumber}
                    onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-100 border-0 rounded-lg text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 text-sm">{profileData.phoneNumber}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Location</label>
                {isEditingPersonal ? (
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-100 border-0 rounded-lg text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 text-sm">{profileData.location}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Date of Birth</label>
                {isEditingPersonal ? (
                  <input
                    type="text"
                    value={profileData.dateOfBirth}
                    onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-100 border-0 rounded-lg text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 text-sm">{profileData.dateOfBirth}</p>
                )}
              </div>

              {/* Empty for spacing */}
              <div></div>

              {/* Bio - Full Width */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-2">Bio</label>
                {isEditingPersonal ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-100 border-0 rounded-lg text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                ) : (
                  <p className="text-gray-900 text-sm">{profileData.bio}</p>
                )}
              </div>

              {/* Organization */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Organization</label>
                {isEditingPersonal ? (
                  <input
                    type="text"
                    value={profileData.organization}
                    onChange={(e) => setProfileData({ ...profileData, organization: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-100 border-0 rounded-lg text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 text-sm">{profileData.organization}</p>
                )}
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Website</label>
                {isEditingPersonal ? (
                  <input
                    type="url"
                    value={profileData.website}
                    onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-100 border-0 rounded-lg text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                    {profileData.website}
                  </a>
                )}
              </div>
            </div>

            {/* Save/Cancel Buttons */}
            {isEditingPersonal && (
              <div className="grid grid-cols-2 gap-4 mt-8">
                <button
                  onClick={handleSavePersonal}
                  className="bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditingPersonal(false)}
                  className="border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Account Settings</h3>
            <p className="text-sm text-gray-600">Manage your account preferences</p>
          </div>

          <div className="divide-y divide-gray-200">
            {/* Password */}
            <div className="p-6 flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Password</h4>
                <p className="text-sm text-gray-600">Last changed {passwordData.lastChanged}</p>
              </div>
              <button 
                onClick={handleChangePassword}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                Change Password
              </button>
            </div>

            {/* Email Notifications */}
            <div className="p-6 flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Email Notifications</h4>
                <p className="text-sm text-gray-600">Receive updates about your courses</p>
              </div>
              <button 
                onClick={() => toast.info('Tính năng này sẽ sớm được hỗ trợ')}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                Configure
              </button>
            </div>

            {/* Privacy Settings */}
            <div className="p-6 flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Privacy Settings</h4>
                <p className="text-sm text-gray-600">Control who can see your profile</p>
              </div>
              <button 
                onClick={() => toast.info('Tính năng này sẽ sớm được hỗ trợ')}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                Manage
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-lg border border-red-200">
          <div className="p-6 border-b border-red-200">
            <h3 className="text-lg font-semibold text-red-600 mb-1">Danger Zone</h3>
            <p className="text-sm text-gray-600">Irreversible account actions</p>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Delete Account</h4>
                <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
              </div>
              <button 
                onClick={handleDeleteAccount}
                className="border-2 border-red-500 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
