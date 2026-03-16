import { LabTest, CreateLabTestData, LabStatistics } from '../store/slices/labsSlice';

const API_BASE_URL = '/api';

class LabService {
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

  async fetchLabTestsByPatient(patientId: string): Promise<{ data: LabTest[] }> {
    return this.request(`/labs/patient/${patientId}`);
  }

  async fetchRecentLabTests(): Promise<{ data: LabTest[] }> {
    return this.request('/labs/recent');
  }

  async fetchLabStatistics(): Promise<{ data: LabStatistics }> {
    return this.request('/labs/statistics');
  }

  async createLabTest(testData: CreateLabTestData): Promise<{ data: LabTest }> {
    return this.request('/labs/tests', {
      method: 'POST',
      body: JSON.stringify(testData),
    });
  }

  async updateLabTest(id: string, testData: Partial<CreateLabTestData>): Promise<{ data: LabTest }> {
    return this.request(`/labs/test/${id}`, {
      method: 'PUT',
      body: JSON.stringify(testData),
    });
  }

  async deleteLabTest(id: string): Promise<void> {
    await this.request(`/labs/test/${id}`, {
      method: 'DELETE',
    });
  }

  async fetchLabTestById(testId: string): Promise<{ data: LabTest }> {
    return this.request(`/labs/test/${testId}`);
  }

  // Fetch blood tests specifically
  async fetchBloodLabTests(): Promise<{ data: LabTest[] }> {
    return this.request('/labs/recent?type=blood');
  }
}

export const labService = new LabService();