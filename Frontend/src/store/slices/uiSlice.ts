import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ModalState {
  isOpen: boolean;
  type: string | null;
  data?: any;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

interface UiState {
  sidebarCollapsed: boolean;
  activeModule: string;
  notifications: Notification[];
  modal: ModalState;
  globalLoading: LoadingState;
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'ar';
  breadcrumbs: Array<{
    label: string;
    path?: string;
  }>;
}

// Initial state
const initialState: UiState = {
  sidebarCollapsed: false,
  activeModule: 'dashboard',
  notifications: [],
  modal: {
    isOpen: false,
    type: null,
  },
  globalLoading: {
    isLoading: false,
  },
  theme: 'light',
  language: 'en',
  breadcrumbs: [],
};

// Slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Sidebar
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },

    // Module Navigation
    setActiveModule: (state, action: PayloadAction<string>) => {
      state.activeModule = action.payload;
    },

    // Notifications
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
      const notification: Notification = {
        id: Date.now().toString(),
        duration: 5000,
        ...action.payload,
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },

    // Modal
    openModal: (state, action: PayloadAction<Omit<ModalState, 'isOpen'>>) => {
      state.modal = {
        isOpen: true,
        ...action.payload,
      };
    },
    closeModal: (state) => {
      state.modal = {
        isOpen: false,
        type: null,
      };
    },
    updateModalData: (state, action: PayloadAction<any>) => {
      state.modal.data = action.payload;
    },

    // Global Loading
    setGlobalLoading: (state, action: PayloadAction<LoadingState>) => {
      state.globalLoading = action.payload;
    },
    startGlobalLoading: (state, action: PayloadAction<{ message?: string }>) => {
      state.globalLoading = {
        isLoading: true,
        message: action.payload.message,
      };
    },
    stopGlobalLoading: (state) => {
      state.globalLoading = {
        isLoading: false,
      };
    },
    updateLoadingProgress: (state, action: PayloadAction<number>) => {
      state.globalLoading.progress = action.payload;
    },

    // Theme
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },

    // Language
    setLanguage: (state, action: PayloadAction<'en' | 'ar'>) => {
      state.language = action.payload;
    },

    // Breadcrumbs
    setBreadcrumbs: (state, action: PayloadAction<UiState['breadcrumbs']>) => {
      state.breadcrumbs = action.payload;
    },
    addBreadcrumb: (state, action: PayloadAction<{ label: string; path?: string }>) => {
      state.breadcrumbs.push(action.payload);
    },
    removeBreadcrumb: (state) => {
      state.breadcrumbs.pop();
    },
    clearBreadcrumbs: (state) => {
      state.breadcrumbs = [];
    },

    // Reset UI state
    resetUi: (state) => {
      state.sidebarCollapsed = false;
      state.activeModule = 'dashboard';
      state.notifications = [];
      state.modal = { isOpen: false, type: null };
      state.globalLoading = { isLoading: false };
      state.breadcrumbs = [];
    },
  },
});

// Export actions
export const {
  toggleSidebar,
  setSidebarCollapsed,
  setActiveModule,
  addNotification,
  removeNotification,
  clearAllNotifications,
  openModal,
  closeModal,
  updateModalData,
  setGlobalLoading,
  startGlobalLoading,
  stopGlobalLoading,
  updateLoadingProgress,
  setTheme,
  setLanguage,
  setBreadcrumbs,
  addBreadcrumb,
  removeBreadcrumb,
  clearBreadcrumbs,
  resetUi,
} = uiSlice.actions;

// Export reducer
export default uiSlice.reducer;