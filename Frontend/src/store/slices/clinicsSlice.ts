import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface ClinicVisit {
  _id: string;
  patientId: string;
  patientName: string;
  clinicType: 'internal-medicine' | 'orthopedics' | 'ophthalmology' | 'obstetrics-gynecology' | 'dermatology' | 'dental' | 'cardiology' | 'surgery' | 'ent' | 'pediatrics-clinic';
  visitDate: string;
  diagnosis: string[];
  treatment: string[];
  medications: Array<{
    medicineId: string;
    medicineName: string;
    dosage: string;
    quantity: number;
    instructions: string;
  }>;
  followUpDate?: string;
  notes?: string;
  doctorName: string;
  status: 'completed' | 'follow-up' | 'referred';
  vitals?: {
    BP?: string;
    HR?: number;
    temperature?: number;
    weight?: number;
    height?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ClinicStatistics {
  totalVisits: number;
  visitsByClinic: Record<string, number>;
  monthlyVisits: Array<{
    month: string;
    count: number;
  }>;
  averageWaitTime: number;
  completionRate: number;
  topDiagnoses: Array<{
    diagnosis: string;
    count: number;
  }>;
}

export interface CreateClinicVisitData {
  patientId: string;
  patientName: string;
  clinicType: ClinicVisit['clinicType'];
  diagnosis: string[];
  treatment: string[];
  medications?: ClinicVisit['medications'];
  followUpDate?: string;
  notes?: string;
  doctorName: string;
  status: ClinicVisit['status'];
  vitals?: ClinicVisit['vitals'];
}

interface ClinicsState {
  clinicVisits: ClinicVisit[];
  patientClinicVisits: ClinicVisit[];
  selectedVisit: ClinicVisit | null;
  statistics: ClinicStatistics | null;
  loading: boolean;
  error: string | null;
  filters: {
    patientId?: string;
    clinicType?: ClinicVisit['clinicType'];
    dateRange?: {
      start: string;
      end: string;
    };
    status?: ClinicVisit['status'];
  };
}

// Async thunks
export const fetchPatientClinicVisits = createAsyncThunk(
  'clinics/fetchPatientClinicVisits',
  async (patientId: string) => {
    const response = await fetch(`/api/v1/clinics/patient/${patientId}`);
    if (!response.ok) throw new Error('Failed to fetch patient clinic visits');
    return response.json();
  }
);

export const fetchClinicVisitsByType = createAsyncThunk(
  'clinics/fetchClinicVisitsByType',
  async (clinicType: ClinicVisit['clinicType']) => {
    const response = await fetch(`/api/v1/clinics/type/${clinicType}`);
    if (!response.ok) throw new Error('Failed to fetch clinic visits by type');
    return response.json();
  }
);

export const fetchClinicStatistics = createAsyncThunk(
  'clinics/fetchClinicStatistics',
  async () => {
    const response = await fetch('/api/v1/clinics/statistics');
    if (!response.ok) throw new Error('Failed to fetch clinic statistics');
    return response.json();
  }
);

export const fetchVisitsForDateRange = createAsyncThunk(
  'clinics/fetchVisitsForDateRange',
  async ({ startDate, endDate }: { startDate: string; endDate: string }) => {
    const response = await fetch(`/api/v1/clinics/date-range?start=${startDate}&end=${endDate}`);
    if (!response.ok) throw new Error('Failed to fetch visits for date range');
    return response.json();
  }
);

export const createClinicVisit = createAsyncThunk(
  'clinics/createClinicVisit',
  async (visitData: CreateClinicVisitData) => {
    const response = await fetch('/api/v1/clinics/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(visitData),
    });
    if (!response.ok) throw new Error('Failed to create clinic visit');
    return response.json();
  }
);

export const updateClinicVisit = createAsyncThunk(
  'clinics/updateClinicVisit',
  async ({ id, visitData }: { id: string; visitData: Partial<CreateClinicVisitData> }) => {
    const response = await fetch(`/api/v1/clinics/visit/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(visitData),
    });
    if (!response.ok) throw new Error('Failed to update clinic visit');
    return response.json();
  }
);

export const deleteClinicVisit = createAsyncThunk(
  'clinics/deleteClinicVisit',
  async (id: string) => {
    const response = await fetch(`/api/v1/clinics/visit/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete clinic visit');
    return id;
  }
);

const initialState: ClinicsState = {
  clinicVisits: [],
  patientClinicVisits: [],
  selectedVisit: null,
  statistics: null,
  loading: false,
  error: null,
  filters: {},
};

const clinicsSlice = createSlice({
  name: 'clinics',
  initialState,
  reducers: {
    setSelectedVisit: (state, action: PayloadAction<ClinicVisit | null>) => {
      state.selectedVisit = action.payload;
    },
    setClinicFilters: (state, action: PayloadAction<Partial<ClinicsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearClinicError: (state) => {
      state.error = null;
    },
    resetClinics: (state) => {
      state.clinicVisits = [];
      state.patientClinicVisits = [];
      state.selectedVisit = null;
      state.statistics = null;
      state.filters = {};
    },
    updateVisitStatus: (state, action: PayloadAction<{ visitId: string; status: ClinicVisit['status'] }>) => {
      const { visitId, status } = action.payload;
      const visit = state.clinicVisits.find(v => v._id === visitId);
      if (visit) {
        visit.status = status;
      }
      const patientVisit = state.patientClinicVisits.find(v => v._id === visitId);
      if (patientVisit) {
        patientVisit.status = status;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch Patient Clinic Visits
    builder
      .addCase(fetchPatientClinicVisits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientClinicVisits.fulfilled, (state, action) => {
        state.loading = false;
        state.patientClinicVisits = action.payload.data;
      })
      .addCase(fetchPatientClinicVisits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch patient clinic visits';
      })

      // Fetch Clinic Visits by Type
      .addCase(fetchClinicVisitsByType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClinicVisitsByType.fulfilled, (state, action) => {
        state.loading = false;
        state.clinicVisits = action.payload.data;
      })
      .addCase(fetchClinicVisitsByType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch clinic visits by type';
      })

      // Fetch Clinic Statistics
      .addCase(fetchClinicStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClinicStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload.data;
      })
      .addCase(fetchClinicStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch clinic statistics';
      })

      // Fetch Visits for Date Range
      .addCase(fetchVisitsForDateRange.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVisitsForDateRange.fulfilled, (state, action) => {
        state.loading = false;
        state.clinicVisits = action.payload.data;
      })
      .addCase(fetchVisitsForDateRange.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch visits for date range';
      })

      // Create Clinic Visit
      .addCase(createClinicVisit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClinicVisit.fulfilled, (state, action) => {
        state.loading = false;
        state.clinicVisits.unshift(action.payload.data);
        state.patientClinicVisits.unshift(action.payload.data);
      })
      .addCase(createClinicVisit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create clinic visit';
      })

      // Update Clinic Visit
      .addCase(updateClinicVisit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClinicVisit.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.clinicVisits.findIndex(v => v._id === action.payload.data._id);
        if (index !== -1) {
          state.clinicVisits[index] = action.payload.data;
        }
        const patientIndex = state.patientClinicVisits.findIndex(v => v._id === action.payload.data._id);
        if (patientIndex !== -1) {
          state.patientClinicVisits[patientIndex] = action.payload.data;
        }
        if (state.selectedVisit && state.selectedVisit._id === action.payload.data._id) {
          state.selectedVisit = action.payload.data;
        }
      })
      .addCase(updateClinicVisit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update clinic visit';
      })

      // Delete Clinic Visit
      .addCase(deleteClinicVisit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClinicVisit.fulfilled, (state, action) => {
        state.loading = false;
        state.clinicVisits = state.clinicVisits.filter(v => v._id !== action.payload);
        state.patientClinicVisits = state.patientClinicVisits.filter(v => v._id !== action.payload);
        if (state.selectedVisit && state.selectedVisit._id === action.payload) {
          state.selectedVisit = null;
        }
      })
      .addCase(deleteClinicVisit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete clinic visit';
      });
  },
});

export const {
  setSelectedVisit,
  setClinicFilters,
  clearClinicError,
  resetClinics,
  updateVisitStatus
} = clinicsSlice.actions;
export default clinicsSlice.reducer;