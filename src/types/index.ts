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

export interface AuthContextType {
  user: User | null;
  teacher: Teacher | null;
  adminUser: AdminUser | null;
  loading: boolean;
  profileLoading: boolean;
  profileError: string | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
}
