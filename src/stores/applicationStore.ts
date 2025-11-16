import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ApplicationStatus } from '@/constants/index';

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  status: ApplicationStatus;
  appliedDate: string;
  resumeUrl?: string;
  coverLetter?: string;
  notes?: string;
  lastUpdated: string;
}

interface ApplicationStore {
  applications: Application[];
  addApplication: (application: Omit<Application, 'id' | 'appliedDate' | 'lastUpdated'>) => void;
  updateApplicationStatus: (id: string, status: ApplicationStatus) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  getApplicationById: (id: string) => Application | undefined;
  getApplicationsByStatus: (status: ApplicationStatus) => Application[];
  getAllApplications: () => Application[];
}

export const useApplicationStore = create<ApplicationStore>()(
  persist(
    (set, get) => ({
      applications: [],

      addApplication: (applicationData) => {
        const now = new Date().toISOString();
        const newApplication: Application = {
          ...applicationData,
          id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          appliedDate: now,
          lastUpdated: now
        };

        set((state) => ({
          applications: [...state.applications, newApplication]
        }));
      },

      updateApplicationStatus: (id, status) => {
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === id
              ? { ...app, status, lastUpdated: new Date().toISOString() }
              : app
          )
        }));
      },

      updateApplication: (id, updates) => {
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === id
              ? { ...app, ...updates, lastUpdated: new Date().toISOString() }
              : app
          )
        }));
      },

      getApplicationById: (id) => {
        return get().applications.find((app) => app.id === id);
      },

      getApplicationsByStatus: (status) => {
        return get().applications.filter((app) => app.status === status);
      },

      getAllApplications: () => {
        return get().applications.sort(
          (a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
        );
      }
    }),
    {
      name: 'careerpath-application-store'
    }
  )
);