import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface Medicine {
  _id: string;
  name: string;
  genericName?: string;
  category: string;
  dosage: string;
  unit: string;
  stock: number;
  minStock: number;
  maxStock: number;
  expiryDate: string;
  batchNumber: string;
  manufacturer?: string;
  price: number;
  requiresPrescription: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DispensingRecord {
  _id: string;
  patientId: string;
  patientName: string;
  medicineId: string;
  medicineName: string;
  quantity: number;
  dosage: string;
  instructions: string;
  dispensedBy: string;
  dispensedAt: string;
  notes?: string;
}

export interface PharmacyStatistics {
  totalMedicines: number;
  lowStockMedicines: number;
  totalDispensing: number;
  monthlyDispensing: Array<{
    month: string;
    count: number;
  }>;
  topMedicines: Array<{
    medicineName: string;
    dispensedCount: number;
  }>;
}

export interface CreateMedicineData {
  name: string;
  genericName?: string;
  category: string;
  dosage: string;
  unit: string;
  stock: number;
  minStock: number;
  maxStock: number;
  expiryDate: string;
  batchNumber: string;
  manufacturer?: string;
  price: number;
  requiresPrescription: boolean;
  description?: string;
}

export interface DispenseMedicineData {
  patientId: string;
  patientName: string;
  medicineId: string;
  quantity: number;
  dosage: string;
  instructions: string;
  notes?: string;
}

interface PharmacyState {
  medicines: Medicine[];
  dispensingHistory: DispensingRecord[];
  selectedMedicine: Medicine | null;
  statistics: PharmacyStatistics | null;
  loading: boolean;
  error: string | null;
  filters: {
    search: string;
    category?: string;
    lowStock?: boolean;
  };
}

// Async thunks
export const fetchMedicines = createAsyncThunk(
  'pharmacy/fetchMedicines',
  async () => {
    const response = await fetch('/api/pharmacy/medicines');
    if (!response.ok) throw new Error('Failed to fetch medicines');
    return response.json();
  }
);

export const fetchLowStockMedicines = createAsyncThunk(
  'pharmacy/fetchLowStockMedicines',
  async () => {
    const response = await fetch('/api/pharmacy/medicines/low-stock');
    if (!response.ok) throw new Error('Failed to fetch low stock medicines');
    return response.json();
  }
);

export const fetchDispensingHistory = createAsyncThunk(
  'pharmacy/fetchDispensingHistory',
  async () => {
    const response = await fetch('/api/pharmacy/dispensing/history');
    if (!response.ok) throw new Error('Failed to fetch dispensing history');
    return response.json();
  }
);

export const fetchPharmacyStatistics = createAsyncThunk(
  'pharmacy/fetchPharmacyStatistics',
  async () => {
    const response = await fetch('/api/pharmacy/statistics');
    if (!response.ok) throw new Error('Failed to fetch pharmacy statistics');
    return response.json();
  }
);

export const addMedicine = createAsyncThunk(
  'pharmacy/addMedicine',
  async (medicineData: CreateMedicineData) => {
    const response = await fetch('/api/pharmacy/medicines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(medicineData),
    });
    if (!response.ok) throw new Error('Failed to add medicine');
    return response.json();
  }
);

export const updateMedicineStock = createAsyncThunk(
  'pharmacy/updateMedicineStock',
  async ({ id, stock }: { id: string; stock: number }) => {
    const response = await fetch(`/api/pharmacy/medicines/${id}/stock`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock }),
    });
    if (!response.ok) throw new Error('Failed to update medicine stock');
    return response.json();
  }
);

export const dispenseMedicine = createAsyncThunk(
  'pharmacy/dispenseMedicine',
  async (dispensingData: DispenseMedicineData) => {
    const response = await fetch('/api/pharmacy/dispensing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dispensingData),
    });
    if (!response.ok) throw new Error('Failed to dispense medicine');
    return response.json();
  }
);

export const deleteMedicine = createAsyncThunk(
  'pharmacy/deleteMedicine',
  async (id: string) => {
    const response = await fetch(`/api/pharmacy/medicines/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete medicine');
    return id;
  }
);

const initialState: PharmacyState = {
  medicines: [],
  dispensingHistory: [],
  selectedMedicine: null,
  statistics: null,
  loading: false,
  error: null,
  filters: {
    search: '',
  },
};

const pharmacySlice = createSlice({
  name: 'pharmacy',
  initialState,
  reducers: {
    setSelectedMedicine: (state, action: PayloadAction<Medicine | null>) => {
      state.selectedMedicine = action.payload;
    },
    setPharmacyFilters: (state, action: PayloadAction<Partial<PharmacyState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearPharmacyError: (state) => {
      state.error = null;
    },
    resetPharmacy: (state) => {
      state.medicines = [];
      state.dispensingHistory = [];
      state.selectedMedicine = null;
      state.statistics = null;
      state.filters = { search: '' };
    },
    updateMedicineStockLocally: (state, action: PayloadAction<{ medicineId: string; newStock: number }>) => {
      const { medicineId, newStock } = action.payload;
      const medicine = state.medicines.find(m => m._id === medicineId);
      if (medicine) {
        medicine.stock = newStock;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch Medicines
    builder
      .addCase(fetchMedicines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedicines.fulfilled, (state, action) => {
        state.loading = false;
        state.medicines = action.payload.data;
      })
      .addCase(fetchMedicines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch medicines';
      })

      // Fetch Low Stock Medicines
      .addCase(fetchLowStockMedicines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLowStockMedicines.fulfilled, (state, action) => {
        state.loading = false;
        // Update low stock status in existing medicines
        const lowStockIds = action.payload.data.map((m: Medicine) => m._id);
        state.medicines.forEach(medicine => {
          medicine.minStock = medicine.minStock; // This would be used for filtering
        });
      })
      .addCase(fetchLowStockMedicines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch low stock medicines';
      })

      // Fetch Dispensing History
      .addCase(fetchDispensingHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDispensingHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.dispensingHistory = action.payload.data;
      })
      .addCase(fetchDispensingHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch dispensing history';
      })

      // Fetch Pharmacy Statistics
      .addCase(fetchPharmacyStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPharmacyStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload.data;
      })
      .addCase(fetchPharmacyStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch pharmacy statistics';
      })

      // Add Medicine
      .addCase(addMedicine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMedicine.fulfilled, (state, action) => {
        state.loading = false;
        state.medicines.unshift(action.payload.data);
      })
      .addCase(addMedicine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add medicine';
      })

      // Update Medicine Stock
      .addCase(updateMedicineStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMedicineStock.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.medicines.findIndex(m => m._id === action.payload.data._id);
        if (index !== -1) {
          state.medicines[index] = action.payload.data;
        }
        if (state.selectedMedicine && state.selectedMedicine._id === action.payload.data._id) {
          state.selectedMedicine = action.payload.data;
        }
      })
      .addCase(updateMedicineStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update medicine stock';
      })

      // Dispense Medicine
      .addCase(dispenseMedicine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(dispenseMedicine.fulfilled, (state, action) => {
        state.loading = false;
        state.dispensingHistory.unshift(action.payload.data);
        // Update medicine stock locally
        const dispensedRecord = action.payload.data;
        const medicine = state.medicines.find(m => m._id === dispensedRecord.medicineId);
        if (medicine) {
          medicine.stock -= dispensedRecord.quantity;
        }
      })
      .addCase(dispenseMedicine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to dispense medicine';
      })

      // Delete Medicine
      .addCase(deleteMedicine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMedicine.fulfilled, (state, action) => {
        state.loading = false;
        state.medicines = state.medicines.filter(m => m._id !== action.payload);
        if (state.selectedMedicine && state.selectedMedicine._id === action.payload) {
          state.selectedMedicine = null;
        }
      })
      .addCase(deleteMedicine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete medicine';
      });
  },
});

export const {
  setSelectedMedicine,
  setPharmacyFilters,
  clearPharmacyError,
  resetPharmacy,
  updateMedicineStockLocally
} = pharmacySlice.actions;
export default pharmacySlice.reducer;