import React, { useState, useMemo } from 'react';
import {
  Clock,
  BookOpen,
  CheckCircle2,
  Circle,
  Plus,
  Flame,
  Timer,
  ArrowRight,
  Sparkles,
  Target,
  BellRing
} from 'lucide-react';
import { MOTIVATIONAL_QUOTES } from '../data/initialData';
import { getCurrentClassStatus, formatMinutesDiff } from '../utils/timeUtils';

export default function Dashboard({
  now,
  classes,
  tasks,
  setTasks,
  topGoals,
  setTopGoals,
  focusMinutesToday,
  habits,
  alarms,
  setActiveTab
}) {
  const [quickTaskTitle, setQuickTaskTitle] = useState('');
  const [newGoalText, setNewGoalText] = useState('');

  const quote = useMemo(() => {
    const idx = now.getDate() % MOTIVATIONAL_QUOTES.length;
    return MOTIVATIONAL_QUOTES[idx];
  }, [now]);

  const classStatus = useMemo(() => getCurrentClassStatus(classes, now), [classes, now]);

  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const taskPercent = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const activeAlarms = alarms.filter((a) => a.enabled);

  const toggleGoal = (id) => {
    setTopGoals((prev) => prev.map((g) => (g.id === id ? { ...g, done: !g.done } : g)));
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoalText.trim() || topGoals.length >= 3) return;
    setTopGoals((prev) => [...prev, { id: 'g-' + Date.now(), text: newGoalText.trim(), done: false }]);
    setNewGoalText('');
  };

  const handleQuickTask = (e) => {
    e.preventDefault();
    if (!quickTaskTitle.trim()) return;
    setTasks((prev) => [
      {
        id: 'tsk-' + Date.now(),
        title: quickTaskTitle.trim(),
        subject: 'Tezkor vazifa',
        deadline: new Date().toISOString().split('T')[0],
        urgent: true,
        important: true,
        completed: false,
        subtasks: []
      },
      ...prev
    ]);
    setQuickTaskTitle('');
  };

  const toggleTask = (id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner: Current/Next Class + Motivation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Live Class Status Card */}
        <div className="lg:col-span-2 rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-sky-500 text-white p-6 sm:p-7 shadow-xl shadow-indigo-500/20 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              {classStatus.status === 'ongoing'
                ? 'Hozir dars ketmoqda'
                : classStatus.status === 'upcoming'
                ? 'Navbatdagi dars'
                : 'Dars holati'}
            </span>
            <button
              onClick={() => setActiveTab('schedule')}
              className="text-xs font-bold text-indigo-100 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              To‘liq jadval <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {classStatus.status === 'ongoing' && (
            <div className="mt-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {classStatus.current.subject}
              </h2>
              <p className="mt-1 text-sm text-indigo-100">
                {classStatus.current.type} • Xona: <strong>{classStatus.current.room}</strong> •{' '}
                {classStatus.current.startTime} – {classStatus.current.endTime}
              </p>

              {/* Live progress bar */}
              <div className="mt-5">
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span>Dars jarayoni ({classStatus.progress}%)</span>
                  <span>Tugashiga: {formatMinutesDiff(classStatus.remainingMins)} qoldi</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-black/20 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-500"
                    style={{ width: `${classStatus.progress}%` }}
                  />
                </div>
              </div>

              {classStatus.next && (
                <p className="mt-3 text-xs text-indigo-100">
                  Keyingi dars: <strong>{classStatus.next.subject}</strong> ({classStatus.next.startTime}, {classStatus.next.room})
                </p>
              )}
            </div>
          )}

          {classStatus.status === 'upcoming' && (
            <div className="mt-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {classStatus.next.subject}
              </h2>
              <p className="mt-1 text-sm text-indigo-100">
                {classStatus.next.type} • Xona: <strong>{classStatus.next.room}</strong> • Soat{' '}
                <strong>{classStatus.next.startTime}</strong> da boshlanadi
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/15 text-sm font-bold">
                <Clock className="w-4 h-4" /> Boshlanishiga {formatMinutesDiff(classStatus.startsInMins)} qoldi
              </div>
            </div>
          )}

          {(classStatus.status === 'finished' ||
            classStatus.status === 'free' ||
            classStatus.status === 'weekend') && (
            <div className="mt-4">
              <h2 className="text-xl sm:text-2xl font-extrabold leading-snug">{classStatus.message}</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveTab('pomodoro')}
                  className="px-4 py-2 rounded-xl bg-white text-indigo-700 text-xs font-bold hover:bg-indigo-50 transition cursor-pointer"
                >
                  Fokus taymerni boshlash
                </button>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className="px-4 py-2 rounded-xl bg-white/15 text-white text-xs font-bold hover:bg-white/25 transition cursor-pointer"
                >
                  Vazifalarni ko‘rish
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Daily Quote & Next Alarm */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              <Sparkles className="w-4 h-4" /> Kun hikmati
            </div>
            <blockquote className="mt-3 text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-200 leading-relaxed">
              “{quote.text}”
            </blockquote>
            <p className="mt-2 text-xs font-medium text-slate-400">— {quote.author}</p>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <BellRing className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400">Faol budilniklar</p>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  {activeAlarms.length > 0
                    ? `${activeAlarms[0].time} (${activeAlarms.length} ta faol)`
                    : 'Budilnik o‘chirilgan'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('alarms')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Sozlash
            </button>
          </div>
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Vazifalar bajarilishi</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {completedTasks}/{totalTasks}
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
            {taskPercent}% yakunlangan
          </p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Bugungi fokus vaqti</span>
            <Timer className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {focusMinutesToday} <span className="text-sm font-bold text-slate-400">daq</span>
          </p>
          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
            Chuqur diqqat sessiyalari
          </p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Kuzatilayotgan odatlar</span>
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {habits.length} <span className="text-sm font-bold text-slate-400">ta</span>
          </p>
          <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold mt-0.5">
            Haftalik intizom zanjiri
          </p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Haftalik fanlar</span>
            <BookOpen className="w-5 h-5 text-sky-500" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {classes.length} <span className="text-sm font-bold text-slate-400">para</span>
          </p>
          <p className="text-xs text-sky-600 dark:text-sky-400 font-semibold mt-0.5">
            Dushanba – Shanba
          </p>
        </div>
      </div>

      {/* Bottom 2 Columns: Top 3 Goals & Quick Task Capture */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TOP 3 Daily Goals */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Bugungi TOP-3 Asosiy Maqsad
                </h3>
                <p className="text-xs text-slate-500">Kunning eng muhim 3 ta natijasi</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
              {topGoals.filter((g) => g.done).length}/3
            </span>
          </div>

          <div className="space-y-2.5">
            {topGoals.map((goal) => (
              <div
                key={goal.id}
                onClick={() => toggleGoal(goal.id)}
                className={`flex items-center justify-between gap-3 p-3.5 rounded-2xl border transition cursor-pointer ${
                  goal.done
                    ? 'bg-emerald-50/50 dark:bg-emerald-500/10 border-emerald-200/70 dark:border-emerald-500/20'
                    : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200/70 dark:border-slate-700/70 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  {goal.done ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                  <span
                    className={`text-sm font-semibold ${
                      goal.done ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-100'
                    }`}
                  >
                    {goal.text}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setTopGoals((prev) => prev.filter((item) => item.id !== goal.id));
                  }}
                  className="text-xs text-slate-400 hover:text-rose-500 px-1.5"
                >
                  O‘chirish
                </button>
              </div>
            ))}
          </div>

          {topGoals.length < 3 && (
            <form onSubmit={handleAddGoal} className="mt-3 flex gap-2">
              <input
                type="text"
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                placeholder="Yangi asosiy maqsad qo‘shing..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer"
              >
                Qo‘shish
              </button>
            </form>
          )}
        </div>

        {/* Quick Task Capture & Pending List */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Tezkor Vazifalar Ro‘yxati
              </h3>
              <p className="text-xs text-slate-500">Yodingizga tushgan vazifani darhol yozib qo‘ying</p>
            </div>
            <button
              onClick={() => setActiveTab('tasks')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Matritsani ochish →
            </button>
          </div>

          <form onSubmit={handleQuickTask} className="flex gap-2 mb-4">
            <input
              type="text"
              value={quickTaskTitle}
              onChange={(e) => setQuickTaskTitle(e.target.value)}
              placeholder="Masalan: Algoritmlardan lab ishini yuklash..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Qo‘shish
            </button>
          </form>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {tasks.slice(0, 5).map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {task.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <span
                    className={`text-xs sm:text-sm font-medium truncate ${
                      task.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {task.title}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300 shrink-0">
                  {task.subject}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
