import React, { useState } from 'react';
import {
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  LayoutGrid,
  List,
  Search,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const QUADRANTS = [
  {
    id: 'q1',
    title: '1. Shoshilinch va Muhim',
    subtitle: 'Hoziroq bajaring (Do First)',
    urgent: true,
    important: true,
    badge: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30'
  },
  {
    id: 'q2',
    title: '2. Muhim, lekin Shoshilinch emas',
    subtitle: 'Rejalashtiring (Schedule)',
    urgent: false,
    important: true,
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30'
  },
  {
    id: 'q3',
    title: '3. Shoshilinch, lekin Muhim emas',
    subtitle: 'Tez hal qiling / Topshiring',
    urgent: true,
    important: false,
    badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30'
  },
  {
    id: 'q4',
    title: '4. Shoshilinch ham, Muhim ham emas',
    subtitle: 'Bo‘sh vaqtda / Kamaytiring',
    urgent: false,
    important: false,
    badge: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
  }
];

export default function Tasks({ tasks, setTasks, notify }) {
  const [viewMode, setViewMode] = useState('matrix'); // 'list' | 'matrix'
  const [search, setSearch] = useState('');
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [deadline, setDeadline] = useState(new Date().toISOString().split('T')[0]);
  const [urgent, setUrgent] = useState(true);
  const [important, setImportant] = useState(true);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [newSubtask, setNewSubtask] = useState('');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setTasks((prev) => [
      {
        id: 'tsk-' + Date.now(),
        title: title.trim(),
        subject: subject.trim() || 'Umumiy',
        deadline,
        urgent,
        important,
        completed: false,
        subtasks: []
      },
      ...prev
    ]);
    setTitle('');
    setSubject('');
    notify('Yangi vazifa qo‘shildi', 'success');
  };

  const toggleTask = (id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const addSubtask = (taskId, e) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: [...(t.subtasks || []), { id: 'st-' + Date.now(), text: newSubtask.trim(), done: false }]
            }
          : t
      )
    );
    setNewSubtask('');
  };

  const toggleSubtask = (taskId, subId) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: (t.subtasks || []).map((s) => (s.id === subId ? { ...s, done: !s.done } : s))
            }
          : t
      )
    );
  };

  const filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase())
  );

  const renderTaskCard = (task) => {
    const isExpanded = expandedTaskId === task.id;
    const subDone = (task.subtasks || []).filter((s) => s.done).length;
    const subTotal = (task.subtasks || []).length;

    return (
      <div
        key={task.id}
        className={`p-3.5 rounded-2xl border transition ${
          task.completed
            ? 'bg-slate-50/60 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800 opacity-70'
            : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-xs'
        }`}
      >
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            <button
              onClick={() => toggleTask(task.id)}
              className="mt-0.5 text-indigo-600 dark:text-indigo-400 cursor-pointer shrink-0"
            >
              {task.completed ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Circle className="w-5 h-5" />}
            </button>
            <div className="min-w-0 flex-1">
              <p
                className={`text-sm font-bold leading-snug ${
                  task.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-100'
                }`}
              >
                {task.title}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
                  {task.subject}
                </span>
                {task.deadline && (
                  <span className="text-[11px] text-slate-400 font-medium">Muddat: {task.deadline}</span>
                )}
                {subTotal > 0 && (
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    Bosqichlar: {subDone}/{subTotal}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              title="Ichki bosqichlar (Subtasks)"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button
              onClick={() => deleteTask(task.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Subtasks drawer */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 pl-7">
            {(task.subtasks || []).map((sub) => (
              <div
                key={sub.id}
                onClick={() => toggleSubtask(task.id, sub.id)}
                className="flex items-center gap-2 text-xs cursor-pointer"
              >
                {sub.done ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}
                <span className={sub.done ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}>
                  {sub.text}
                </span>
              </div>
            ))}

            <form onSubmit={(e) => addSubtask(task.id, e)} className="flex gap-1.5 pt-1">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Ichki qadam qo‘shish..."
                className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
              />
              <button
                type="submit"
                className="px-2.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold cursor-pointer"
              >
                +
              </button>
            </form>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Vazifalar & Eisenhower Matritsasi
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Vazifalarni muhimlik va shoshilinchlik darajasiga ko‘ra saralang
          </p>
        </div>

        {/* View Toggle */}
        <div className="inline-flex p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setViewMode('matrix')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              viewMode === 'matrix'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <LayoutGrid className="w-4 h-4" /> Matritsa
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              viewMode === 'list'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <List className="w-4 h-4" /> Ro‘yxat
          </button>
        </div>
      </div>

      {/* Add New Task Form */}
      <form
        onSubmit={handleAddTask}
        className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-3"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Yangi topshiriq yoki loyiha vazifasi..."
            className="md:col-span-5 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Fan (masalan: Matematika)"
            className="md:col-span-3 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
          />
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="md:col-span-2 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
          />
          <button
            type="submit"
            className="md:col-span-2 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Qo‘shish
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={urgent}
                onChange={(e) => setUrgent(e.target.checked)}
                className="rounded text-indigo-600"
              />
              Shoshilinch (Urgent)
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={important}
                onChange={(e) => setImportant(e.target.checked)}
                className="rounded text-indigo-600"
              />
              Muhim (Important)
            </label>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Vazifa yoki fan qidirish..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
            />
          </div>
        </div>
      </form>

      {/* Matrix or List View */}
      {viewMode === 'matrix' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {QUADRANTS.map((q) => {
            const qTasks = filteredTasks.filter(
              (t) => Boolean(t.urgent) === q.urgent && Boolean(t.important) === q.important
            );
            return (
              <div
                key={q.id}
                className="rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 p-5 flex flex-col"
              >
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div>
                    <span className={`inline-block text-xs font-extrabold px-3 py-1 rounded-xl border ${q.badge}`}>
                      {q.title}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">{q.subtitle}</p>
                  </div>
                  <span className="text-xs font-extrabold text-slate-400">{qTasks.length} ta</span>
                </div>

                <div className="space-y-2.5 flex-1">
                  {qTasks.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                      Bu kvadrantda vazifa yo‘q
                    </div>
                  ) : (
                    qTasks.map(renderTaskCard)
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredTasks.map(renderTaskCard)}
        </div>
      )}
    </div>
  );
}
