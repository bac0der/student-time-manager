import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  CheckSquare,
  Timer,
  BellRing,
  Flame,
  Sun,
  Moon,
  Download,
  Upload,
  Sparkles,
  GraduationCap
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Boshqaruv Paneli', icon: LayoutDashboard },
  { id: 'schedule', label: 'Dars Jadvali & GPA', icon: CalendarDays },
  { id: 'tasks', label: 'Vazifalar & Matritsa', icon: CheckSquare },
  { id: 'pomodoro', label: 'Fokus & Pomodoro', icon: Timer },
  { id: 'alarms', label: 'Budilnik & Eslatmalar', icon: BellRing },
  { id: 'habits', label: 'Kunlik Reja & Odatlar', icon: Flame }
];

export default function Sidebar({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  pendingTasksCount,
  activeAlarmsCount,
  onExport,
  onImport,
  installPrompt,
  onInstallApp
}) {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 z-30 transition-colors">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3.5 border-b border-slate-100 dark:border-slate-800/80">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
              Talaba Vaqti
            </h1>
            <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
              PWA
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Smart Student Planner</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                {item.label}
              </span>

              {item.id === 'tasks' && pendingTasksCount > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300'
                  }`}
                >
                  {pendingTasksCount}
                </span>
              )}

              {item.id === 'alarms' && activeAlarmsCount > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                  }`}
                >
                  {activeAlarmsCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* PWA Install Banner if available */}
      {installPrompt && (
        <div className="mx-4 mb-3 p-3.5 rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-500 text-white shadow-lg">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-90">
            <Sparkles className="w-3.5 h-3.5" /> Ilova sifatida o‘rnating
          </div>
          <p className="text-xs mt-1 text-indigo-50 leading-relaxed">
            Internet bo‘lmaganda ham tezkor kirish uchun qurilmangizga o‘rnating.
          </p>
          <button
            onClick={onInstallApp}
            className="mt-2.5 w-full py-2 rounded-xl bg-white text-indigo-700 text-xs font-bold hover:bg-indigo-50 transition cursor-pointer"
          >
            O‘rnatish (Install App)
          </button>
        </div>
      )}

      {/* Bottom Controls */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200/70 dark:hover:bg-slate-700 transition cursor-pointer"
        >
          <span className="flex items-center gap-2.5">
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            {darkMode ? 'Kunduzgi rejim' : 'Tungi rejim'}
          </span>
          <span className="text-[10px] uppercase tracking-wider opacity-60">
            {darkMode ? 'Light' : 'Dark'}
          </span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onExport}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Barcha ma'lumotlarni JSON faylga saqlash"
          >
            <Download className="w-3.5 h-3.5" /> Eksport
          </button>
          <label
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
            title="JSON zaxira nusxani tiklash"
          >
            <Upload className="w-3.5 h-3.5" /> Import
            <input type="file" accept=".json" onChange={onImport} className="hidden" />
          </label>
        </div>
      </div>
    </aside>
  );
}
