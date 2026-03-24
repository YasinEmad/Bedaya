const API_BASE_URL = '/api';

export interface PatientStats {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

class PatientService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get count of all adult patients
   */
  async getAdultPatientCount(): Promise<number> {
    try {
      const result = await this.request<any>('/patients/adults?limit=1&page=1');
      return result.pagination?.total || 0;
    } catch (error) {
      console.error('Error fetching adult patients count:', error);
      throw error;
    }
  }

  /**
   * Get count of all pediatric patients
   */
  async getPediatricPatientCount(): Promise<number> {
    try {
      const result = await this.request<any>('/patients/pediatrics?limit=1&page=1');
      return result.pagination?.total || 0;
    } catch (error) {
      console.error('Error fetching pediatric patients count:', error);
      throw error;
    }
  }

  /**
   * Get adult patients with pagination
   */
  async getAdultPatients(page: number = 1, limit: number = 20, search?: string) {
    try {
      let endpoint = `/patients/adults?page=${page}&limit=${limit}`;
      if (search) {
        endpoint += `&search=${encodeURIComponent(search)}`;
      }
      return this.request<any>(endpoint);
    } catch (error) {
      console.error('Error fetching adult patients:', error);
      throw error;
    }
  }

  /**
   * Get pediatric patients with pagination
   */
  async getPediatricPatients(page: number = 1, limit: number = 20, search?: string) {
    try {
      let endpoint = `/patients/pediatrics?page=${page}&limit=${limit}`;
      if (search) {
        endpoint += `&search=${encodeURIComponent(search)}`;
      }
      return this.request<any>(endpoint);
    } catch (error) {
      console.error('Error fetching pediatric patients:', error);
      throw error;
    }
  }
}

export const patientService = new PatientService();
