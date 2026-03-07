# Redux State Management - Bedaya Healthcare System

This document outlines the Redux state management architecture implemented for the Bedaya healthcare management system.

## Overview

The application uses Redux Toolkit for state management, organized into feature-based slices that correspond to the main domains of the healthcare system.

## Store Structure

```
src/store/
├── index.ts          # Store configuration and exports
├── hooks.ts          # Typed Redux hooks
├── slices/
│   ├── index.ts      # Barrel exports for all slices
│   ├── patientsSlice.ts
│   ├── labsSlice.ts
│   ├── pharmacySlice.ts
│   ├── clinicsSlice.ts
│   └── uiSlice.ts
└── README.md
```

## State Structure

### Root State
```typescript
interface RootState {
  patients: PatientsState;
  labs: LabsState;
  pharmacy: PharmacyState;
  clinics: ClinicsState;
  ui: UiState;
}
```

## Slices

### 1. Patients Slice (`patientsSlice.ts`)

**Purpose**: Manages adult and pediatric patient data, registration, and patient management operations.

**State Structure**:
```typescript
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
```

**Key Actions**:
- `fetchAdultPatients` - Get paginated adult patients with search
- `fetchPediatricPatients` - Get paginated pediatric patients with search
- `createAdultPatient` - Register new adult patient
- `createPediatricPatient` - Register new pediatric patient
- `updateAdultPatient` - Update adult patient information
- `deleteAdultPatient` - Remove adult patient record
- `setSelectedPatient` - Select patient for editing/viewing
- `setFilters` - Apply search and filter criteria

**API Endpoints Mapped**:
- `GET /api/v1/patients/adults` - Fetch adult patients
- `GET /api/v1/patients/pediatrics` - Fetch pediatric patients
- `POST /api/v1/patients/adults` - Create adult patient
- `POST /api/v1/patients/pediatrics` - Create pediatric patient
- `PUT /api/v1/patients/adults/:id` - Update adult patient
- `DELETE /api/v1/patients/adults/:id` - Delete adult patient

### 2. Labs Slice (`labsSlice.ts`)

**Purpose**: Manages laboratory tests, results, and lab operations.

**State Structure**:
```typescript
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
  };
}
```

**Key Actions**:
- `fetchLabTestsByPatient` - Get lab tests for specific patient
- `fetchRecentLabTests` - Get recent lab test results
- `fetchLabStatistics` - Get lab performance statistics
- `createLabTest` - Create new lab test order
- `updateLabTest` - Update lab test results/status
- `deleteLabTest` - Remove lab test record
- `updateTestStatus` - Update test status (in/out/pending/completed)

**API Endpoints Mapped**:
- `GET /api/v1/labs/patient/:patientId` - Get patient lab tests
- `GET /api/v1/labs/recent` - Get recent lab tests
- `GET /api/v1/labs/statistics` - Get lab statistics
- `POST /api/v1/labs/tests` - Create lab test
- `PUT /api/v1/labs/test/:testId` - Update lab test
- `DELETE /api/v1/labs/test/:testId` - Delete lab test

### 3. Pharmacy Slice (`pharmacySlice.ts`)

**Purpose**: Manages medicines, inventory, and dispensing operations.

**State Structure**:
```typescript
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
```

**Key Actions**:
- `fetchMedicines` - Get all medicines inventory
- `fetchLowStockMedicines` - Get medicines with low stock
- `fetchDispensingHistory` - Get medicine dispensing records
- `fetchPharmacyStatistics` - Get pharmacy performance statistics
- `addMedicine` - Add new medicine to inventory
- `updateMedicineStock` - Update medicine stock levels
- `dispenseMedicine` - Record medicine dispensing
- `deleteMedicine` - Remove medicine from inventory

**API Endpoints Mapped**:
- `GET /api/v1/pharmacy/medicines` - Get all medicines
- `GET /api/v1/pharmacy/medicines/low-stock` - Get low stock medicines
- `GET /api/v1/pharmacy/dispensing/history` - Get dispensing history
- `GET /api/v1/pharmacy/statistics` - Get pharmacy statistics
- `POST /api/v1/pharmacy/medicines` - Add medicine
- `PUT /api/v1/pharmacy/medicines/:id/stock` - Update stock
- `POST /api/v1/pharmacy/dispensing` - Dispense medicine
- `DELETE /api/v1/pharmacy/medicines/:id` - Delete medicine

### 4. Clinics Slice (`clinicsSlice.ts`)

**Purpose**: Manages clinic visits, patient referrals, and clinic operations.

**State Structure**:
```typescript
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
    dateRange?: { start: string; end: string };
    status?: ClinicVisit['status'];
  };
}
```

**Key Actions**:
- `fetchPatientClinicVisits` - Get clinic visits for specific patient
- `fetchClinicVisitsByType` - Get visits for specific clinic type
- `fetchClinicStatistics` - Get clinic performance statistics
- `fetchVisitsForDateRange` - Get visits within date range
- `createClinicVisit` - Record new clinic visit
- `updateClinicVisit` - Update clinic visit information
- `deleteClinicVisit` - Remove clinic visit record
- `updateVisitStatus` - Update visit status

**API Endpoints Mapped**:
- `GET /api/v1/clinics/patient/:patientId` - Get patient clinic visits
- `GET /api/v1/clinics/type/:clinicType` - Get visits by clinic type
- `GET /api/v1/clinics/statistics` - Get clinic statistics
- `GET /api/v1/clinics/date-range` - Get visits for date range
- `POST /api/v1/clinics/visit` - Create clinic visit
- `PUT /api/v1/clinics/visit/:visitId` - Update clinic visit
- `DELETE /api/v1/clinics/visit/:visitId` - Delete clinic visit

### 5. UI Slice (`uiSlice.ts`)

**Purpose**: Manages global UI state, notifications, modals, and user interface controls.

**State Structure**:
```typescript
interface UiState {
  sidebarCollapsed: boolean;
  activeModule: string;
  notifications: Notification[];
  modal: ModalState;
  globalLoading: LoadingState;
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'ar';
  breadcrumbs: Array<{ label: string; path?: string }>;
}
```

**Key Actions**:
- `setActiveModule` - Set currently active module/page
- `toggleSidebar` - Toggle sidebar collapse state
- `addNotification` - Show notification to user
- `openModal/closeModal` - Control modal dialogs
- `startGlobalLoading/stopGlobalLoading` - Global loading states
- `setTheme/setLanguage` - UI preferences
- `setBreadcrumbs` - Navigation breadcrumbs

## Usage Examples

### Using Patients Slice
```typescript
import { useAppDispatch, useAppSelector } from '@lib';
import { fetchAdultPatients, createAdultPatient } from '../store/slices/patientsSlice';

function PatientsComponent() {
  const dispatch = useAppDispatch();
  const { adultPatients, loading, error } = useAppSelector(state => state.patients);

  // Fetch patients on component mount
  useEffect(() => {
    dispatch(fetchAdultPatients({ page: 1, limit: 20 }));
  }, [dispatch]);

  // Create new patient
  const handleCreatePatient = (patientData) => {
    dispatch(createAdultPatient(patientData));
  };

  return (
    // Component JSX
  );
}
```

### Using UI Slice for Notifications
```typescript
import { useAppDispatch } from '@lib';
import { addNotification } from '../store/slices/uiSlice';

function SomeComponent() {
  const dispatch = useAppDispatch();

  const handleSuccess = () => {
    dispatch(addNotification({
      type: 'success',
      title: 'Patient Created',
      message: 'Patient has been successfully registered',
      duration: 5000
    }));
  };

  return (
    // Component JSX
  );
}
```

## Async Thunk Patterns

All API calls use Redux Toolkit's `createAsyncThunk` with consistent patterns:

1. **Pending**: Sets loading state, clears errors
2. **Fulfilled**: Updates state with response data, clears loading
3. **Rejected**: Sets error state, clears loading

## Error Handling

Each slice includes error state management:
- API errors are captured in the `error` field
- `clear*Error` actions are provided to reset error states
- Components should display errors and provide retry mechanisms

## Data Flow

1. **User Action** → Component dispatches action
2. **Action** → Async thunk makes API call
3. **API Response** → Reducer updates state
4. **State Update** → Components re-render with new data

## Best Practices

1. **Use Typed Hooks**: Always use `useAppDispatch` and `useAppSelector`
2. **Handle Loading States**: Show loading indicators during API calls
3. **Error Boundaries**: Implement error boundaries for better UX
4. **Optimistic Updates**: Consider optimistic updates for better perceived performance
5. **Data Normalization**: Consider normalizing data for complex relationships
6. **Memoization**: Use `useMemo` and `useCallback` for expensive computations

## Future Enhancements

- **Caching**: Implement React Query or SWR for caching
- **Offline Support**: Add offline capabilities with service workers
- **Real-time Updates**: WebSocket integration for real-time data
- **State Persistence**: Persist critical state to localStorage
- **State History**: Time-travel debugging with Redux DevTools