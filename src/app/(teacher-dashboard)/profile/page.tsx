'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import TeacherProfileForm from '@/components/forms/TeacherProfileForm';
import FileUpload from '@/components/forms/FileUpload';
import Link from 'next/link';

export default function ProfilePage() {
  const { teacher, loading: authLoading } = useAuth();
  const router = useRouter();

  const getAuthToken = async () => {
    const { data: { session } } = await (await import('@/lib/supabase/client')).createClient().auth.getSession();
    return session?.access_token || '';
  };

  const handleCVUpload = async (file: File) => {
    const token = await getAuthToken();
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/teachers/upload-cv`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to upload CV');
    }

    // Refresh page to show updated file
    window.location.reload();
  };

  const handleVideoUpload = async (file: File) => {
    const token = await getAuthToken();
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/teachers/upload-video`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to upload video');
    }

    window.location.reload();
  };

  const handlePhotoUpload = async (file: File) => {
    const token = await getAuthToken();
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/teachers/upload-headshot`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to upload headshot');
    }

    window.location.reload();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!teacher) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
              <p className="mt-1 text-sm text-gray-500">
                Update your information and upload documents
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* File Uploads */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Required Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FileUpload
                label="CV / Resume"
                accept=".pdf,.doc,.docx"
                maxSize={10}
                currentFile={teacher.cv_path}
                onUpload={handleCVUpload}
                fileType="cv"
              />

              <FileUpload
                label="Intro Video"
                accept=".mp4,.mov"
                maxSize={100}
                currentFile={teacher.intro_video_path}
                onUpload={handleVideoUpload}
                fileType="video"
              />

              <FileUpload
                label="Headshot Photo"
                accept=".jpg,.jpeg,.png"
                maxSize={10}
                currentFile={teacher.headshot_photo_path}
                onUpload={handlePhotoUpload}
                fileType="photo"
              />
            </div>
          </div>

          {/* Profile Form */}
          <TeacherProfileForm />
        </div>
      </div>
    </div>
  );
}
