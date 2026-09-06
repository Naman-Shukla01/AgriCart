import type { FC } from 'react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const NotificationToast: FC<ToastProps> = ({ toast, onClose }) => {
  if (!toast) return null;

  const bgColors = {
    success: 'bg-green-800 text-white border-green-950',
    info: 'bg-slate-900 text-white border-slate-950',
    warning: 'bg-amber-500 text-slate-950 border-amber-600',
  };

  const icons = {
    success: '✅',
    info: 'ℹ️',
    warning: '⚠️',
  };

  return (
    <div className="fixed top-16 left-4 right-4 z-50 max-w-md mx-auto">
      <div
        className={`p-4 rounded-2xl border-2 shadow-2xl flex items-start gap-3.5 ${bgColors[toast.type]}`}
      >
        <div className="text-2xl flex-shrink-0 mt-0.5">{icons[toast.type]}</div>
        <div className="flex-1 pr-1">
          <h4 className="text-base font-black leading-tight tracking-wide">{toast.title}</h4>
          <p className="text-sm font-medium mt-0.5 opacity-95 leading-snug">{toast.message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="h-9 w-9 rounded-xl bg-black/20 hover:bg-black/30 flex items-center justify-center font-bold text-lg leading-none flex-shrink-0"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
