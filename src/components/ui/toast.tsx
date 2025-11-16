import { useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(7);
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }]
    }));
    
    // Auto remove after duration
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      }));
    }, toast.duration || 5000);
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }));
  }
}));

export function useToast() {
  const { addToast } = useToastStore();
  
  return {
    toast: (toast: Omit<Toast, 'id'>) => addToast(toast),
    success: (title: string, description?: string) => 
      addToast({ type: 'success', title, description }),
    error: (title: string, description?: string) => 
      addToast({ type: 'error', title, description }),
    info: (title: string, description?: string) => 
      addToast({ type: 'info', title, description }),
    warning: (title: string, description?: string) => 
      addToast({ type: 'warning', title, description })
  };
}

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle
};

const colorMap = {
  success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
  info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
};

const iconColorMap = {
  success: 'text-green-600 dark:text-green-400',
  error: 'text-red-600 dark:text-red-400',
  info: 'text-blue-600 dark:text-blue-400',
  warning: 'text-yellow-600 dark:text-yellow-400'
};

function ToastItem({ toast }: { toast: Toast }) {
  const { removeToast } = useToastStore();
  const [isExiting, setIsExiting] = useState(false);
  const Icon = iconMap[toast.type];

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => removeToast(toast.id), 300);
  };

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-lg border shadow-lg
        ${colorMap[toast.type]}
        ${isExiting ? 'animate-out slide-out-to-right' : 'animate-in slide-in-from-right'}
        transition-all duration-300
      `}
    >
      <Icon className={`w-5 h-5 mt-0.5 ${iconColorMap[toast.type]}`} />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
          {toast.title}
        </p>
        {toast.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {toast.description}
          </p>
        )}
      </div>
      <button
        onClick={handleClose}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function Toaster() {
  const { toasts } = useToastStore();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}