import React from 'react';
import { Plus, Sun, Moon, Bell, GraduationCap, Command } from 'lucide-react';
import { formatUzbekDate } from '../../utils/timeUtils';

export default function Header({
  now,
  darkMode,
  setDarkMode,
  onOpenQuickAdd,
  notifPermission,
  onRequestNotif
}) {
  const timeString = now.toLocaleTimeString('uz-UZ', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <header className="sticky top-0 z-20 bg-slate-50/85 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-200/70 dark:border-slate-800/80 px-4 sm:px-8 py-3.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Mobile logo or Date info */}
        <div className="flex items-center gap-3">
          <div className="lg:hidden w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-sky-500 flex items-center justify-center text-white shadow">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              {formatUzbekDate(now)}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight tabular-nums text-slate-900 dark:text-white">
                {timeString}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online / Offline Tayyor
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick actions */}
        <div className="flex items-center gap-2">
          {notifPermission !== 'granted' && (
            <button
              onClick={onRequestNotif}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 text-xs font-semibold hover:bg-amber-100 transition cursor-pointer"
              title="Dars va budilnik bildirishnomalariga ruxsat berish"
            >
              <Bell className="w-3.5 h-3.5" /> Eslatmalarni yoqish
            </button>
          )}

          <button
            onClick={onOpenQuickAdd}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-indigo-500/25 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tezkor qo‘shish</span>
            <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] rounded bg-indigo-500 text-indigo-100 font-mono">
              <Command className="w-2.5 h-2.5" />K
            </kbd>
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="lg:hidden p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200"
            aria-label="Mavzuni o‘zgartirish"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
        </div>
      </div>
    </header>
  );
}
