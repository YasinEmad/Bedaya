import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface AdultPatient {
  _id: string;
  houseNumber: string;
  patientCode: string;
  pov: boolean;
  patientName: string;
  sex: 'male' | 'female';
  age: number;
  occupation?: string;
  mobileNumber?: string;
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  ifMarriedChildren?: number;
  ageOfYoungest?: number;
  educationLevel?: string;
  smoking?: {
    status?: 'yes' | 'no' | 'former';
    rate?: string;
    type?: string;
    durationYears?: number;
    cessationYears?: number;
  };
  menstruation?: {
    regular?: boolean;
    gravidaNumber?: number;
    abortionNumber?: number;
  };
  contraception?: {
    using?: boolean;
    method?: string[];
    other?: string;
  };
  complaints?: string[];
  pastHistory?: {
    diabetes?: boolean;
    hypertension?: boolean;
    HCV?: boolean;
    RHD?: boolean;
    others?: string;
  };
  allergies?: {
    hasAllergy?: boolean;
    details?: string;
  };
  bloodTransfusion?: {
    received?: boolean;
    duration?: string;
  };
  surgery?: {
    ICU?: boolean;
    operation?: boolean;
  };
  chronicMedications?: {
    antiHTN?: boolean;
    oralHypoglycemic?: boolean;
    antiepileptic?: boolean;
    antidiuretic?: boolean;
    others?: string;
  };
  familyHistory?: {
    similar?: boolean;
    hypertension?: boolean;
    diabetes?: boolean;
    others?: string;
  };
  vitals?: {
    BP?: string;
    HR?: number;
    RBS?: number;
    temperature?: number;
    SpO2?: number;
  };
  physicalExam?: {
    cyanosis?: { peripheral?: boolean; central?: boolean };
    jaundice?: boolean;
    pallor?: boolean;
    edema?: { present?: boolean };
    lymphadenopathy?: boolean;
    thyroid?: { normal?: boolean };
    heart?: { normal?: boolean };
    lungs?: { normal?: boolean };
    abdomen?: { normal?: boolean };
    neurological?: { normal?: boolean };
  };
  anthropometry?: {
    weight?: number;
    height?: number;
    BMI?: number;
  };
  diabetesScreening?: 'known' | 'unknown' | 'none';
  referrals?: {
    internalMedicine?: boolean;
    cardiology?: boolean;
    surgery?: boolean;
    ophthalmology?: boolean;
    obstetricGynecology?: boolean;
    ENT?: boolean;
    dermatology?: boolean;
    orthopedics?: boolean;
    dental?: boolean;
    goHome?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PediatricPatient {
  _id: string;
  houseNumber: string;
  patientCode: string;
  pov: boolean;
  patientName: string;
  sex: 'male' | 'female';
  age: number;
  mobileNumber?: string;
  complaints?: string[];
  immunization?: 'upToDate' | 'delayed' | 'none';
  dietaryHistory?: 'breastfeeding' | 'artificial' | 'combined' | 'weaned';
  vitals?: {
    HR?: number;
    RR?: number;
    BP?: string;
    temperature?: number;
    SpO2?: number;
  };
  anthropometry?: {
    weight?: number;
    height?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PatientFormData {
  houseNumber: string;
  patientCode: string;
  pov: boolean;
  patientName: string;
  sex: 'male' | 'female';
  age: number;
  occupation?: string;
  mobileNumber?: string;
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  ifMarriedChildren?: number;
  ageOfYoungest?: number;
  educationLevel?: string;
  smoking?: {
    status?: 'yes' | 'no' | 'former';
    rate?: string;
    type?: string;
    durationYears?: number;
    cessationYears?: number;
  };
  menstruation?: {
    regular?: boolean;
    gravidaNumber?: number;
    abortionNumber?: number;
  };
  contraception?: {
    using?: boolean;
    method?: string[];
    other?: string;
  };
  complaints?: string[];
  pastHistory?: {
    diabetes?: boolean;
    hypertension?: boolean;
    HCV?: boolean;
    RHD?: boolean;
    others?: string;
  };
  allergies?: {
    hasAllergy?: boolean;
    details?: string;
  };
  bloodTransfusion?: {
    received?: boolean;
    duration?: string;
  };
  surgery?: {
    ICU?: boolean;
    operation?: boolean;
  };
  chronicMedications?: {
    antiHTN?: boolean;
    oralHypoglycemic?: boolean;
    antiepileptic?: boolean;
    antidiuretic?: boolean;
    others?: string;
  };
  familyHistory?: {
    similar?: boolean;
    hypertension?: boolean;
    diabetes?: boolean;
    others?: string;
  };
  vitals?: {
    BP?: string;
    HR?: number;
    RBS?: number;
    temperature?: number;
    SpO2?: number;
  };
  physicalExam?: {
    cyanosis?: { peripheral?: boolean; central?: boolean };
    jaundice?: boolean;
    pallor?: boolean;
    edema?: { present?: boolean };
    lymphadenopathy?: boolean;
    thyroid?: { normal?: boolean };
    heart?: { normal?: boolean };
    lungs?: { normal?: boolean };
    abdomen?: { normal?: boolean };
    neurological?: { normal?: boolean };
  };
  anthropometry?: {
    weight?: number;
    height?: number;
    BMI?: number;
  };
  diabetesScreening?: 'known' | 'unknown' | 'none';
  referrals?: {
    internalMedicine?: boolean;
    cardiology?: boolean;
    surgery?: boolean;
    ophthalmology?: boolean;
    obstetricGynecology?: boolean;
    ENT?: boolean;
    dermatology?: boolean;
    orthopedics?: boolean;
    dental?: boolean;
    goHome?: boolean;
  };
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface PatientsState {
  adultPatients: AdultPatient[];
  pediatricPatients: PediatricPatient[];
  selectedPatient: AdultPatient | PediatricPatient | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo;
  filters: {
    search: string;
    type: 'adults' | 'pediatrics' | 'all';
  };
}

// Async thunks for API calls
export const fetchAdultPatients = createAsyncThunk(
  'patients/fetchAdultPatients',
  async ({ page = 1, limit = 20, search = '' }: { page?: number; limit?: number; search?: string }) => {
    const response = await fetch(`/api/patients/adults?page=${page}&limit=${limit}&search=${search}`);
    if (!response.ok) throw new Error('Failed to fetch adult patients');
    const result = await response.json();
    if (!result.success) throw new Error(result.message || 'Failed to fetch adult patients');
    return result;
  }
);

export const fetchPediatricPatients = createAsyncThunk(
  'patients/fetchPediatricPatients',
  async ({ page = 1, limit = 20, search = '' }: { page?: number; limit?: number; search?: string }) => {
    const response = await fetch(`/api/patients/pediatrics?page=${page}&limit=${limit}&search=${search}`);
    if (!response.ok) throw new Error('Failed to fetch pediatric patients');
    const result = await response.json();
    if (!result.success) throw new Error(result.message || 'Failed to fetch pediatric patients');
    return result;
  }
);

export const createAdultPatient = createAsyncThunk(
  'patients/createAdultPatient',
  async (patientData: PatientFormData) => {
    // strip out empty code so server can auto-generate it
    const payload: any = { ...patientData };
    if (!payload.patientCode) {
      delete payload.patientCode;
    }

    const response = await fetch('/api/patients/adults', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    // response.ok will be false for validation/database errors;
    // combine message and details when available so caller can surface them
    if (!response.ok || !result.success) {
      let msg = result.message || 'Failed to create adult patient';
      if (result.details) {
        // server may return an array of validation errors
        if (Array.isArray(result.details)) {
          const detailMsgs = result.details
            .map((d: any) => d.message || JSON.stringify(d))
            .join(', ');
          msg += ': ' + detailMsgs;
        } else {
          msg += ' - ' + JSON.stringify(result.details);
        }
      }
      throw new Error(msg);
    }

    return result.data;
  }
);

export const createPediatricPatient = createAsyncThunk(
  'patients/createPediatricPatient',
  async (patientData: any) => {
    const response = await fetch('/api/patients/pediatrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientData),
    });
    if (!response.ok) throw new Error('Failed to create pediatric patient');
    const result = await response.json();
    if (!result.success) throw new Error(result.message || 'Failed to create pediatric patient');
    return result.data;
  }
);

export const updateAdultPatient = createAsyncThunk(
  'patients/updateAdultPatient',
  async ({ patientCode, patientData }: { patientCode: string; patientData: Partial<PatientFormData> }) => {
    const response = await fetch(`/api/patients/adults/${patientCode}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientData),
    });
    if (!response.ok) throw new Error('Failed to update adult patient');
    const result = await response.json();
    if (!result.success) throw new Error(result.message || 'Failed to update adult patient');
    return result.data;
  }
);

export const updatePediatricPatient = createAsyncThunk(
  'patients/updatePediatricPatient',
  async ({ patientCode, patientData }: { patientCode: string; patientData: any }) => {
    const response = await fetch(`/api/patients/pediatrics/${patientCode}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientData),
    });
    if (!response.ok) throw new Error('Failed to update pediatric patient');
    const result = await response.json();
    if (!result.success) throw new Error(result.message || 'Failed to update pediatric patient');
    return result.data;
  }
);

export const deleteAdultPatient = createAsyncThunk(
  'patients/deleteAdultPatient',
  async (patientCode: string) => {
    const response = await fetch(`/api/patients/adults/${patientCode}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete adult patient');
    const result = await response.json();
    if (!result.success) throw new Error(result.message || 'Failed to delete adult patient');
    return patientCode;
  }
);

const initialState: PatientsState = {
  adultPatients: [],
  pediatricPatients: [],
  selectedPatient: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 20,
    pages: 0,
  },
  filters: {
    search: '',
    type: 'all',
  },
};

const patientsSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    setSelectedPatient: (state, action: PayloadAction<AdultPatient | PediatricPatient | null>) => {
      state.selectedPatient = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<PatientsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    resetPatients: (state) => {
      state.adultPatients = [];
      state.pediatricPatients = [];
      state.selectedPatient = null;
      state.pagination = initialState.pagination;
    },
  },
  extraReducers: (builder) => {
    // Fetch Adult Patients
    builder
      .addCase(fetchAdultPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdultPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.adultPatients = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAdultPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch adult patients';
      })

      // Fetch Pediatric Patients
      .addCase(fetchPediatricPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPediatricPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.pediatricPatients = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPediatricPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch pediatric patients';
      })

      // Create Adult Patient
      .addCase(createAdultPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdultPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.adultPatients.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createAdultPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create adult patient';
      })

      // Create Pediatric Patient
      .addCase(createPediatricPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPediatricPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.pediatricPatients.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createPediatricPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create pediatric patient';
      })

      // Update Adult Patient
      .addCase(updateAdultPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdultPatient.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.adultPatients.findIndex(p => p.patientCode === action.payload.patientCode);
        if (index !== -1) {
          state.adultPatients[index] = action.payload;
        }
        if (state.selectedPatient && state.selectedPatient.patientCode === action.payload.patientCode) {
          state.selectedPatient = action.payload;
        }
      })
      .addCase(updateAdultPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update adult patient';
      })

      // Update Pediatric Patient
      .addCase(updatePediatricPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePediatricPatient.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.pediatricPatients.findIndex(p => p.patientCode === action.payload.patientCode);
        if (index !== -1) {
          state.pediatricPatients[index] = action.payload;
        }
        if (state.selectedPatient && state.selectedPatient.patientCode === action.payload.patientCode) {
          state.selectedPatient = action.payload;
        }
      })
      .addCase(updatePediatricPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update pediatric patient';
      })

      // Delete Adult Patient
      .addCase(deleteAdultPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAdultPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.adultPatients = state.adultPatients.filter(p => p.patientCode !== action.payload);
        state.pagination.total -= 1;
        if (state.selectedPatient && state.selectedPatient.patientCode === action.payload) {
          state.selectedPatient = null;
        }
      })
      .addCase(deleteAdultPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete adult patient';
      });
  },
});

export const { setSelectedPatient, setFilters, clearError, resetPatients } = patientsSlice.actions;
export default patientsSlice.reducer;