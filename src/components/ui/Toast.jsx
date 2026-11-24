import React from 'react';
import { CheckCircle2, BellRing, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const styles = {
    success: 'bg-emerald-600 text-white',
    alarm: 'bg-indigo-600 text-white',
    info: 'bg-slate-900 dark:bg-slate-800 text-white'
  };

  const Icon = toast.type === 'alarm' ? BellRing : toast.type === 'success' ? CheckCircle2 : Info;

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 max-w-sm w-full animate-bounce">
      <div
        className={`flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl shadow-xl ${
          styles[toast.type] || styles.info
        }`}
      >
        <div className="flex items-center gap-2.5">
          <Icon className="w-5 h-5 shrink-0" />
          <p className="text-sm font-semibold leading-snug">{toast.message}</p>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/20 transition cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
