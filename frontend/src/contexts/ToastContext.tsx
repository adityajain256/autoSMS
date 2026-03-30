import { type ReactNode, createContext, useContext, useState } from 'react';
import { cn } from '../utils/cn';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "min-w-[300px] flex items-center justify-between p-4 rounded-xl shadow-ambient border ghost-border bg-surface-lowest animate-in slide-in-from-top-2 fade-in duration-300",
              toast.type === 'error' && "border-error/20",
              toast.type === 'success' && "border-primary/20"
            )}
          >
            <div className="flex items-center gap-3">
              {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-primary" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-error" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-secondary" />}
              <span className="text-sm font-medium text-on-surface">{toast.message}</span>
            </div>
            <button onClick={() => removeToast(toast.id)} className="text-on-surface-variant hover:text-on-surface">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
