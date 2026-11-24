import React from 'react';
import { BellRing, AlarmClockOff, Clock } from 'lucide-react';

export default function AlarmRingModal({ activeAlarm, onDismiss, onSnooze }) {
  if (!activeAlarm) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-7 text-center shadow-2xl">
        <div className="w-20 h-20 mx-auto rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center animate-bounce">
          <BellRing className="w-10 h-10" />
        </div>

        <span className="inline-block mt-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
          {activeAlarm.isClassReminder ? 'Dars Eslatmasi' : 'Budilnik Chalinmoqda'}
        </span>

        <h2 className="mt-3 text-4xl font-extrabold tabular-nums text-slate-900 dark:text-white">
          {activeAlarm.time}
        </h2>
        <p className="mt-2 text-base font-semibold text-slate-600 dark:text-slate-300">
          {activeAlarm.label}
        </p>

        <div className="mt-7 grid grid-cols-2 gap-3">
          <button
            onClick={() => onSnooze(activeAlarm)}
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-sm transition cursor-pointer"
          >
            <Clock className="w-4 h-4" /> +5 daqiqa (Snooze)
          </button>
          <button
            onClick={onDismiss}
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 transition cursor-pointer"
          >
            <AlarmClockOff className="w-4 h-4" /> To‘xtatish
          </button>
        </div>
      </div>
    </div>
  );
}
