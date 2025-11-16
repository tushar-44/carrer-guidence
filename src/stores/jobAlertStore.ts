import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface JobAlert {
  id: string;
  userId: string;
  title: string;
  keywords: string[];
  location: string;
  jobType: string[];
  experienceLevel: string[];
  salaryRange: { min: number; max: number };
  industries: string[];
  isActive: boolean;
  createdAt: string;
  lastNotified: string | null;
  frequency: 'daily' | 'weekly' | 'instant';
}

interface JobAlertStore {
  alerts: JobAlert[];
  createAlert: (alert: Omit<JobAlert, 'id' | 'createdAt' | 'lastNotified'>) => void;
  updateAlert: (id: string, updates: Partial<JobAlert>) => void;
  deleteAlert: (id: string) => void;
  toggleAlert: (id: string) => void;
  getActiveAlerts: () => JobAlert[];
  getAlertsByUser: (userId: string) => JobAlert[];
}

export const useJobAlertStore = create<JobAlertStore>()(
  persist(
    (set, get) => ({
      alerts: [],

      createAlert: (alertData) => {
        const newAlert: JobAlert = {
          ...alertData,
          id: `alert_${Date.now()}`,
          createdAt: new Date().toISOString(),
          lastNotified: null
        };

        set((state) => ({
          alerts: [...state.alerts, newAlert]
        }));
      },

      updateAlert: (id, updates) => {
        set((state) => ({
          alerts: state.alerts.map((alert) =>
            alert.id === id ? { ...alert, ...updates } : alert
          )
        }));
      },

      deleteAlert: (id) => {
        set((state) => ({
          alerts: state.alerts.filter((alert) => alert.id !== id)
        }));
      },

      toggleAlert: (id) => {
        set((state) => ({
          alerts: state.alerts.map((alert) =>
            alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
          )
        }));
      },

      getActiveAlerts: () => {
        return get().alerts.filter((alert) => alert.isActive);
      },

      getAlertsByUser: (userId) => {
        return get().alerts.filter((alert) => alert.userId === userId);
      }
    }),
    {
      name: 'job-alert-store'
    }
  )
);
