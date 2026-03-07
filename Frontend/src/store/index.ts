import { configureStore } from '@reduxjs/toolkit';
import { patientsSlice, labsSlice, pharmacySlice, clinicsSlice, uiSlice, commonSlice } from './slices';

export const store = configureStore({
  reducer: {
    patients: patientsSlice,
    labs: labsSlice,
    pharmacy: pharmacySlice,
    clinics: clinicsSlice,
    ui: uiSlice,
    common: commonSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;