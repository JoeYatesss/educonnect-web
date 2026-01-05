'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api/client';

interface ProfileCompletionWizardProps {
  onComplete: () => void;
}

type WizardStep = 'cv' | 'headshot' | 'video' | 'preferences' | 'complete';

export default function ProfileCompletionWizard({ onComplete }: ProfileCompletionWizardProps) {
  const { teacher } = useAuth();
  const [currentStep, setCurrentStep] = useState<WizardStep>(
    !teacher?.cv_path ? 'cv' :
    !teacher?.headshot_photo_path ? 'headshot' :
    !teacher?.intro_video_path ? 'video' :
    'preferences'
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<{
    cv_url: string | null;
    cv_path: string | null;
    headshot_url: string | null;
    headshot_path: string | null;
    video_url: string | null;
    video_path: string | null;
  }>({
    cv_url: null,
    cv_path: null,
    headshot_url: null,
    headshot_path: null,
    video_url: null,
    video_path: null,
  });

  // Fetch uploaded files on mount
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const fileData = await apiClient.getTeacherFiles();
        setFiles(fileData);
      } catch (err) {
        console.error('Error fetching files:', err);
      }
    };

    if (teacher) {
      fetchFiles();
    }
  }, [teacher]);

  // Preferences state
  const [preferences, setPreferences] = useState({
    preferred_location: teacher?.preferred_location || [],
    preferred_age_group: teacher?.preferred_age_group || [],
    subject_specialty: teacher?.subject_specialty || [],
  });

  const steps = [
    { id: 'cv', label: 'CV Upload', required: true },
    { id: 'headshot', label: 'Headshot', required: true },
    { id: 'video', label: 'Intro Video', required: true },
    { id: 'preferences', label: 'Preferences', required: false },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const validateAndUploadFile = (file: File, type: 'cv' | 'headshot' | 'video') => {
    setError(null);

    // Validate file size before upload
    const maxSizes = {
      cv: 10 * 1024 * 1024, // 10MB
      headshot: 10 * 1024 * 1024, // 10MB
      video: 100 * 1024 * 1024, // 100MB
    };

    const fileType = type === 'cv' ? 'CV' : type === 'headshot' ? 'headshot photo' : 'intro video';
    const maxSize = maxSizes[type];
    const maxSizeMB = maxSize / (1024 * 1024);

    if (file.size > maxSize) {
      setError(`Your ${fileType} is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please choose a file smaller than ${maxSizeMB}MB.`);
      return;
    }

    // Validate file type
    const validTypes = {
      cv: ['.pdf', '.doc', '.docx'],
      headshot: ['.jpg', '.jpeg', '.png'],
      video: ['.mp4', '.mov'],
    };

    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!validTypes[type].includes(fileExtension)) {
      setError(`Invalid file type. Please upload a ${validTypes[type].join(', ')} file.`);
      return;
    }

    handleFileUpload(file, type);
  };

  const handleFileUpload = async (file: File, type: 'cv' | 'headshot' | 'video') => {
    try {
      setUploading(true);
      setError(null);

      let result;
      if (type === 'cv') {
        result = await apiClient.uploadCV(file);
      } else if (type === 'headshot') {
        result = await apiClient.uploadHeadshot(file);
      } else {
        result = await apiClient.uploadVideo(file);
      }

      // Refresh files list to get the new upload
      const fileData = await apiClient.getTeacherFiles();
      setFiles(fileData);

      // Move to next step
      if (type === 'cv') {
        setCurrentStep('headshot');
      } else if (type === 'headshot') {
        setCurrentStep('video');
      } else {
        setCurrentStep('preferences');
      }
    } catch (err: any) {
      console.error('Upload error:', err);

      // User-friendly error messages
      let errorMessage = 'Upload failed. Please try again.';

      if (err.message?.includes('bucket')) {
        errorMessage = 'Storage not configured. Please contact support.';
      } else if (err.message?.includes('size')) {
        errorMessage = 'File is too large. Please choose a smaller file.';
      } else if (err.message?.includes('type') || err.message?.includes('format')) {
        errorMessage = 'Invalid file format. Please check the file type and try again.';
      } else if (err.message?.includes('network') || err.message?.includes('timeout')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handlePreferencesSubmit = async () => {
    try {
      setUploading(true);
      setError(null);

      await apiClient.updateTeacher(preferences);

      setCurrentStep('complete');
      setTimeout(() => onComplete(), 1500);
    } catch (err: any) {
      console.error('Update error:', err);
      setError(err.message || 'Failed to save preferences');
    } finally {
      setUploading(false);
    }
  };

  const handleSkipPreferences = () => {
    setCurrentStep('complete');
    setTimeout(() => onComplete(), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden relative max-h-[90vh] flex flex-col">
        {/* Progress Bar */}
        <div className="bg-gray-200 h-2">
          <div
            className="bg-brand-red h-2 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200">
          <h2 className="text-2xl font-playfair font-bold text-gray-900">Complete Your Profile</h2>
          <p className="text-gray-600 mt-1">
            Step {currentStepIndex + 1} of {steps.length}: {steps[currentStepIndex]?.label}
          </p>
        </div>

        {/* Step Indicators */}
        <div className="px-8 py-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isCompleted =
                (step.id === 'cv' && teacher?.cv_path) ||
                (step.id === 'headshot' && teacher?.headshot_photo_path) ||
                (step.id === 'video' && teacher?.intro_video_path) ||
                (step.id === 'preferences' && index < currentStepIndex);
              const isCurrent = step.id === currentStep;

              return (
                <div key={step.id} className="flex-1 flex items-center">
                  <div className="flex flex-col items-center w-full">
                    {/* Circle */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-green-600 text-white'
                        : isCurrent
                        ? 'bg-brand-red text-white ring-4 ring-red-100'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {isCompleted ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="text-sm font-semibold">{index + 1}</span>
                      )}
                    </div>
                    {/* Label */}
                    <span className={`mt-2 text-xs font-medium text-center ${
                      isCurrent ? 'text-brand-red' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className={`h-0.5 flex-1 transition-all ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-200'
                    }`} style={{ marginBottom: '2rem' }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-8 overflow-y-auto flex-1">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* CV Upload Step */}
          {currentStep === 'cv' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-playfair font-semibold text-gray-900 mb-2">Upload Your CV/Resume</h3>
                <p className="text-gray-600 mb-6">PDF, DOC, or DOCX • Max 10MB</p>
              </div>

              {teacher?.cv_path ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <svg className="w-12 h-12 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-green-800 font-medium mb-2">CV Uploaded Successfully!</p>
                  <p className="text-sm text-green-700 mb-4">
                    File: {files.cv_path || teacher.cv_path}
                  </p>
                  {files.cv_url && (
                    <a
                      href={files.cv_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm text-brand-red hover:text-red-600 font-medium mb-4"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View CV
                    </a>
                  )}
                  <div>
                    <button
                      onClick={() => setCurrentStep('headshot')}
                      className="px-6 py-2 bg-brand-red text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Continue →
                    </button>
                  </div>
                </div>
              ) : (
                <label className="block cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) validateAndUploadFile(file, 'cv');
                    }}
                    disabled={uploading}
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-brand-red hover:bg-red-50 transition-all">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    {uploading ? (
                      <p className="text-gray-700 font-medium">Uploading...</p>
                    ) : (
                      <>
                        <p className="text-gray-700 font-medium mb-1">Click to upload your CV</p>
                        <p className="text-sm text-gray-500">or drag and drop</p>
                      </>
                    )}
                  </div>
                </label>
              )}
            </div>
          )}

          {/* Headshot Upload Step */}
          {currentStep === 'headshot' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-playfair font-semibold text-gray-900 mb-2">Upload Professional Headshot</h3>
                <p className="text-gray-600 mb-6">JPG or PNG • Max 10MB • Professional photo recommended</p>
              </div>

              {teacher?.headshot_photo_path ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <svg className="w-12 h-12 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-green-800 font-medium mb-2">Headshot Uploaded Successfully!</p>
                  <p className="text-sm text-green-700 mb-4">
                    File: {files.headshot_path || teacher.headshot_photo_path}
                  </p>
                  {files.headshot_url && (
                    <a
                      href={files.headshot_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm text-brand-red hover:text-red-600 font-medium mb-4"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Photo
                    </a>
                  )}
                  <div>
                    <button
                      onClick={() => setCurrentStep('video')}
                      className="px-6 py-2 bg-brand-red text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Continue →
                    </button>
                  </div>
                </div>
              ) : (
                <label className="block cursor-pointer">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) validateAndUploadFile(file, 'headshot');
                    }}
                    disabled={uploading}
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-brand-red hover:bg-red-50 transition-all">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {uploading ? (
                      <p className="text-gray-700 font-medium">Uploading...</p>
                    ) : (
                      <>
                        <p className="text-gray-700 font-medium mb-1">Click to upload your headshot</p>
                        <p className="text-sm text-gray-500">or drag and drop</p>
                      </>
                    )}
                  </div>
                </label>
              )}
            </div>
          )}

          {/* Video Upload Step */}
          {currentStep === 'video' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-playfair font-semibold text-gray-900 mb-2">Upload Introduction Video</h3>
                <p className="text-gray-600 mb-6">MP4 or MOV • Max 100MB • 1-2 minutes recommended</p>
              </div>

              {teacher?.intro_video_path ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <svg className="w-12 h-12 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-green-800 font-medium mb-2">Video Uploaded Successfully!</p>
                  <p className="text-sm text-green-700 mb-4">
                    File: {files.video_path || teacher.intro_video_path}
                  </p>
                  {files.video_url && (
                    <a
                      href={files.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm text-brand-red hover:text-red-600 font-medium mb-4"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      View Video
                    </a>
                  )}
                  <div>
                    <button
                      onClick={() => setCurrentStep('preferences')}
                      className="px-6 py-2 bg-brand-red text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Continue →
                    </button>
                  </div>
                </div>
              ) : (
                <label className="block cursor-pointer">
                  <input
                    type="file"
                    accept="video/mp4,video/quicktime"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) validateAndUploadFile(file, 'video');
                    }}
                    disabled={uploading}
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-brand-red hover:bg-red-50 transition-all">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    {uploading ? (
                      <p className="text-gray-700 font-medium">Uploading... This may take a moment</p>
                    ) : (
                      <>
                        <p className="text-gray-700 font-medium mb-1">Click to upload your intro video</p>
                        <p className="text-sm text-gray-500">or drag and drop</p>
                      </>
                    )}
                  </div>
                </label>
              )}
            </div>
          )}

          {/* Preferences Step */}
          {currentStep === 'preferences' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-playfair font-semibold text-gray-900 mb-2">Set Your Preferences (Optional)</h3>
                <p className="text-gray-600">Help us find the perfect match for you</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Locations
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Beijing, Shanghai, Guangzhou"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                    value={Array.isArray(preferences.preferred_location) ? preferences.preferred_location.join(', ') : preferences.preferred_location}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      preferred_location: e.target.value.split(',').map(s => s.trim()) as any
                    })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Age Groups
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Primary, Middle School, High School"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                    value={Array.isArray(preferences.preferred_age_group) ? preferences.preferred_age_group.join(', ') : preferences.preferred_age_group}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      preferred_age_group: e.target.value.split(',').map(s => s.trim()) as any
                    })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject Specialties
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., English, Math, Science"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                    value={Array.isArray(preferences.subject_specialty) ? preferences.subject_specialty.join(', ') : preferences.subject_specialty}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      subject_specialty: e.target.value.split(',').map(s => s.trim()) as any
                    })}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={handleSkipPreferences}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Skip for Now
                </button>
                <button
                  onClick={handlePreferencesSubmit}
                  disabled={uploading}
                  className="flex-1 px-6 py-3 bg-brand-red text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {uploading ? 'Saving...' : 'Save & Continue'}
                </button>
              </div>
            </div>
          )}

          {/* Complete Step */}
          {currentStep === 'complete' && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-playfair font-bold text-gray-900 mb-2">Profile Complete!</h3>
              <p className="text-gray-600">Taking you to your dashboard...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
