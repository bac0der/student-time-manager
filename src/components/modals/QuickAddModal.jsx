import React, { useState } from 'react';
import { X, CheckSquare, BellRing, Plus } from 'lucide-react';

export default function QuickAddModal({ isOpen, onClose, onAddTask, onAddAlarm }) {
  const [mode, setMode] = useState('task');
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [urgent, setUrgent] = useState(true);
  const [important, setImportant] = useState(true);
  const [alarmTime, setAlarmTime] = useState('07:30');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (mode === 'task') {
      onAddTask({
        id: 'tsk-' + Date.now(),
        title: title.trim(),
        subject: subject.trim() || 'Umumiy',
        deadline: new Date().toISOString().split('T')[0],
        urgent,
        important,
        completed: false,
        subtasks: []
      });
    } else {
      onAddAlarm({
        id: 'alm-' + Date.now(),
        time: alarmTime,
        label: title.trim(),
        days: [1, 2, 3, 4, 5, 6],
        tone: 'marimba',
        enabled: true
      });
    }

    setTitle('');
    setSubject('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Tezkor qo‘shish</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode switcher */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 mt-4">
          <button
            type="button"
            onClick={() => setMode('task')}
            className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              mode === 'task'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500'
            }`}
          >
            <CheckSquare className="w-4 h-4" /> Yangi Vazifa
          </button>
          <button
            type="button"
            onClick={() => setMode('alarm')}
            className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              mode === 'alarm'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500'
            }`}
          >
            <BellRing className="w-4 h-4" /> Tezkor Budilnik
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {mode === 'task' ? 'Vazifa nomi' : 'Eslatma / Budilnik nomi'}
            </label>
            <input
              type="text"
              autoFocus
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                mode === 'task'
                  ? 'Masalan: Laboratoriya hisobotini topshirish'
                  : 'Masalan: Darsga chiqish vaqti'
              }
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {mode === 'task' ? (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                  Fan yoki kategoriya
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Masalan: Amaliy Matematika"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-3">
                <label className="flex-1 flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={urgent}
                    onChange={(e) => setUrgent(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span className="text-xs font-semibold">Shoshilinch</span>
                </label>
                <label className="flex-1 flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={important}
                    onChange={(e) => setImportant(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span className="text-xs font-semibold">Muhim</span>
                </label>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                Vaqtni tanlang
              </label>
              <input
                type="time"
                value={alarmTime}
                onChange={(e) => setAlarmTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base font-bold"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-500/25 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Saqlash
          </button>
        </form>
      </div>
    </div>
  );
}
