import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface LabTest {
  _id: string;
  patientId: string;
  patientName: string;
  testDate: string;
  testType: 'blood' | 'urine' | 'stool' | 'cr_urea';
  status: 'pending' | 'completed' | 'in' | 'out';
  CBC?: {
    WBCs?: number;
    RBCs?: number;
    hemoglobin?: number;
    hematocrit?: number;
    platelets?: number;
    neutrophils?: number;
    lymphocytes?: number;
    eosinophils?: number;
    monocytes?: number;
    basophils?: number;
  };
  urineAnalysis?: {
    color?: string;
    appearance?: string;
    specificGravity?: number;
    pH?: number;
    protein?: string;
    glucose?: string;
    ketones?: string;
    blood?: string;
    WBC?: number;
    RBC?: number;
  };
  stoolAnalysis?: {
    color?: string;
    consistency?: string;
    mucus?: boolean;
    blood?: boolean;
    parasites?: string;
    occultBlood?: boolean;
  };
  crUrea?: {
    creatinine?: number;
    urea?: number;
    eGFR?: number;
  };
  LFT?: {
    ALT?: number;
    AST?: number;
    ALP?: number;
    totalBilirubin?: number;
    directBilirubin?: number;
    albumin?: number;
  };
  RFT?: {
    urea?: number;
    creatinine?: number;
    eGFR?: number;
  };
  lipidProfile?: {
    totalCholesterol?: number;
    HDL?: number;
    LDL?: number;
    triglycerides?: number;
  };
  otherTests?: {
    ESR?: number;
    CRP?: number;
    RBS?: number;
    HbA1c?: number;
  };
  notes?: string;
  technician?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LabStatistics {
  totalTests: number;
  pendingTests: number;
  completedTests: number;
  testsByType: {
    blood: number;
    urine: number;
    stool: number;
    cr_urea: number;
  };
  recentActivity: Array<{
    date: string;
    count: number;
  }>;
}

export interface CreateLabTestData {
  patientId: string;
  patientName: string;
  testType: 'blood' | 'urine' | 'stool' | 'cr_urea';
  CBC?: LabTest['CBC'];
  urineAnalysis?: LabTest['urineAnalysis'];
  stoolAnalysis?: LabTest['stoolAnalysis'];
  crUrea?: LabTest['crUrea'];
  LFT?: LabTest['LFT'];
  RFT?: LabTest['RFT'];
  lipidProfile?: LabTest['lipidProfile'];
  otherTests?: LabTest['otherTests'];
  notes?: string;
}

interface LabsState {
  labTests: LabTest[];
  recentTests: LabTest[];
  selectedTest: LabTest | null;
  statistics: LabStatistics | null;
  loading: boolean;
  error: string | null;
  filters: {
    patientId?: string;
    testType?: 'blood' | 'urine' | 'stool' | 'cr_urea';
    status?: 'pending' | 'completed' | 'in' | 'out';
    dateRange?: {
      start: string;
      end: string;
    };
  };
}

// Async thunks
export const fetchLabTestsByPatient = createAsyncThunk(
  'labs/fetchLabTestsByPatient',
  async (patientId: string) => {
    const response = await fetch(`/api/v1/labs/patient/${patientId}`);
    if (!response.ok) throw new Error('Failed to fetch lab tests');
    return response.json();
  }
);

export const fetchRecentLabTests = createAsyncThunk(
  'labs/fetchRecentLabTests',
  async () => {
    const response = await fetch('/api/v1/labs/recent');
    if (!response.ok) throw new Error('Failed to fetch recent lab tests');
    return response.json();
  }
);

export const fetchLabStatistics = createAsyncThunk(
  'labs/fetchLabStatistics',
  async () => {
    const response = await fetch('/api/v1/labs/statistics');
    if (!response.ok) throw new Error('Failed to fetch lab statistics');
    return response.json();
  }
);

export const createLabTest = createAsyncThunk(
  'labs/createLabTest',
  async (testData: CreateLabTestData) => {
    const response = await fetch('/api/v1/labs/tests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData),
    });
    if (!response.ok) throw new Error('Failed to create lab test');
    return response.json();
  }
);

export const updateLabTest = createAsyncThunk(
  'labs/updateLabTest',
  async ({ id, testData }: { id: string; testData: Partial<CreateLabTestData> }) => {
    const response = await fetch(`/api/v1/labs/test/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData),
    });
    if (!response.ok) throw new Error('Failed to update lab test');
    return response.json();
  }
);

export const deleteLabTest = createAsyncThunk(
  'labs/deleteLabTest',
  async (id: string) => {
    const response = await fetch(`/api/v1/labs/test/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete lab test');
    return id;
  }
);

const initialState: LabsState = {
  labTests: [],
  recentTests: [],
  selectedTest: null,
  statistics: null,
  loading: false,
  error: null,
  filters: {},
};

const labsSlice = createSlice({
  name: 'labs',
  initialState,
  reducers: {
    setSelectedTest: (state, action: PayloadAction<LabTest | null>) => {
      state.selectedTest = action.payload;
    },
    setLabFilters: (state, action: PayloadAction<Partial<LabsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearLabError: (state) => {
      state.error = null;
    },
    resetLabs: (state) => {
      state.labTests = [];
      state.recentTests = [];
      state.selectedTest = null;
      state.statistics = null;
      state.filters = {};
    },
    updateTestStatus: (state, action: PayloadAction<{ testId: string; status: LabTest['status'] }>) => {
      const { testId, status } = action.payload;
      const test = state.labTests.find(t => t._id === testId);
      if (test) {
        test.status = status;
      }
      const recentTest = state.recentTests.find(t => t._id === testId);
      if (recentTest) {
        recentTest.status = status;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch Lab Tests by Patient
    builder
      .addCase(fetchLabTestsByPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLabTestsByPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.labTests = action.payload.data;
      })
      .addCase(fetchLabTestsByPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch lab tests';
      })

      // Fetch Recent Lab Tests
      .addCase(fetchRecentLabTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentLabTests.fulfilled, (state, action) => {
        state.loading = false;
        state.recentTests = action.payload.data;
      })
      .addCase(fetchRecentLabTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch recent lab tests';
      })

      // Fetch Lab Statistics
      .addCase(fetchLabStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLabStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload.data;
      })
      .addCase(fetchLabStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch lab statistics';
      })

      // Create Lab Test
      .addCase(createLabTest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLabTest.fulfilled, (state, action) => {
        state.loading = false;
        state.labTests.unshift(action.payload.data);
        state.recentTests.unshift(action.payload.data);
        // Keep only recent 50 tests
        state.recentTests = state.recentTests.slice(0, 50);
      })
      .addCase(createLabTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create lab test';
      })

      // Update Lab Test
      .addCase(updateLabTest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLabTest.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.labTests.findIndex(t => t._id === action.payload.data._id);
        if (index !== -1) {
          state.labTests[index] = action.payload.data;
        }
        const recentIndex = state.recentTests.findIndex(t => t._id === action.payload.data._id);
        if (recentIndex !== -1) {
          state.recentTests[recentIndex] = action.payload.data;
        }
        if (state.selectedTest && state.selectedTest._id === action.payload.data._id) {
          state.selectedTest = action.payload.data;
        }
      })
      .addCase(updateLabTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update lab test';
      })

      // Delete Lab Test
      .addCase(deleteLabTest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLabTest.fulfilled, (state, action) => {
        state.loading = false;
        state.labTests = state.labTests.filter(t => t._id !== action.payload);
        state.recentTests = state.recentTests.filter(t => t._id !== action.payload);
        if (state.selectedTest && state.selectedTest._id === action.payload) {
          state.selectedTest = null;
        }
      })
      .addCase(deleteLabTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete lab test';
      });
  },
});

export const {
  setSelectedTest,
  setLabFilters,
  clearLabError,
  resetLabs,
  updateTestStatus
} = labsSlice.actions;
export default labsSlice.reducer;