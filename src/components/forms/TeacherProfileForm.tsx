'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api/client';
import { useRouter } from 'next/navigation';
import { User, Briefcase, MapPin, Heart, MessageCircle, Save } from 'lucide-react';
import {
  CHINA_CITIES,
  SUBJECTS,
  AGE_GROUPS,
  AGE_GROUP_VALUES,
  COUNTRY_CODES,
  COUNTRIES,
} from '@/lib/constants/teacherOptions';

const profileSchema = z.object({
  phone: z.string().optional(),
  country_code: z.string().optional(),
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

export default function TeacherProfileForm() {
  const { teacher } = useAuth();
  const router = useRouter();
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
      country_code: teacher?.country_code || '+1',
      nationality: teacher?.nationality || '',
      years_experience: teacher?.years_experience || 0,
      education: teacher?.education || '',
      teaching_experience: teacher?.teaching_experience || '',
      // Convert comma-separated strings to arrays
      subject_specialty: teacher?.subject_specialty
        ? teacher.subject_specialty.split(',').map(s => s.trim())
        : [],
      preferred_location: teacher?.preferred_location
        ? teacher.preferred_location.split(',').map(s => s.trim())
        : [],
      preferred_age_group: teacher?.preferred_age_group
        ? teacher.preferred_age_group.split(',').map(s => s.trim())
        : [],
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
      // Transform array fields to comma-separated strings for API
      const apiData = {
        phone: data.phone,
        country_code: data.country_code,
        nationality: data.nationality,
        years_experience: data.years_experience,
        education: data.education,
        teaching_experience: data.teaching_experience,
        subject_specialty: data.subject_specialty?.join(', ') || undefined,
        preferred_location: data.preferred_location?.join(', ') || undefined,
        preferred_age_group: data.preferred_age_group?.join(', ') || undefined,
        linkedin: data.linkedin || undefined,
        instagram: data.instagram,
        wechat_id: data.wechat_id,
        professional_experience: data.professional_experience,
        additional_info: data.additional_info,
      };

      // Call API to update teacher profile
      await apiClient.updateTeacher(apiData);

      setSuccess(true);

      // Reload page after 1.5 seconds to show updated data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      // Enhanced error handling
      if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        setError('Session expired. Please log in again.');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setError(err.message || 'Failed to update profile');
      }
      console.error('Profile update error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Success Message */}
      {success && (
        <div className="rounded-lg bg-green-50 p-4 border border-green-200">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium text-green-800">Profile updated successfully!</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 border border-red-200">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Personal Information */}
      <div className="bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-xl p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-brand-red/10 flex items-center justify-center">
            <User className="w-5 h-5 text-brand-red" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
            <p className="text-sm text-gray-600">Your contact details and nationality</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="mt-1 flex gap-2">
              <select
                {...register('country_code')}
                className="block w-32 rounded-lg border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red focus:ring-2 sm:text-sm"
              >
                {COUNTRY_CODES.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.flag} {item.code}
                  </option>
                ))}
              </select>
              <input
                {...register('phone')}
                type="tel"
                className="block flex-1 rounded-lg border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red focus:ring-2 sm:text-sm"
                placeholder="234 567 8900"
              />
            </div>
          </div>

          <div>
            <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
              Nationality
            </label>
            <select
              {...register('nationality')}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red focus:ring-2 sm:text-sm"
            >
              <option value="">Select a country</option>
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Professional Information */}
      <div className="bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-xl p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-brand-red/10 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-brand-red" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Professional Information</h3>
            <p className="text-sm text-gray-600">Your teaching qualifications and experience</p>
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <label htmlFor="years_experience" className="block text-sm font-medium text-gray-700">
              Years of Teaching Experience
            </label>
            <input
              {...register('years_experience', { valueAsNumber: true })}
              type="number"
              min="0"
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red focus:ring-2 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="education" className="block text-sm font-medium text-gray-700">
              Education (Highest Degree)
            </label>
            <input
              {...register('education')}
              type="text"
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red focus:ring-2 sm:text-sm"
              placeholder="Bachelor's in Education, University of..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject Specialties
            </label>
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map((subject) => (
                <button
                  key={subject}
                  type="button"
                  onClick={() => toggleArrayValue('subject_specialty', subject)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    selectedSubjects.includes(subject)
                      ? 'bg-brand-red text-white shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-brand-red/30 hover:bg-red-50'
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
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red focus:ring-2 sm:text-sm"
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
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red focus:ring-2 sm:text-sm"
              placeholder="List your work history..."
            />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-xl p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-brand-red/10 flex items-center justify-center">
            <Heart className="w-5 h-5 text-brand-red" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Teaching Preferences</h3>
            <p className="text-sm text-gray-600">Your preferred locations and age groups</p>
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Locations
            </label>
            <div className="flex flex-wrap gap-2">
              {CHINA_CITIES.map((location) => (
                <button
                  key={location}
                  type="button"
                  onClick={() => toggleArrayValue('preferred_location', location)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    selectedLocations.includes(location)
                      ? 'bg-brand-red text-white shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-brand-red/30 hover:bg-red-50'
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
              {AGE_GROUP_VALUES.map((ageGroup) => (
                <button
                  key={ageGroup}
                  type="button"
                  onClick={() => toggleArrayValue('preferred_age_group', ageGroup)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    selectedAgeGroups.includes(ageGroup)
                      ? 'bg-brand-red text-white shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-brand-red/30 hover:bg-red-50'
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
      <div className="bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-xl p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-brand-red/10 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-brand-red" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Social & Contact</h3>
            <p className="text-sm text-gray-600">Your social media profiles and contact methods</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
              LinkedIn URL
            </label>
            <input
              {...register('linkedin')}
              type="url"
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red focus:ring-2 sm:text-sm"
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
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red focus:ring-2 sm:text-sm"
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
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red focus:ring-2 sm:text-sm"
              placeholder="your_wechat_id"
            />
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-xl p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-brand-red/10 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-brand-red" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Additional Information</h3>
            <p className="text-sm text-gray-600">Any other details you'd like to share</p>
          </div>
        </div>
        <textarea
          {...register('additional_info')}
          rows={5}
          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red focus:ring-2 sm:text-sm"
          placeholder="Share any additional information about yourself, your teaching philosophy, or special skills..."
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 justify-center py-3 px-8 border border-transparent shadow-lg text-base font-semibold rounded-lg text-white bg-brand-red hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
        >
          <Save className="w-5 h-5" />
          {loading ? 'Saving Changes...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
