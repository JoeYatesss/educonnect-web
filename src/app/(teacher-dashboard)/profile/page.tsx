'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import TeacherProfileForm from '@/components/forms/TeacherProfileForm';
import FileUpload from '@/components/forms/FileUpload';
import Link from 'next/link';
import { FileText, Video, Image, ArrowLeft, User, BookOpen, Settings } from 'lucide-react';

export default function ProfilePage() {
  const { teacher, loading: authLoading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !teacher) {
      router.push('/login');
    }
  }, [authLoading, teacher, router]);

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

  if (authLoading || !teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto" />
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <nav className="container mx-auto px-6 h-20 max-w-7xl">
          <div className="flex justify-between items-center h-full">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <span className="text-gray-900 font-montserrat text-2xl font-bold tracking-tight group-hover:text-gray-700 transition-colors">
                EduConnect
              </span>
              <span
                className="text-brand-red font-chinese text-[1.75rem] font-bold group-hover:scale-105 transition-transform duration-200"
                style={{textShadow: '1px 1px 3px rgba(230, 74, 74, 0.3)'}}
              >
                中国
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-brand-red font-medium text-[15px] tracking-tight transition-all duration-200 flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                href="/matches"
                className="text-gray-700 hover:text-brand-red font-medium text-[15px] tracking-tight transition-all duration-200 flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Matches
              </Link>
              <Link
                href="/profile"
                className="text-brand-red font-semibold text-[15px] tracking-tight transition-all duration-200 flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Profile
              </Link>
              <div className="flex items-center gap-3 ml-4 border-l border-gray-200 pl-6">
                <span className="text-sm text-gray-600">
                  {teacher.first_name} {teacher.last_name}
                </span>
                <button
                  onClick={async () => {
                    try {
                      await signOut();
                    } catch (error) {
                      console.error('Sign out error:', error);
                    }
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-all duration-200"
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Page Header */}
      <div className="pt-20 bg-gradient-to-b from-white to-gray-50">
        {/* /* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Edit Your Profile
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Keep your information up-to-date to get better matches with schools in China
            </p>
          </div> */}
        {/* </div>  */}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* File Uploads Section */}
          <div className="bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-brand-red/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-brand-red" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Required Documents</h3>
                <p className="text-sm text-gray-600">Upload your CV, video introduction, and profile photo</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-red to-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
                <div className="relative bg-white rounded-lg p-1">
                  <FileUpload
                    label="CV / Resume"
                    accept=".pdf,.doc,.docx"
                    maxSize={10}
                    currentFile={teacher.cv_path}
                    onUpload={handleCVUpload}
                    fileType="cv"
                  />
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-red to-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
                <div className="relative bg-white rounded-lg p-1">
                  <FileUpload
                    label="Intro Video"
                    accept=".mp4,.mov"
                    maxSize={100}
                    currentFile={teacher.intro_video_path}
                    onUpload={handleVideoUpload}
                    fileType="video"
                  />
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-red to-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
                <div className="relative bg-white rounded-lg p-1">
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
            </div>
          </div>

          {/* Profile Form */}
          <TeacherProfileForm />
        </div>
      </div>
    </div>
  );
}
