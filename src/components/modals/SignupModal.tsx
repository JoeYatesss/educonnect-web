'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupFormData } from '@/lib/validations';
import { createClient } from '@/lib/supabase/client';
import { apiClient } from '@/lib/api/client';
import { validateFile, getFileExtension, formatFileSize, FILE_CONSTRAINTS } from '@/lib/fileValidation';
import Modal from './Modal';
import MultiSelectChips from '../forms/MultiSelectChips';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

const CHINA_CITIES = [
  'Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu',
  'Hangzhou', 'Chongqing', 'Tianjin', 'Nanjing', 'Wuhan',
  'Xi\'an', 'Suzhou', 'Qingdao', 'Dalian', 'Ningbo'
];

const AGE_GROUPS = [
  { value: 'kindergarten', label: 'Kindergarten (3-6)' },
  { value: 'primary', label: 'Primary School (6-12)' },
  { value: 'middle_school', label: 'Middle School (12-15)' },
  { value: 'high_school', label: 'High School (15-18)' },
  { value: 'university', label: 'University (18+)' }
];

const SUBJECTS = [
  'English', 'Math', 'Science', 'Physics', 'Chemistry', 'Biology',
  'History', 'Geography', 'Art', 'Music', 'PE', 'Computer Science'
];

export default function SignupModal({ isOpen, onClose, onSwitchToLogin }: SignupModalProps) {
  const supabase = createClient();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  // File states
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [headshotFile, setHeadshotFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [fileErrors, setFileErrors] = useState<{ cv?: string; headshot?: string; video?: string }>({});

  // File input refs
  const cvInputRef = useRef<HTMLInputElement>(null);
  const headshotInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      preferredAgeGroup: [],
      cities: [],
      subjects: [],
    },
  });

  const selectedCities = watch('cities') || [];
  const selectedSubjects = watch('subjects') || [];
  const selectedAgeGroups = watch('preferredAgeGroup') || [];

  const handleFileChange = (type: 'cv' | 'headshot' | 'video', file: File | null) => {
    if (!file) return;

    const validation = validateFile(file, type);
    if (!validation.valid) {
      setFileErrors(prev => ({ ...prev, [type]: validation.error }));
      return;
    }

    setFileErrors(prev => ({ ...prev, [type]: undefined }));

    if (type === 'cv') setCvFile(file);
    else if (type === 'headshot') setHeadshotFile(file);
    else setVideoFile(file);
  };

  const onSubmit = async (data: SignupFormData) => {
    setError(null);
    setFileErrors({});

    // Step 1: Validate all files locally FIRST
    const cvValidation = validateFile(cvFile, 'cv');
    const headshotValidation = validateFile(headshotFile, 'headshot');
    const videoValidation = validateFile(videoFile, 'video');

    const newFileErrors: { cv?: string; headshot?: string; video?: string } = {};
    if (!cvValidation.valid) newFileErrors.cv = cvValidation.error;
    if (!headshotValidation.valid) newFileErrors.headshot = headshotValidation.error;
    if (!videoValidation.valid) newFileErrors.video = videoValidation.error;

    if (Object.keys(newFileErrors).length > 0) {
      setFileErrors(newFileErrors);
      setError('Please upload all required files before continuing.');
      return;
    }

    setLoading(true);

    try {
      // Step 2: Create Supabase auth user
      setUploadProgress('Creating your account...');
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('Failed to create user account');

      // Step 3: Create teacher profile + get presigned URLs
      setUploadProgress('Setting up your profile...');
      console.log('[Signup] Creating teacher profile...');
      const signupResponse = await apiClient.createTeacherSignupWithFiles({
        user_id: authData.user.id,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        preferred_locations: data.cities,
        subject_specialties: data.subjects,
        preferred_age_groups: data.preferredAgeGroup,
        cv_extension: getFileExtension(cvFile!),
        headshot_extension: getFileExtension(headshotFile!),
        video_extension: getFileExtension(videoFile!),
      });
      console.log('[Signup] Profile created, got upload URLs:', signupResponse);

      // Step 4: Upload files in parallel using Supabase SDK with signed tokens
      setUploadProgress('Uploading your documents...');
      console.log('[Signup] Starting file uploads...');
      try {
        const uploadPromises = [
          supabase.storage
            .from(signupResponse.cv_bucket)
            .uploadToSignedUrl(signupResponse.cv_path, signupResponse.cv_token, cvFile!)
            .then((result) => {
              if (result.error) throw result.error;
              console.log('[Signup] CV uploaded');
            }),
          supabase.storage
            .from(signupResponse.headshot_bucket)
            .uploadToSignedUrl(signupResponse.headshot_path, signupResponse.headshot_token, headshotFile!)
            .then((result) => {
              if (result.error) throw result.error;
              console.log('[Signup] Headshot uploaded');
            }),
          supabase.storage
            .from(signupResponse.video_bucket)
            .uploadToSignedUrl(signupResponse.video_path, signupResponse.video_token, videoFile!)
            .then((result) => {
              if (result.error) throw result.error;
              console.log('[Signup] Video uploaded');
            }),
        ];
        await Promise.all(uploadPromises);
        console.log('[Signup] All files uploaded successfully');
      } catch (uploadErr: any) {
        console.error('[Signup] File upload failed:', uploadErr);
        throw new Error(`File upload failed: ${uploadErr.message}`);
      }

      // Step 5: Confirm uploads to backend
      setUploadProgress('Finalizing...');
      console.log('[Signup] Confirming uploads...');
      await apiClient.confirmFileUploads({
        user_id: authData.user.id,
        cv_path: signupResponse.cv_path,
        headshot_path: signupResponse.headshot_path,
        video_path: signupResponse.video_path,
      });
      console.log('[Signup] Uploads confirmed');

      setSuccess(true);
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
      setUploadProgress(null);
    }
  };

  const handleClose = () => {
    reset();
    setError(null);
    setSuccess(false);
    setCvFile(null);
    setHeadshotFile(null);
    setVideoFile(null);
    setFileErrors({});
    onClose();
  };

  if (success) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} maxWidth="md">
        <div className="text-center space-y-4">
          <div className="rounded-full bg-green-100 w-16 h-16 flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Check your email!</h3>
          <p className="text-gray-600">
            We've sent you a verification email. Please click the link in the email to verify your account and complete your registration.
          </p>
          <button
            onClick={handleClose}
            className="w-full py-3 px-4 bg-gray-900 text-white font-semibold rounded-md hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth="2xl">
      <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Create your teacher profile
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="font-medium text-brand-red hover:text-red-700"
            >
              Sign in
            </button>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Section 1: Personal Details */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h3>
            <div className="space-y-4">
              {/* Name row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name *
                  </label>
                  <input
                    {...register('firstName')}
                    id="firstName"
                    type="text"
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.firstName ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent`}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name *
                  </label>
                  <input
                    {...register('lastName')}
                    id="lastName"
                    type="text"
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.lastName ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent`}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address *
                </label>
                <input
                  {...register('email')}
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Password row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password *
                  </label>
                  <input
                    {...register('password')}
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent`}
                    placeholder="Min 8 characters"
                  />
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password *
                  </label>
                  <input
                    {...register('confirmPassword')}
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent`}
                    placeholder="Confirm password"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              {/* Headshot Upload (inline with personal details) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Professional Headshot * <span className="text-gray-500 font-normal">(JPG/PNG, max 10MB)</span>
                </label>
                <div className="flex items-center gap-4">
                  <input
                    ref={headshotInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    className="hidden"
                    onChange={(e) => handleFileChange('headshot', e.target.files?.[0] || null)}
                  />
                  {headshotFile ? (
                    <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg flex-1">
                      <svg className="w-8 h-8 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-green-800 truncate">{headshotFile.name}</p>
                        <p className="text-xs text-green-600">{formatFileSize(headshotFile.size)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setHeadshotFile(null);
                          if (headshotInputRef.current) headshotInputRef.current.value = '';
                        }}
                        className="text-green-600 hover:text-green-800"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => headshotInputRef.current?.click()}
                      className={`flex-1 p-4 border-2 border-dashed rounded-lg text-center hover:border-brand-red hover:bg-red-50 transition-colors ${
                        fileErrors.headshot ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-sm text-gray-600">Click to upload headshot</span>
                    </button>
                  )}
                </div>
                {fileErrors.headshot && (
                  <p className="mt-1 text-xs text-red-600">{fileErrors.headshot}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Teaching Preferences */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Teaching Preferences</h3>
            <div className="space-y-5">
              {/* Cities Multi-Select */}
              <MultiSelectChips
                label="Preferred Cities in China"
                options={CHINA_CITIES}
                selected={selectedCities}
                onChange={(selected) => setValue('cities', selected)}
                required
                error={errors.cities?.message}
                columns={3}
              />

              {/* Subjects Multi-Select */}
              <MultiSelectChips
                label="Subject Specialties"
                options={SUBJECTS}
                selected={selectedSubjects}
                onChange={(selected) => setValue('subjects', selected)}
                required
                error={errors.subjects?.message}
                columns={4}
              />

              {/* Age Groups */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Age Groups *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AGE_GROUPS.map(({ value, label }) => {
                    const isSelected = selectedAgeGroups.includes(value);
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          const newSelected = isSelected
                            ? selectedAgeGroups.filter(v => v !== value)
                            : [...selectedAgeGroups, value];
                          setValue('preferredAgeGroup', newSelected);
                        }}
                        className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-brand-red text-white border-brand-red'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                {errors.preferredAgeGroup && (
                  <p className="mt-1 text-xs text-red-600">{errors.preferredAgeGroup.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Documents */}
          <div className="pb-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {/* CV Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CV/Resume * <span className="text-gray-500 font-normal">(PDF/DOC, max 10MB)</span>
                </label>
                <input
                  ref={cvInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => handleFileChange('cv', e.target.files?.[0] || null)}
                />
                {cvFile ? (
                  <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <svg className="w-8 h-8 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-green-800 truncate">{cvFile.name}</p>
                      <p className="text-xs text-green-600">{formatFileSize(cvFile.size)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setCvFile(null);
                        if (cvInputRef.current) cvInputRef.current.value = '';
                      }}
                      className="text-green-600 hover:text-green-800"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => cvInputRef.current?.click()}
                    className={`w-full p-6 border-2 border-dashed rounded-lg text-center hover:border-brand-red hover:bg-red-50 transition-colors ${
                      fileErrors.cv ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm text-gray-600">Click to upload CV</span>
                  </button>
                )}
                {fileErrors.cv && (
                  <p className="mt-1 text-xs text-red-600">{fileErrors.cv}</p>
                )}
              </div>

              {/* Video Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intro Video * <span className="text-gray-500 font-normal">(MP4/MOV, max 100MB)</span>
                </label>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/mp4,video/quicktime"
                  className="hidden"
                  onChange={(e) => handleFileChange('video', e.target.files?.[0] || null)}
                />
                {videoFile ? (
                  <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <svg className="w-8 h-8 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-green-800 truncate">{videoFile.name}</p>
                      <p className="text-xs text-green-600">{formatFileSize(videoFile.size)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setVideoFile(null);
                        if (videoInputRef.current) videoInputRef.current.value = '';
                      }}
                      className="text-green-600 hover:text-green-800"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    className={`w-full p-6 border-2 border-dashed rounded-lg text-center hover:border-brand-red hover:bg-red-50 transition-colors ${
                      fileErrors.video ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-600">Click to upload intro video</span>
                  </button>
                )}
                {fileErrors.video && (
                  <p className="mt-1 text-xs text-red-600">{fileErrors.video}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {uploadProgress || 'Creating account...'}
              </span>
            ) : (
              'Create account'
            )}
          </button>
        </form>
      </div>
    </Modal>
  );
}
