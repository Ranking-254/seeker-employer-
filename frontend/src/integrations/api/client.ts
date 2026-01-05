// 1. Ensures /api is appended once and removes trailing slashes
const base = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const API_BASE_URL = base.endsWith('/api') ? base : `${base}/api`;

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    // 2. Clean endpoint to prevent double slashes (//)
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${this.baseURL}${cleanEndpoint}`;
    
    const token = localStorage.getItem('token');

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return response.json();
    } catch (err: any) {
      // 3. User-friendly error if server is unreachable
      if (err.message === 'Failed to fetch') {
        throw new Error('Could not connect to the server. Please ensure the backend is running.');
      }
      throw err;
    }
  }

  // --- Auth & Profile ---
  async register(email: string, password: string, fullName: string, role: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName, role }),
    });
  }

  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async updateProfile(profileData: any) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // --- Job Methods ---
  async getJobs(params: any = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return this.request(`/jobs?${queryParams}`);
  }

  async getJob(id: string) {
    return this.request(`/jobs/${id}`);
  }

  async getEmployerJobs() {
    return this.request('/jobs/employer/my-jobs');
  }

  async createJob(jobData: any) {
    return this.request('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  async employerDeleteApplication(id: string) {
  return this.request(`/applications/employer/${id}`, { 
    method: 'DELETE' 
  });
}

async updateApplicationNote(appId: string, note: string) {
  return this.request(`/applications/${appId}/note`, {
    method: 'PUT',
    body: JSON.stringify({ note }),
  });
}

  async updateJob(id: string, jobData: any) {
    return this.request(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
  }

  async deleteJob(id: string) {
    return this.request(`/jobs/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Application Methods ---
  async getMyApplications() {
    return this.request('/applications/my-applications');
  }

  async applyForJob(jobId: string, applicationData: { coverLetter?: string; cvUrl?: string }) {
    return this.request('/applications', {
      method: 'POST',
      body: JSON.stringify({ jobId, ...applicationData }),
    });
  }

  async getJobApplications(jobId: string) {
    return this.request(`/applications/employer/${jobId}`);
  }

  async updateApplicationStatus(applicationId: string, status: string) {
    return this.request(`/applications/${applicationId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async deleteApplication(id: string) {
    return this.request(`/applications/${id}`, { 
      method: 'DELETE' 
    });
  }

  async updateApplication(id: string, data: { coverLetter: string, cvUrl: string }) {
    return this.request(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getApplication(id: string) {
    return this.request(`/applications/${id}`);
  }

  // --- Saved Jobs ---
  async saveJob(jobId: string) {
    return this.request('/saved-jobs', {
      method: 'POST',
      body: JSON.stringify({ jobId }),
    });
  }

  async getSavedJobs() {
    return this.request('/saved-jobs');
  }

  async removeSavedJob(jobId: string) {
    return this.request(`/saved-jobs/${jobId}`, { method: 'DELETE' });
  }

  async checkSavedJob(jobId: string) {
    return this.request(`/saved-jobs/check/${jobId}`);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);