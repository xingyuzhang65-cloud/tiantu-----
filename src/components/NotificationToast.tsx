import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'info' | 'warning';
}

interface ToastListProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export default function NotificationToast({ toasts, removeToast }: ToastListProps) {
  return (
    <div className="fixed right-4 top-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} remove={removeToast} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: ToastMessage;
  remove: (id: string) => void;
  key?: string;
}

function ToastItem({ toast, remove }: ToastItemProps) {
  useEffect(() => {
    // Auto remove toast after 4.5s
    const timer = setTimeout(() => {
      remove(toast.id);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast.id, remove]);

  const getToastColors = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: 'bg-emerald-600',
          border: 'border-emerald-500',
          icon: <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-white" />
        };
      case 'warning':
        return {
          bg: 'bg-rose-600',
          border: 'border-rose-500',
          icon: <AlertCircle className="h-4.5 w-4.5 shrink-0 text-white" />
        };
      case 'info':
      default:
        return {
          bg: 'bg-slate-800',
          border: 'border-slate-700',
          icon: <Info className="h-4.5 w-4.5 shrink-0 text-white" />
        };
    }
  };

  const scheme = getToastColors();

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between gap-3 rounded-xl border ${scheme.border} ${scheme.bg} p-3.5 text-white shadow-xl animate-scale-in text-xs`}
    >
      <div className="flex items-center gap-2">
        {scheme.icon}
        <span className="font-sans font-medium tracking-wide whitespace-pre-line leading-relaxed">{toast.text}</span>
      </div>
      <button
        onClick={() => remove(toast.id)}
        className="rounded p-0.5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
