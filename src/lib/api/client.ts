import { createClient } from '@/lib/supabase/client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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
    return this.request('/api/v1/auth/me', {
      method: 'GET',
    });
  }

  // Signup endpoint (no auth required)
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
    return this.request('/api/v1/teachers/me/stats', {
      method: 'GET',
    });
  }

  // Get teacher's uploaded files with signed URLs
  async getTeacherFiles() {
    return this.request('/api/v1/teachers/me/files', {
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
}

export const apiClient = new ApiClient(API_BASE_URL);
