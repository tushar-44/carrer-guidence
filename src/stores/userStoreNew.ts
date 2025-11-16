import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserType } from '@/constants/index';

interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  avatar?: string;
  createdAt: Date;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    language: string;
  };
}

interface UserStore {
  currentUser: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
  setUserType: (type: UserType) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,

      setUser: (user) => set({
        currentUser: user,
        isAuthenticated: !!user
      }),

      updateUser: (updates) => {
        const currentUser = get().currentUser;
        if (currentUser) {
          set({
            currentUser: { ...currentUser, ...updates }
          });
        }
      },

      logout: () => set({
        currentUser: null,
        isAuthenticated: false
      }),

      setUserType: (type) => {
        const currentUser = get().currentUser;
        if (currentUser) {
          set({
            currentUser: { ...currentUser, type }
          });
        }
      }
    }),
    {
      name: 'careerpath-user-store',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

// Helper functions for user type checks
export const useUserType = () => {
  const { currentUser } = useUserStore();
  return currentUser?.type || null;
};

export const useIsGraduates = () => {
  const userType = useUserType();
  return userType === 'graduates';
};

export const useIsMentor = () => {
  const userType = useUserType();
  return userType === 'mentor';
};

export const useIsCompany = () => {
  const userType = useUserType();
  return userType === 'company';
