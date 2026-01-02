'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';

const profileSchema = z.object({
  phone: z.string().optional(),
  nationality: z.string().optional(),
  years_experience: z.number().min(0).optional(),
  education: z.string().optional(),
  teaching_experience: z.string().optional(),
  subject_specialty: z.array(z.string()).optional(),
  preferred_location: z.array(z.string()).optional(),
  preferred_age_group: z.array(z.string()).optional(),
  linkedin: z.string().url().optional().or(z.literal('')),
  instagram: z.string().optional(),
  wechat_id: z.string().optional(),
  professional_experience: z.string().optional(),
  additional_info: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const SUBJECT_OPTIONS = [
  'English',
  'Math',
  'Science',
  'History',
  'Geography',
  'Art',
  'Music',
  'Physical Education',
  'Computer Science',
];

const LOCATION_OPTIONS = [
  'Beijing',
  'Shanghai',
  'Guangzhou',
  'Shenzhen',
  'Chengdu',
  'Hangzhou',
  'Nanjing',
  'Suzhou',
];

const AGE_GROUP_OPTIONS = ['Kindergarten', 'Primary', 'Middle School', 'High School'];

export default function TeacherProfileForm() {
  const { teacher } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      phone: teacher?.phone || '',
      nationality: teacher?.nationality || '',
      years_experience: teacher?.years_experience || 0,
      education: teacher?.education || '',
      teaching_experience: teacher?.teaching_experience || '',
      subject_specialty: teacher?.subject_specialty || [],
      preferred_location: teacher?.preferred_location || [],
      preferred_age_group: teacher?.preferred_age_group || [],
      linkedin: teacher?.linkedin || '',
      instagram: teacher?.instagram || '',
      wechat_id: teacher?.wechat_id || '',
      professional_experience: teacher?.professional_experience || '',
      additional_info: teacher?.additional_info || '',
    },
  });

  const selectedSubjects = watch('subject_specialty') || [];
  const selectedLocations = watch('preferred_location') || [];
  const selectedAgeGroups = watch('preferred_age_group') || [];

  const toggleArrayValue = (field: keyof ProfileFormData, value: string) => {
    const currentValues = watch(field) as string[] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    setValue(field, newValues);
  };

  const onSubmit = async (data: ProfileFormData) => {
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      // TODO: Implement API call
      console.log('Profile update:', data);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Success Message */}
      {success && (
        <div className="rounded-md bg-green-50 p-4">
          <p className="text-sm text-green-800">Profile updated successfully!</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Personal Information */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              {...register('phone')}
              type="tel"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="+1 234 567 8900"
            />
          </div>

          <div>
            <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
              Nationality
            </label>
            <input
              {...register('nationality')}
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="United States"
            />
          </div>
        </div>
      </div>

      {/* Professional Information */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h3>
        <div className="space-y-6">
          <div>
            <label htmlFor="years_experience" className="block text-sm font-medium text-gray-700">
              Years of Teaching Experience
            </label>
            <input
              {...register('years_experience', { valueAsNumber: true })}
              type="number"
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="education" className="block text-sm font-medium text-gray-700">
              Education (Highest Degree)
            </label>
            <input
              {...register('education')}
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Bachelor's in Education, University of..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject Specialties
            </label>
            <div className="flex flex-wrap gap-2">
              {SUBJECT_OPTIONS.map((subject) => (
                <button
                  key={subject}
                  type="button"
                  onClick={() => toggleArrayValue('subject_specialty', subject)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    selectedSubjects.includes(subject)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="teaching_experience" className="block text-sm font-medium text-gray-700">
              Teaching Experience Summary
            </label>
            <textarea
              {...register('teaching_experience')}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Describe your teaching experience..."
            />
          </div>

          <div>
            <label htmlFor="professional_experience" className="block text-sm font-medium text-gray-700">
              Professional Experience
            </label>
            <textarea
              {...register('professional_experience')}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="List your work history..."
            />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Teaching Preferences</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Locations
            </label>
            <div className="flex flex-wrap gap-2">
              {LOCATION_OPTIONS.map((location) => (
                <button
                  key={location}
                  type="button"
                  onClick={() => toggleArrayValue('preferred_location', location)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    selectedLocations.includes(location)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {location}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Age Groups
            </label>
            <div className="flex flex-wrap gap-2">
              {AGE_GROUP_OPTIONS.map((ageGroup) => (
                <button
                  key={ageGroup}
                  type="button"
                  onClick={() => toggleArrayValue('preferred_age_group', ageGroup)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    selectedAgeGroups.includes(ageGroup)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {ageGroup}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Social & Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
              LinkedIn URL
            </label>
            <input
              {...register('linkedin')}
              type="url"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="https://linkedin.com/in/..."
            />
            {errors.linkedin && (
              <p className="mt-1 text-sm text-red-600">{errors.linkedin.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
              Instagram Handle
            </label>
            <input
              {...register('instagram')}
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="@username"
            />
          </div>

          <div>
            <label htmlFor="wechat_id" className="block text-sm font-medium text-gray-700">
              WeChat ID
            </label>
            <input
              {...register('wechat_id')}
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="your_wechat_id"
            />
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
        <textarea
          {...register('additional_info')}
          rows={4}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Any other information you'd like to share..."
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
