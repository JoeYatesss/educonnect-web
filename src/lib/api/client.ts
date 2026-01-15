import { createClient } from '@/lib/supabase/client';
import type {
  Teacher, AdminUser, SchoolAccount, TeacherPreview, TeacherFull, SavedTeacher,
  SchoolJob, SchoolJobWithStats, SchoolJobCreate, SchoolJobUpdate, SchoolJobMatch,
  InterviewSelection, InterviewSelectionWithDetails, InterviewSelectionCreate,
  InterviewSelectionUpdate, InterviewSelectionStatus, SchoolJobStats, AdminStats,
  AdminInterviewSelection
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ProfileResponse {
  teacher?: Teacher;
  admin?: AdminUser;
  school?: SchoolAccount;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async getAuthToken(): Promise<string | null> {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAuthToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };

    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Request failed' }));
      throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  private async uploadFile(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>
  ): Promise<any> {
    const token = await this.getAuthToken();

    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const headers: HeadersInit = {
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Auth endpoints
  async getCurrentUserProfile() {
    return this.request<ProfileResponse>('/api/v1/auth/me', {
      method: 'GET',
    });
  }

  // Check if an email exists and its confirmation status (no auth required)
  async checkEmailStatus(email: string): Promise<{ exists: boolean; confirmed: boolean | null }> {
    const response = await fetch(`${this.baseUrl}/api/v1/auth/check-email-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Request failed' }));
      throw new Error(error.detail || 'Failed to check email status');
    }

    return response.json();
  }

  // Resend confirmation email for unconfirmed users (no auth required)
  async resendConfirmationEmail(email: string): Promise<{ message: string }> {
    const response = await fetch(`${this.baseUrl}/api/v1/auth/resend-confirmation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Request failed' }));
      throw new Error(error.detail || 'Failed to resend confirmation email');
    }

    return response.json();
  }

  // Signup endpoint (no auth required) - Legacy v1
  async createTeacherSignup(data: {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    preferred_location: string;
    preferred_age_group: string;
    subject_specialty: string;
    linkedin?: string;
  }) {
    // This endpoint doesn't require authentication
    const response = await fetch(`${this.baseUrl}/api/v1/signup/create-teacher-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Request failed' }));
      throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Signup endpoint v2 with presigned URLs (no auth required)
  async createTeacherSignupWithFiles(data: {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    preferred_locations: string[];
    subject_specialties: string[];
    preferred_age_groups: string[];
    cv_extension: string;
    headshot_extension: string;
    video_extension: string;
    linkedin?: string;
  }): Promise<{
    message: string;
    teacher_id: number;
    cv_bucket: string;
    cv_path: string;
    cv_token: string;
    headshot_bucket: string;
    headshot_path: string;
    headshot_token: string;
    video_bucket: string;
    video_path: string;
    video_token: string;
  }> {
    const response = await fetch(`${this.baseUrl}/api/v1/signup/create-teacher-profile-v2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Request failed' }));
      throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Upload file directly to Supabase presigned URL (no auth required)
  // Supabase signed upload URLs expect a PUT request with the file as body
  async uploadToPresignedUrl(url: string, file: File): Promise<void> {
    // Supabase signed URLs include the token in the URL itself
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
        'x-upsert': 'true', // Allow overwriting existing files
      },
      body: file,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('Upload error:', response.status, errorText);
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }
  }

  // Confirm file uploads after successful presigned URL uploads (no auth required)
  async confirmFileUploads(data: {
    user_id: string;
    cv_path: string;
    headshot_path: string;
    video_path: string;
  }): Promise<{ message: string; teacher_id: number }> {
    const response = await fetch(`${this.baseUrl}/api/v1/signup/confirm-file-uploads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Request failed' }));
      throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Teacher endpoints
  async createTeacher(data: {
    first_name: string;
    last_name: string;
    email: string;
    preferred_location: string;
    preferred_age_group: string;
    subject_specialty: string;
    linkedin?: string;
  }) {
    return this.request('/api/v1/teachers/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCurrentTeacher() {
    return this.request('/api/v1/teachers/me', {
      method: 'GET',
    });
  }

  async updateTeacher(data: Partial<{
    phone: string;
    nationality: string;
    years_experience: number;
    education: string;
    teaching_experience: string;
    subject_specialty: string;  // comma-separated
    preferred_location: string;  // comma-separated
    preferred_age_group: string;  // comma-separated
    linkedin: string;
    instagram: string;
    wechat_id: string;
    professional_experience: string;
    additional_info: string;
  }>) {
    return this.request('/api/v1/teachers/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async uploadCV(file: File) {
    return this.uploadFile('/api/v1/teachers/upload-cv', file);
  }

  async uploadHeadshot(file: File) {
    return this.uploadFile('/api/v1/teachers/upload-headshot', file);
  }

  async uploadVideo(file: File) {
    return this.uploadFile('/api/v1/teachers/upload-video', file);
  }

  // Dashboard stats
  async getDashboardStats() {
    return this.request<{
      match_count: number;
      application_count: number;
      profile_completeness: number;
      has_paid: boolean;
    }>('/api/v1/teachers/me/stats', {
      method: 'GET',
    });
  }

  // Get teacher's uploaded files with signed URLs
  async getTeacherFiles() {
    return this.request<{
      cv_url: string | null;
      cv_path: string | null;
      headshot_url: string | null;
      headshot_path: string | null;
      video_url: string | null;
      video_path: string | null;
    }>('/api/v1/teachers/me/files', {
      method: 'GET',
    });
  }

  // Preview matches (for unpaid users)
  async getPreviewMatches() {
    return this.request('/api/v1/matching/preview', {
      method: 'GET',
    });
  }

  // Full matches (for paid users)
  async getMyMatches() {
    return this.request('/api/v1/matching/me', {
      method: 'GET',
    });
  }

  // Apply to a match (for paid users)
  async applyToMatch(matchId: number) {
    return this.request(`/api/v1/applications/apply-to-match?match_id=${matchId}`, {
      method: 'POST',
    });
  }

  // Applications
  async getMyApplications() {
    return this.request('/api/v1/applications/me', {
      method: 'GET',
    });
  }

  // Admin: Get matched teachers for a school
  async getSchoolMatches(schoolId: number) {
    return this.request(`/api/v1/matching/school/${schoolId}`, {
      method: 'GET',
    });
  }

  // Admin: Get school by ID
  async getSchool(schoolId: number) {
    return this.request(`/api/v1/schools/${schoolId}`, {
      method: 'GET',
    });
  }

  // Payment endpoints
  async detectCurrency() {
    return this.request('/api/v1/payments/detect-currency', {
      method: 'GET',
    });
  }

  async createCheckoutSession(data: {
    success_url: string;
    cancel_url: string;
    currency?: string;
  }) {
    return this.request('/api/v1/payments/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verifyPaymentSession(sessionId: string) {
    return this.request('/api/v1/payments/verify-session', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId }),
    });
  }

  // Blog endpoints
  async getPublicBlogPosts() {
    return this.request('/api/v1/blog/public', {
      method: 'GET',
    });
  }

  async getPublicBlogPost(slug: string) {
    return this.request(`/api/v1/blog/public/${slug}`, {
      method: 'GET',
    });
  }

  async createBlogPost(data: {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    featured_image?: string;
    status: 'draft' | 'published';
    category?: string;
  }) {
    return this.request('/api/v1/blog', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBlogPost(postId: number, data: {
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    featured_image?: string;
    status?: 'draft' | 'published';
    category?: string;
  }) {
    return this.request(`/api/v1/blog/${postId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteBlogPost(postId: number) {
    return this.request(`/api/v1/blog/${postId}`, {
      method: 'DELETE',
    });
  }

  // School signup endpoint (no auth required after Supabase signup)
  async createSchoolAccount(data: {
    user_id: string;
    school_name: string;
    city: string;
    contact_name: string;
    contact_email: string;
    contact_phone?: string;
    wechat_id?: string;
    annual_recruitment_volume?: string;
  }) {
    const response = await fetch(`${this.baseUrl}/api/v1/school-signup/create-school-account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Request failed' }));
      throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // School account endpoints
  async getSchoolAccount() {
    return this.request<SchoolAccount>('/api/v1/school-accounts/me', {
      method: 'GET',
    });
  }

  async updateSchoolAccount(data: Partial<{
    school_name: string;
    city: string;
    contact_name: string;
    contact_phone: string;
    wechat_id: string;
    annual_recruitment_volume: string;
    preferred_currency: string;
  }>) {
    return this.request<SchoolAccount>('/api/v1/school-accounts/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async getSchoolStats() {
    return this.request<{
      saved_teachers_count: number;
      has_paid: boolean;
      payment_date: string | null;
    }>('/api/v1/school-accounts/stats', {
      method: 'GET',
    });
  }

  // Teacher browsing (for schools)
  async browseTeachers(params?: {
    search?: string;
    location?: string;
    subject?: string;
    age_group?: string;
    skip?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set('search', params.search);
    if (params?.location) searchParams.set('location', params.location);
    if (params?.subject) searchParams.set('subject', params.subject);
    if (params?.age_group) searchParams.set('age_group', params.age_group);
    if (params?.skip) searchParams.set('skip', params.skip.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());

    const queryString = searchParams.toString();
    const url = `/api/v1/school-accounts/teachers${queryString ? `?${queryString}` : ''}`;

    return this.request<{ teachers: TeacherPreview[]; total: number; has_full_access: boolean }>(url, {
      method: 'GET',
    });
  }

  async getTeacherProfile(teacherId: number) {
    return this.request<TeacherFull>(`/api/v1/school-accounts/teachers/${teacherId}`, {
      method: 'GET',
    });
  }

  // Saved teachers (bookmarks)
  async getSavedTeachers() {
    return this.request<SavedTeacher[]>('/api/v1/school-accounts/saved-teachers', {
      method: 'GET',
    });
  }

  async saveTeacher(teacherId: number, notes?: string) {
    return this.request<{ message: string; saved_id: number }>(`/api/v1/school-accounts/saved-teachers/${teacherId}`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
  }

  async unsaveTeacher(teacherId: number) {
    return this.request<{ message: string }>(`/api/v1/school-accounts/saved-teachers/${teacherId}`, {
      method: 'DELETE',
    });
  }

  // School payments
  async createSchoolCheckoutSession(data: {
    success_url: string;
    cancel_url: string;
    currency?: string;
  }) {
    return this.request<{ checkout_url: string; session_id: string }>('/api/v1/school-payments/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verifySchoolPaymentSession(sessionId: string) {
    return this.request<{ paid: boolean; school_account: SchoolAccount }>('/api/v1/school-payments/verify-session', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId }),
    });
  }

  async requestManualPayment(data: {
    company_name: string;
    billing_address: string;
    additional_notes?: string;
  }) {
    return this.request<{ message: string }>('/api/v1/school-payments/manual-payment-request', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ============================================================================
  // SCHOOL JOBS
  // ============================================================================

  async getSchoolJobs(params?: { is_active?: boolean; limit?: number; offset?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.is_active !== undefined) searchParams.set('is_active', params.is_active.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());

    const queryString = searchParams.toString();
    const url = `/api/v1/school-jobs/${queryString ? `?${queryString}` : ''}`;

    return this.request<SchoolJobWithStats[]>(url, { method: 'GET' });
  }

  async createSchoolJob(data: SchoolJobCreate) {
    return this.request<SchoolJob>('/api/v1/school-jobs/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSchoolJob(jobId: number) {
    return this.request<SchoolJobWithStats>(`/api/v1/school-jobs/${jobId}`, {
      method: 'GET',
    });
  }

  async updateSchoolJob(jobId: number, data: SchoolJobUpdate) {
    return this.request<SchoolJob>(`/api/v1/school-jobs/${jobId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteSchoolJob(jobId: number) {
    return this.request(`/api/v1/school-jobs/${jobId}`, {
      method: 'DELETE',
    });
  }

  async runJobMatching(jobId: number, minScore?: number) {
    const searchParams = new URLSearchParams();
    if (minScore !== undefined) searchParams.set('min_score', minScore.toString());
    const queryString = searchParams.toString();

    return this.request<{ job_id: number; matches_created: number; message: string }>(
      `/api/v1/school-jobs/${jobId}/run-matching${queryString ? `?${queryString}` : ''}`,
      { method: 'POST' }
    );
  }

  async getJobMatches(jobId: number, params?: { min_score?: number; limit?: number; offset?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.min_score !== undefined) searchParams.set('min_score', params.min_score.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());

    const queryString = searchParams.toString();
    return this.request<SchoolJobMatch[]>(
      `/api/v1/school-jobs/${jobId}/matches${queryString ? `?${queryString}` : ''}`,
      { method: 'GET' }
    );
  }

  async getSchoolJobStats() {
    return this.request<SchoolJobStats>('/api/v1/school-jobs/stats/summary', {
      method: 'GET',
    });
  }

  // ============================================================================
  // INTERVIEW SELECTIONS
  // ============================================================================

  async getInterviewSelections(params?: {
    status?: InterviewSelectionStatus;
    school_job_id?: number;
    limit?: number;
    offset?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.school_job_id) searchParams.set('school_job_id', params.school_job_id.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());

    const queryString = searchParams.toString();
    return this.request<InterviewSelectionWithDetails[]>(
      `/api/v1/school-selections/${queryString ? `?${queryString}` : ''}`,
      { method: 'GET' }
    );
  }

  async createInterviewSelection(data: InterviewSelectionCreate) {
    return this.request<InterviewSelection>('/api/v1/school-selections/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getInterviewSelection(selectionId: number) {
    return this.request<InterviewSelectionWithDetails>(`/api/v1/school-selections/${selectionId}`, {
      method: 'GET',
    });
  }

  async updateInterviewSelection(selectionId: number, data: InterviewSelectionUpdate) {
    return this.request<InterviewSelection>(`/api/v1/school-selections/${selectionId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteInterviewSelection(selectionId: number) {
    return this.request(`/api/v1/school-selections/${selectionId}`, {
      method: 'DELETE',
    });
  }

  async bulkSelectTeachers(teacherIds: number[], schoolJobId?: number, notes?: string) {
    const searchParams = new URLSearchParams();
    if (schoolJobId) searchParams.set('school_job_id', schoolJobId.toString());
    if (notes) searchParams.set('notes', notes);
    const queryString = searchParams.toString();

    return this.request<InterviewSelection[]>(
      `/api/v1/school-selections/bulk-select${queryString ? `?${queryString}` : ''}`,
      {
        method: 'POST',
        body: JSON.stringify(teacherIds),
      }
    );
  }

  async getInterviewSelectionStats() {
    return this.request<{ total_selections: number; by_status: Record<string, number> }>(
      '/api/v1/school-selections/stats/summary',
      { method: 'GET' }
    );
  }

  // ============================================================================
  // ADMIN - INTERVIEW SELECTIONS
  // ============================================================================

  async getAdminStats() {
    return this.request<AdminStats>('/api/v1/admin/stats', {
      method: 'GET',
    });
  }

  async getAdminInterviewSelections(params?: {
    status_filter?: string;
    school_account_id?: number;
    limit?: number;
    offset?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.status_filter) searchParams.set('status_filter', params.status_filter);
    if (params?.school_account_id) searchParams.set('school_account_id', params.school_account_id.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());

    const queryString = searchParams.toString();
    return this.request<{ selections: AdminInterviewSelection[]; total: number }>(
      `/api/v1/admin/interview-selections${queryString ? `?${queryString}` : ''}`,
      { method: 'GET' }
    );
  }

  async getAdminRecentInterviewSelections(hours?: number) {
    const searchParams = new URLSearchParams();
    if (hours) searchParams.set('hours', hours.toString());
    const queryString = searchParams.toString();

    return this.request<{ selections: AdminInterviewSelection[]; count: number; since_hours: number }>(
      `/api/v1/admin/interview-selections/recent${queryString ? `?${queryString}` : ''}`,
      { method: 'GET' }
    );
  }

  async getAdminInterviewSelectionStats() {
    return this.request<{
      total_selections: number;
      by_status: Record<string, number>;
      last_7_days: number;
      unique_schools_selecting: number;
    }>('/api/v1/admin/interview-selections/stats', {
      method: 'GET'
    });
  }

  async getAdminSchoolJobs(params?: {
    is_active?: boolean;
    school_account_id?: number;
    limit?: number;
    offset?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.is_active !== undefined) searchParams.set('is_active', params.is_active.toString());
    if (params?.school_account_id) searchParams.set('school_account_id', params.school_account_id.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());

    const queryString = searchParams.toString();
    return this.request<{ jobs: (SchoolJobWithStats & { school_name: string; school_city: string })[]; total: number }>(
      `/api/v1/admin/school-jobs${queryString ? `?${queryString}` : ''}`,
      { method: 'GET' }
    );
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
