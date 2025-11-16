import { create } from 'zustand';

interface DrawerState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useDrawerStore = create<DrawerState>((set) => ({
  isOpen: false,
  
  open: () => {
    console.log('🎨 Opening global drawer');
    set({ isOpen: true });
  },
  
  close: () => {
    console.log('🎨 Closing global drawer');
    set({ isOpen: false });
  },
}));