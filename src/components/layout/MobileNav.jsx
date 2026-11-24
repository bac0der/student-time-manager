import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  CheckSquare,
  Timer,
  BellRing,
  Flame
} from 'lucide-react';

const MOBILE_ITEMS = [
  { id: 'dashboard', label: 'Asosiy', icon: LayoutDashboard },
  { id: 'schedule', label: 'Jadval', icon: CalendarDays },
  { id: 'tasks', label: 'Vazifa', icon: CheckSquare },
  { id: 'pomodoro', label: 'Fokus', icon: Timer },
  { id: 'alarms', label: 'Budilnik', icon: BellRing },
  { id: 'habits', label: 'Odatlar', icon: Flame }
];

export default function MobileNav({ activeTab, setActiveTab }) {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 z-40 px-1 py-1.5">
      <div className="grid grid-cols-6 gap-0.5">
        {MOBILE_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition cursor-pointer ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-500/15'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-semibold mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
