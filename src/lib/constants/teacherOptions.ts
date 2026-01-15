/**
 * Shared constants for teacher profile options.
 * These values are used across signup, profile editing, and search/filtering.
 * IMPORTANT: Keep these values consistent - they are stored in the database
 * as comma-separated strings and searched with ILIKE patterns.
 */

// Cities in China - comprehensive list
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

// Subject specialties
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
  'Economics',
  'Business Studies',
  'Psychology',
  'Drama',
  'Chinese',
] as const;

// Age groups with consistent values (stored in DB)
// Using Title Case format that matches how they're displayed
export const AGE_GROUPS = [
  { value: 'Kindergarten', label: 'Kindergarten (3-6)' },
  { value: 'Primary', label: 'Primary School (6-12)' },
  { value: 'Middle School', label: 'Middle School (12-15)' },
  { value: 'High School', label: 'High School (15-18)' },
  { value: 'University', label: 'University (18+)' },
] as const;

// Just the age group values for simple lists
export const AGE_GROUP_VALUES = AGE_GROUPS.map(ag => ag.value);

// Country codes for phone numbers
export const COUNTRY_CODES = [
  { code: '+1', country: 'US/Canada', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+82', country: 'South Korea', flag: '🇰🇷' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+852', country: 'Hong Kong', flag: '🇭🇰' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
] as const;

// Nationalities/Countries
export const COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'New Zealand',
  'Ireland',
  'South Africa',
  'China',
  'Japan',
  'South Korea',
  'Singapore',
  'India',
  'Philippines',
  'Thailand',
  'Vietnam',
  'Malaysia',
  'Indonesia',
  'France',
  'Germany',
  'Spain',
  'Italy',
  'Netherlands',
  'Belgium',
  'Switzerland',
  'Austria',
  'Sweden',
  'Norway',
  'Denmark',
  'Finland',
  'Poland',
  'Russia',
  'Brazil',
  'Mexico',
  'Argentina',
  'Chile',
  'Colombia',
  'UAE',
  'Saudi Arabia',
  'Egypt',
  'Nigeria',
  'Kenya',
  'Other',
] as const;

// Type exports for type-safe usage
export type ChinaCity = typeof CHINA_CITIES[number];
export type Subject = typeof SUBJECTS[number];
export type AgeGroupValue = typeof AGE_GROUP_VALUES[number];
export type CountryCode = typeof COUNTRY_CODES[number];
export type Country = typeof COUNTRIES[number];
