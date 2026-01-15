import { User } from '@supabase/supabase-js';

export interface Teacher {
  id: number;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  country_code: string | null;
  nationality: string | null;
  years_experience: number | null;
  education: string | null;
  teaching_experience: string | null;
  subject_specialty: string | null;
  preferred_location: string | null;
  preferred_age_group: string | null;
  intro_video_path: string | null;
  headshot_photo_path: string | null;
  cv_path: string | null;
  linkedin: string | null;
  instagram: string | null;
  wechat_id: string | null;
  professional_experience: string | null;
  additional_info: string | null;
  status: ApplicationStatus;
  has_paid: boolean;
  payment_id: string | null;
  payment_date: string | null;
  stripe_customer_id: string | null;
  detected_country: string | null;
  detected_currency: string | null;
  preferred_currency: string | null;
  created_at: string;
  updated_at: string;
  profile_completeness?: number;
}

export interface CurrencyDetection {
  detected_country: string;
  detected_country_name: string;
  detected_currency: string;
  preferred_currency: string | null;
  effective_currency: string;
  price_amount: number;
  price_formatted: string;
  available_currencies: string[];
}

export type ApplicationStatus =
  | 'pending'
  | 'document_verification'
  | 'school_matching'
  | 'interview_scheduled'
  | 'interview_completed'
  | 'offer_extended'
  | 'placed'
  | 'declined';

export interface AdminUser {
  id: string;
  full_name: string | null;
  role: 'admin' | 'master_admin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SchoolAccount {
  id: number;
  user_id: string;
  school_id: number | null;
  school_name: string;
  city: string;
  wechat_id: string | null;
  annual_recruitment_volume: string | null;
  contact_name: string | null;
  contact_email: string;
  contact_phone: string | null;
  has_paid: boolean;
  payment_id: string | null;
  payment_date: string | null;
  stripe_customer_id: string | null;
  detected_country: string | null;
  detected_currency: string | null;
  preferred_currency: string | null;
  status: 'pending' | 'approved' | 'suspended';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type SchoolAccountStatus = 'pending' | 'approved' | 'suspended';

export interface TeacherPreview {
  id: number;
  preferred_location: string | null;
  subject_specialty: string | null;
  preferred_age_group: string | null;
  years_experience: number | null;
  has_headshot: boolean;
  has_cv: boolean;
  has_video: boolean;
}

export interface TeacherFull extends Teacher {
  headshot_url: string | null;
  cv_url: string | null;
  video_url: string | null;
}

export interface SavedTeacher {
  saved_id: number;
  saved_at: string;
  notes: string | null;
  teacher: TeacherFull | TeacherPreview;
}

// Custom error type for auth errors with codes
export interface AuthError extends Error {
  code?: 'EMAIL_NOT_CONFIRMED' | 'ACCOUNT_NOT_FOUND';
  email?: string;
}

export interface AuthContextType {
  user: User | null;
  teacher: Teacher | null;
  adminUser: AdminUser | null;
  schoolAccount: SchoolAccount | null;
  loading: boolean;
  profileLoading: boolean;
  profileError: string | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  resendConfirmation: (email: string) => Promise<void>;
}

// ============================================================================
// SCHOOL JOB TYPES
// ============================================================================

export interface SchoolJob {
  id: number;
  school_account_id: number;
  title: string;
  role_type: string | null;
  location: string | null;
  city: string | null;
  province: string | null;
  school_info: string | null;
  subjects: string[] | null;
  age_groups: string[] | null;
  experience_required: string | null;
  chinese_required: boolean;
  qualification: string | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_display: string | null;
  description: string | null;
  key_responsibilities: string | null;
  requirements: string | null;
  benefits: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SchoolJobWithStats extends SchoolJob {
  match_count: number;
  selection_count: number;
}

export interface SchoolJobCreate {
  title: string;
  role_type?: string;
  location?: string;
  city?: string;
  province?: string;
  school_info?: string;
  subjects?: string[];
  age_groups?: string[];
  experience_required?: string;
  chinese_required?: boolean;
  qualification?: string;
  salary_min?: number;
  salary_max?: number;
  salary_display?: string;
  description?: string;
  key_responsibilities?: string;
  requirements?: string;
  benefits?: string;
  is_active?: boolean;
}

export interface SchoolJobUpdate extends Partial<SchoolJobCreate> {}

// ============================================================================
// SCHOOL JOB MATCH TYPES
// ============================================================================

export interface SchoolJobMatch {
  id: number;
  school_job_id: number;
  teacher_id: number;
  school_account_id: number;
  match_score: number;
  match_reasons: string[] | null;
  matched_at: string;
  teacher?: TeacherFullWithSelection;
}

export interface TeacherFullWithSelection extends TeacherFull {
  is_selected_for_interview?: boolean;
}

// ============================================================================
// INTERVIEW SELECTION TYPES
// ============================================================================

export type InterviewSelectionStatus =
  | 'selected_for_interview'
  | 'interview_scheduled'
  | 'interview_completed'
  | 'offer_extended'
  | 'offer_accepted'
  | 'offer_declined'
  | 'withdrawn';

export interface InterviewSelection {
  id: number;
  school_account_id: number;
  teacher_id: number;
  school_job_id: number | null;
  status: InterviewSelectionStatus;
  notes: string | null;
  selected_at: string;
  status_updated_at: string;
  teacher?: TeacherFull;
  school_job?: SchoolJob;
  school_account?: SchoolAccount;
}

export interface InterviewSelectionWithDetails extends InterviewSelection {
  teacher_name: string | null;
  teacher_email: string | null;
  teacher_headshot_url: string | null;
  job_title: string | null;
  school_name: string | null;
}

export interface InterviewSelectionCreate {
  teacher_id: number;
  school_job_id?: number;
  notes?: string;
}

export interface InterviewSelectionUpdate {
  status?: InterviewSelectionStatus;
  notes?: string;
}

// ============================================================================
// SCHOOL STATS TYPES
// ============================================================================

export interface SchoolJobStats {
  active_jobs: number;
  total_jobs: number;
  max_jobs: number;
  total_matches: number;
  total_selections: number;
  selections_by_status: Record<string, number>;
}

export interface InterviewSelectionStats {
  total_selections: number;
  by_status: Record<string, number>;
}

// ============================================================================
// ADMIN TYPES
// ============================================================================

export interface AdminStats {
  total_teachers: number;
  paid_teachers: number;
  active_applications: number;
  placed_teachers: number;
  total_schools: number;
  total_jobs: number;
  total_school_jobs: number;
  total_interview_selections: number;
  paid_schools: number;
}

export interface AdminInterviewSelection {
  id: number;
  status: InterviewSelectionStatus;
  notes: string | null;
  selected_at: string;
  status_updated_at: string;
  teacher_id: number;
  teacher_name: string;
  teacher_email: string | null;
  teacher_subject: string | null;
  teacher_location: string | null;
  teacher_headshot_url: string | null;
  school_job_id: number | null;
  job_title: string | null;
  job_city: string | null;
  school_account_id: number;
  school_name: string | null;
  school_city: string | null;
  school_email: string | null;
}
