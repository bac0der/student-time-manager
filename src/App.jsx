import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import {
  INITIAL_CLASSES,
  INITIAL_TASKS,
  INITIAL_TOP_GOALS,
  INITIAL_ALARMS,
  INITIAL_HABITS,
  INITIAL_TIME_BLOCKS
} from './data/initialData';
import { soundEngine } from './utils/soundEngine';
import { timeToMinutes } from './utils/timeUtils';

import Sidebar from './components/layout/Sidebar';
import MobileNav from './components/layout/MobileNav';
import Header from './components/layout/Header';
import Toast from './components/ui/Toast';
import AlarmRingModal from './components/modals/AlarmRingModal';
import QuickAddModal from './components/modals/QuickAddModal';

import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import Tasks from './pages/Tasks';
import Pomodoro from './pages/Pomodoro';
import Alarms from './pages/Alarms';
import Habits from './pages/Habits';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useLocalStorage('tv_dark_mode', false);
  const [now, setNow] = useState(new Date());

  // Persistent Student Data
  const [classes, setClasses] = useLocalStorage('tv_classes', INITIAL_CLASSES);
  const [tasks, setTasks] = useLocalStorage('tv_tasks', INITIAL_TASKS);
  const [topGoals, setTopGoals] = useLocalStorage('tv_top_goals', INITIAL_TOP_GOALS);
  const [alarms, setAlarms] = useLocalStorage('tv_alarms', INITIAL_ALARMS);
  const [habits, setHabits] = useLocalStorage('tv_habits', INITIAL_HABITS);
  const [timeBlocks, setTimeBlocks] = useLocalStorage('tv_time_blocks', INITIAL_TIME_BLOCKS);
  const [reflection, setReflection] = useLocalStorage('tv_reflection', '');
  const [focusMinutesToday, setFocusMinutesToday] = useLocalStorage('tv_focus_today', 50);
  const [focusHistory, setFocusHistory] = useLocalStorage('tv_focus_history', {
    'Amaliy Matematika': 50,
    'Algoritmlar va Ma’lumotlar Tuzilmasi': 25
  });
  const [classReminderEnabled, setClassReminderEnabled] = useLocalStorage('tv_class_rem', true);

  // UI & Notification States
  const [toast, setToast] = useState(null);
  const [ringingAlarm, setRingingAlarm] = useState(null);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [notifPermission, setNotifPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  const triggeredKeysRef = useRef(new Set());

  const notify = useCallback((message, type = 'info') => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  // Apply Dark Mode class
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [darkMode]);

  // PWA beforeinstallprompt listener
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K for Quick Add
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setQuickAddOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const requestNotifPermission = async () => {
    if (typeof Notification === 'undefined') {
      notify('Brauzeringiz push bildirishnomalarni qo‘llab-quvvatlamaydi', 'info');
      return;
    }
    const res = await Notification.requestPermission();
    setNotifPermission(res);
    if (res === 'granted') {
      notify('Bildirishnomalar muvaffaqiyatli yoqildi!', 'success');
    }
  };

  const triggerBrowserNotification = (title, body) => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.svg' });
    }
  };

  // Live Clock & Alarm / 10-Min Class Reminder Engine
  useEffect(() => {
    const interval = setInterval(() => {
      const current = new Date();
      setNow(current);

      const hh = String(current.getHours()).padStart(2, '0');
      const mm = String(current.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${hh}:${mm}`;
      const jsDay = current.getDay();
      const dateKey = current.toDateString();

      // 1. Check User Alarms
      alarms.forEach((alarm) => {
        if (!alarm.enabled) return;
        if (!alarm.days.includes(jsDay)) return;
        const uniqueKey = `${dateKey}-${alarm.id}-${currentTimeStr}`;

        if (alarm.time === currentTimeStr && !triggeredKeysRef.current.has(uniqueKey)) {
          triggeredKeysRef.current.add(uniqueKey);
          setRingingAlarm(alarm);
          soundEngine.startAlarmLoop(alarm.tone || 'marimba');
          triggerBrowserNotification('Talaba Vaqti — Budilnik', `${alarm.time} • ${alarm.label}`);
        }
      });

      // 2. Check 10-minute before class reminders
      if (classReminderEnabled && jsDay >= 1 && jsDay <= 6) {
        const nowMins = current.getHours() * 60 + current.getMinutes();
        classes
          .filter((c) => Number(c.day) === jsDay)
          .forEach((cls) => {
            const startMins = timeToMinutes(cls.startTime);
            const clsKey = `${dateKey}-cls-${cls.id}`;
            if (startMins - nowMins === 10 && !triggeredKeysRef.current.has(clsKey)) {
              triggeredKeysRef.current.add(clsKey);
              const reminderObj = {
                time: cls.startTime,
                label: `10 daqiqadan so‘ng: ${cls.subject} (${cls.room})`,
                isClassReminder: true
              };
              setRingingAlarm(reminderObj);
              soundEngine.startAlarmLoop('zen');
              triggerBrowserNotification('Dars boshlanishiga 10 daqiqa qoldi!', `${cls.subject} • Xona: ${cls.room}`);
            }
          });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [alarms, classes, classReminderEnabled]);

  const handleDismissAlarm = () => {
    soundEngine.stopAlarmLoop();
    setRingingAlarm(null);
  };

  const handleSnoozeAlarm = (alarm) => {
    soundEngine.stopAlarmLoop();
    setRingingAlarm(null);
    const snoozeDate = new Date(Date.now() + 5 * 60 * 1000);
    const hh = String(snoozeDate.getHours()).padStart(2, '0');
    const mm = String(snoozeDate.getMinutes()).padStart(2, '0');
    const snoozeTime = `${hh}:${mm}`;

    setAlarms((prev) => [
      ...prev,
      {
        id: 'snooze-' + Date.now(),
        time: snoozeTime,
        label: `Snooze: ${alarm.label}`,
        days: [snoozeDate.getDay()],
        tone: alarm.tone || 'marimba',
        enabled: true
      }
    ]);
    notify(`Budilnik 5 daqiqaga (${snoozeTime}) surildi`, 'info');
  };

  // JSON Export & Import Backup
  const handleExport = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      classes,
      tasks,
      topGoals,
      alarms,
      habits,
      timeBlocks,
      reflection,
      focusHistory
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `talaba-vaqti-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    notify('Zaxira nusxa (JSON) yuklab olindi!', 'success');
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.classes) setClasses(data.classes);
        if (data.tasks) setTasks(data.tasks);
        if (data.topGoals) setTopGoals(data.topGoals);
        if (data.alarms) setAlarms(data.alarms);
        if (data.habits) setHabits(data.habits);
        if (data.timeBlocks) setTimeBlocks(data.timeBlocks);
        if (typeof data.reflection === 'string') setReflection(data.reflection);
        if (data.focusHistory) setFocusHistory(data.focusHistory);
        notify('Ma’lumotlar muvaffaqiyatli tiklandi!', 'success');
      } catch {
        notify('Fayl formati noto‘g‘ri!', 'info');
      }
    };
    reader.readAsText(file);
  };

  const handleInstallApp = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
      notify('Talaba Vaqti qurilmangizga o‘rnatildi!', 'success');
    }
  };

  const pendingTasksCount = tasks.filter((t) => !t.completed).length;
  const activeAlarmsCount = alarms.filter((a) => a.enabled).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20 lg:pb-8">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        pendingTasksCount={pendingTasksCount}
        activeAlarmsCount={activeAlarmsCount}
        onExport={handleExport}
        onImport={handleImport}
        installPrompt={installPrompt}
        onInstallApp={handleInstallApp}
      />

      <div className="lg:pl-72 flex flex-col min-h-screen">
        <Header
          now={now}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onOpenQuickAdd={() => setQuickAddOpen(true)}
          notifPermission={notifPermission}
          onRequestNotif={requestNotifPermission}
        />

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-6">
          {activeTab === 'dashboard' && (
            <Dashboard
              now={now}
              classes={classes}
              tasks={tasks}
              setTasks={setTasks}
              topGoals={topGoals}
              setTopGoals={setTopGoals}
              focusMinutesToday={focusMinutesToday}
              habits={habits}
              alarms={alarms}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'schedule' && (
            <Schedule classes={classes} setClasses={setClasses} notify={notify} />
          )}

          {activeTab === 'tasks' && (
            <Tasks tasks={tasks} setTasks={setTasks} notify={notify} />
          )}

          {activeTab === 'pomodoro' && (
            <Pomodoro
              classes={classes}
              focusMinutesToday={focusMinutesToday}
              setFocusMinutesToday={setFocusMinutesToday}
              focusHistory={focusHistory}
              setFocusHistory={setFocusHistory}
              notify={notify}
            />
          )}

          {activeTab === 'alarms' && (
            <Alarms
              alarms={alarms}
              setAlarms={setAlarms}
              classReminderEnabled={classReminderEnabled}
              setClassReminderEnabled={setClassReminderEnabled}
              notifPermission={notifPermission}
              onRequestNotif={requestNotifPermission}
              notify={notify}
            />
          )}

          {activeTab === 'habits' && (
            <Habits
              habits={habits}
              setHabits={setHabits}
              timeBlocks={timeBlocks}
              setTimeBlocks={setTimeBlocks}
              reflection={reflection}
              setReflection={setReflection}
              notify={notify}
            />
          )}
        </main>
      </div>

      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <QuickAddModal
        isOpen={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        onAddTask={(t) => {
          setTasks((prev) => [t, ...prev]);
          notify('Tezkor vazifa saqlandi!', 'success');
        }}
        onAddAlarm={(a) => {
          setAlarms((prev) => [...prev, a]);
          notify(`Budilnik ${a.time} ga o‘rnatildi!`, 'success');
        }}
      />

      <AlarmRingModal
        activeAlarm={ringingAlarm}
        onDismiss={handleDismissAlarm}
        onSnooze={handleSnoozeAlarm}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
