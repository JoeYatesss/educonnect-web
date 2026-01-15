import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Legacy signup schema (keeping for backwards compatibility)
export const signupSchemaLegacy = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  city: z.string().min(1, 'City is required'),
  preferredAgeGroup: z.array(z.string()).min(1, 'Select at least one age group'),
  subjectSpecialty: z.string().min(1, 'Subject specialty is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// New consolidated signup schema with multi-select arrays
export const signupSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  // Multi-select fields (arrays)
  cities: z.array(z.string()).min(1, 'Select at least one city'),
  subjects: z.array(z.string()).min(1, 'Select at least one subject'),
  preferredAgeGroup: z.array(z.string()).min(1, 'Select at least one age group'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const magicLinkSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// School signup schema
export const schoolSignupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  schoolName: z.string().min(1, 'School name is required').max(255),
  city: z.string().min(1, 'City is required').max(100),
  contactName: z.string().min(1, 'Contact name is required').max(100),
  contactPhone: z.string().optional(),
  wechatId: z.string().optional(),
  annualRecruitmentVolume: z.string().min(1, 'Please select recruitment volume'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type MagicLinkFormData = z.infer<typeof magicLinkSchema>;
export type SchoolSignupFormData = z.infer<typeof schoolSignupSchema>;
