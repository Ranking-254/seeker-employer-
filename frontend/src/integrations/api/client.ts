const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
        const url = `${this.baseURL}${endpoint}`;
        const token = localStorage.getItem('token');

        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
            ...options,
        };

        const response = await fetch(url, config);

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Network error' }));
            throw new Error(error.error || `HTTP ${response.status}`);
        }

        return response.json();
    }

    // Auth methods
    async register(email: string, password: string, fullName: string, role: 'job_seeker' | 'employer') {
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
        return this.request('/auth/me');
    }

    // Job methods
    async getJobs(params?: { page?: number; limit?: number; category?: string; location?: string; jobType?: string }) {
        const queryParams = params ? new URLSearchParams(params as any).toString() : '';
        return this.request(`/jobs?${queryParams}`);
    }

    async getJob(id: string) {
        return this.request(`/jobs/${id}`);
    }

    async createJob(jobData: any) {
        return this.request('/jobs', {
            method: 'POST',
            body: JSON.stringify(jobData),
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

    async getEmployerJobs() {
        return this.request('/jobs/employer/my-jobs');
    }

    // Application methods
    async applyForJob(jobId: string, applicationData: { coverLetter?: string; cvUrl?: string }) {
        return this.request('/applications', {
            method: 'POST',
            body: JSON.stringify({ jobId, ...applicationData }),
        });
    }

    async getMyApplications() {
        return this.request('/applications/my-applications');
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

    // Profile methods
    async getMyProfile() {
        return this.request('/profiles/me');
    }

    async updateProfile(profileData: any) {
        return this.request('/profiles/me', {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });
    }

    async getPublicProfile(id: string) {
        return this.request(`/profiles/${id}`);
    }

    async searchJobSeekers(params?: { skills?: string; location?: string; page?: number; limit?: number }) {
        const queryParams = params ? new URLSearchParams(params as any).toString() : '';
        return this.request(`/profiles/job-seekers/search?${queryParams}`);
    }

    async searchEmployers(params?: { industry?: string; location?: string; page?: number; limit?: number }) {
        const queryParams = params ? new URLSearchParams(params as any).toString() : '';
        return this.request(`/profiles/employers/search?${queryParams}`);
    }

    // Saved jobs methods
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
        return this.request(`/saved-jobs/${jobId}`, {
            method: 'DELETE',
        });
    }

    async checkSavedJob(jobId: string) {
        return this.request(`/saved-jobs/check/${jobId}`);
    }
}

export const apiClient = new ApiClient(API_BASE_URL);