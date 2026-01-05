/**
 * Centralized form options constants
 * Use these across all forms for consistency
 */

// China cities for location selection
export const CHINA_CITIES = [
  'Beijing',
  'Shanghai',
  'Guangzhou',
  'Shenzhen',
  'Chengdu',
  'Hangzhou',
  'Chongqing',
  'Tianjin',
  'Nanjing',
  'Wuhan',
  "Xi'an",
  'Suzhou',
  'Qingdao',
  'Dalian',
  'Ningbo',
] as const;

// Age groups with labels
export const AGE_GROUPS = [
  { value: 'kindergarten', label: 'Kindergarten (3-6)' },
  { value: 'primary', label: 'Primary School (6-12)' },
  { value: 'middle_school', label: 'Middle School (12-15)' },
  { value: 'high_school', label: 'High School (15-18)' },
  { value: 'university', label: 'University (18+)' },
] as const;

// Simple age group labels (for profile form)
export const AGE_GROUP_LABELS = [
  'Kindergarten',
  'Primary',
  'Middle School',
  'High School',
] as const;

// Teaching subjects
export const SUBJECTS = [
  'English',
  'Math',
  'Science',
  'Physics',
  'Chemistry',
  'Biology',
  'History',
  'Geography',
  'Art',
  'Music',
  'Physical Education',
  'Computer Science',
] as const;

// Country codes for phone numbers
export const COUNTRY_CODES = [
  { code: '+1', country: 'US/Canada', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+353', country: 'Ireland', flag: '🇮🇪' },
  { code: '+64', country: 'New Zealand', flag: '🇳🇿' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
] as const;

// Type exports for TypeScript
export type ChinaCity = (typeof CHINA_CITIES)[number];
export type AgeGroup = (typeof AGE_GROUPS)[number];
export type Subject = (typeof SUBJECTS)[number];
export type CountryCode = (typeof COUNTRY_CODES)[number];
