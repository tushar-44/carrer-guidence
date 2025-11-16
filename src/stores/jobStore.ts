import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  status: 'applied' | 'reviewing' | 'interview' | 'offered' | 'rejected';
  appliedDate: string;
  resumeFile?: string;
  coverLetter?: string;
  notes?: string;
}

interface JobStore {
  applications: JobApplication[];
  addApplication: (application: Omit<JobApplication, 'id' | 'appliedDate'>) => void;
  updateApplicationStatus: (id: string, status: JobApplication['status']) => void;
  getApplicationsByStatus: (status: JobApplication['status']) => JobApplication[];
  getRecentApplications: (limit?: number) => JobApplication[];
}

export const useJobStore = create<JobStore>()(
  persist(
    (set, get) => ({
      applications: [],

      addApplication: (applicationData) => {
        const newApplication: JobApplication = {
          ...applicationData,
          id: `application_${Date.now()}`,
          appliedDate: new Date().toISOString(),
        };

        set((state) => ({
          applications: [...state.applications, newApplication],
        }));
      },

      updateApplicationStatus: (id, status) => {
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === id ? { ...app, status } : app
          ),
        }));
      },

      getApplicationsByStatus: (status) => {
        return get().applications.filter((app) => app.status === status);
      },

      getRecentApplications: (limit = 10) => {
        return get().applications
          .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
          .slice(0, limit);
      },
    }),
    {
      name: 'job-store',
    }
  )
);
