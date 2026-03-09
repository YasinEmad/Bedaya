export interface ClinicDefinition {
  id: string;
  name: string;
  doctor: string;
  color: string;
  status: 'active' | 'break';
  patients: number;
  waitTime: string;
  completed: number;
  avgTime: string;
}

const API_BASE_URL = 'http://localhost:5000/api';

export const clinicService = {
  /**
   * Fetch all clinic definitions
   */
  async getAllClinics(): Promise<ClinicDefinition[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/clinics`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch clinics: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error fetching clinics:', error);
      throw error;
    }
  },

  /**
   * Fetch clinic visits by clinic type
   */
  async getClinicVisitsByType(clinicType: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/clinics/type/${clinicType}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch clinic visits: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching clinic visits:', error);
      throw error;
    }
  },

  /**
   * Fetch clinic visits by patient
   */
  async getPatientClinicVisits(patientId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/clinics/patient/${patientId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch patient clinic visits: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching patient clinic visits:', error);
      throw error;
    }
  },

  /**
   * Create a clinic visit
   */
  async createClinicVisit(visitData: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/clinics/visit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(visitData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create clinic visit: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating clinic visit:', error);
      throw error;
    }
  },

  /**
   * Fetch clinic statistics
   */
  async getClinicStatistics() {
    try {
      const response = await fetch(`${API_BASE_URL}/clinics/statistics`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch clinic statistics: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching clinic statistics:', error);
      throw error;
    }
  }
};
