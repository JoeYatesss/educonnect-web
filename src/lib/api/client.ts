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
    const token = session?.access_token || null;
    console.log('[API Client] getAuthToken:', {
      hasSession: !!session,
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'null'
    });
    return token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      console.log(`[API Client] request() called for ${endpoint}`);

      const token = await this.getAuthToken();
      console.log(`[API Client] Making request to ${endpoint}`, {
        method: options.method || 'GET',
        hasToken: !!token,
        baseUrl: this.baseUrl,
      });

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      };

      const url = `${this.baseUrl}${endpoint}`;
      console.log(`[API Client] Full URL: ${url}`);

      console.log(`[API Client] About to call fetch...`);
      const response = await fetch(url, {
        ...options,
        headers,
      });
      console.log(`[API Client] Fetch completed`);

      console.log(`[API Client] Response from ${endpoint}:`, {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Request failed' }));
        console.error(`[API Client] Error response:`, error);
        throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`[API Client] Success response from ${endpoint}:`, data);
      return data;
    } catch (error) {
      console.error(`[API Client] request() caught error:`, error);
      throw error;
    }
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
    console.log('[API Client] getCurrentUserProfile called');
    try {
      const result = await this.request('/api/v1/auth/me', {
        method: 'GET',
      });
      console.log('[API Client] getCurrentUserProfile success:', result);
      return result;
    } catch (error) {
      console.error('[API Client] getCurrentUserProfile error:', error);
      throw error;
    }
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
    console.log('[API Client] createTeacherSignup method called (no auth)');
    console.log('[API Client] Data to send:', data);

    try {
      // This endpoint doesn't require authentication
      const response = await fetch(`${this.baseUrl}/api/v1/signup/create-teacher-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('[API Client] Signup response:', {
        status: response.status,
        ok: response.ok,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Request failed' }));
        console.error('[API Client] Signup error response:', error);
        throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('[API Client] Signup success:', result);
      return result;
    } catch (error) {
      console.error('[API Client] createTeacherSignup error:', error);
      throw error;
    }
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
    console.log('[API Client] createTeacher method called');
    console.log('[API Client] Data to send:', data);
    console.log('[API Client] Base URL:', this.baseUrl);

    try {
      const result = await this.request('/api/v1/teachers/', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      console.log('[API Client] createTeacher success:', result);
      return result;
    } catch (error) {
      console.error('[API Client] createTeacher error:', error);
      throw error;
    }
  }

  async getCurrentTeacher() {
    return this.request('/api/v1/teachers/me', {
      method: 'GET',
    });
  }

  async updateTeacher(data: Partial<{
    first_name: string;
    last_name: string;
    preferred_location: string;
    preferred_age_group: string;
    subject_specialty: string;
    linkedin: string;
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
}

export const apiClient = new ApiClient(API_BASE_URL);
