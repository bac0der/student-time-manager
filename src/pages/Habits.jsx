import React, { useState } from 'react';
import { Flame, Plus, Trash2, Check, Clock, BookMarked } from 'lucide-react';

const WEEK_SHORT = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];

export default function Habits({
  habits,
  setHabits,
  timeBlocks,
  setTimeBlocks,
  reflection,
  setReflection,
  notify
}) {
  const [habitName, setHabitName] = useState('');
  const [habitCategory, setHabitCategory] = useState('O‘qish');

  const [blockHour, setBlockHour] = useState('18:00');
  const [blockActivity, setBlockActivity] = useState('');
  const [blockTag, setBlockTag] = useState('O‘qish');

  const handleAddHabit = (e) => {
    e.preventDefault();
    if (!habitName.trim()) return;
    setHabits((prev) => [
      ...prev,
      {
        id: 'hab-' + Date.now(),
        name: habitName.trim(),
        category: habitCategory,
        days: [false, false, false, false, false, false, false]
      }
    ]);
    setHabitName('');
    notify('Yangi odat qo‘shildi!', 'success');
  };

  const toggleHabitDay = (habitId, dayIdx) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const updated = [...h.days];
        updated[dayIdx] = !updated[dayIdx];
        return { ...h, days: updated };
      })
    );
  };

  const handleAddBlock = (e) => {
    e.preventDefault();
    if (!blockActivity.trim()) return;
    setTimeBlocks((prev) =>
      [...prev, { id: 'tb-' + Date.now(), hour: blockHour, activity: blockActivity.trim(), tag: blockTag }].sort(
        (a, b) => a.hour.localeCompare(b.hour)
      )
    );
    setBlockActivity('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Kunlik Reja (Time Blocking) & Odatlar Trekeri
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Kuningizni soatbay bloklarga ajrating va foydali odatlar zanjirini uzmang
        </p>
      </div>

      {/* Weekly Habit Tracker */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-500/15 text-orange-500 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Haftalik Odatlar Zanjiri (Streak)
              </h3>
              <p className="text-xs text-slate-500">Har kuni bajarilgan odatni belgilab boring</p>
            </div>
          </div>

          <form onSubmit={handleAddHabit} className="flex gap-2">
            <input
              type="text"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              placeholder="Yangi odat..."
              className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
            />
            <select
              value={habitCategory}
              onChange={(e) => setHabitCategory(e.target.value)}
              className="px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
            >
              <option>O‘qish</option>
              <option>Sog‘liq</option>
              <option>Til</option>
              <option>Intizom</option>
            </select>
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase text-slate-400">
                <th className="py-2.5 pr-4">Odat</th>
                {WEEK_SHORT.map((d) => (
                  <th key={d} className="py-2.5 px-2 text-center">
                    {d}
                  </th>
                ))}
                <th className="py-2.5 pl-3 text-right">Streak</th>
                <th className="py-2.5 pl-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
              {habits.map((habit) => {
                const streak = habit.days.filter(Boolean).length;
                return (
                  <tr key={habit.id}>
                    <td className="py-3.5 pr-4">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{habit.name}</p>
                      <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                        {habit.category}
                      </span>
                    </td>
                    {habit.days.map((done, idx) => (
                      <td key={idx} className="py-3.5 px-1.5 text-center">
                        <button
                          onClick={() => toggleHabitDay(habit.id, idx)}
                          className={`w-8 h-8 rounded-xl inline-flex items-center justify-center transition cursor-pointer ${
                            done
                              ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                              : 'bg-slate-100 dark:bg-slate-800 text-transparent hover:border hover:border-slate-300'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </td>
                    ))}
                    <td className="py-3.5 pl-3 text-right">
                      <span className="inline-flex items-center gap-1 text-xs font-extrabold text-orange-500">
                        <Flame className="w-3.5 h-3.5" /> {streak}/7
                      </span>
                    </td>
                    <td className="py-3.5 pl-2 text-right">
                      <button
                        onClick={() => setHabits((prev) => prev.filter((h) => h.id !== habit.id))}
                        className="p-1.5 text-slate-400 hover:text-rose-500 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom 2 Columns: Time Blocking & Daily Reflection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Blocking */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-indigo-600" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Soatbay Kun Tartibi (Time Blocking)
            </h3>
          </div>

          <form onSubmit={handleAddBlock} className="flex flex-wrap sm:flex-nowrap gap-2 mb-4">
            <input
              type="time"
              value={blockHour}
              onChange={(e) => setBlockHour(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
            />
            <input
              type="text"
              value={blockActivity}
              onChange={(e) => setBlockActivity(e.target.value)}
              placeholder="Mashg‘ulot nomi..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 cursor-pointer"
            >
              Qo‘shish
            </button>
          </form>

          <div className="space-y-2.5">
            {timeBlocks.map((tb) => (
              <div
                key={tb.id}
                className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-indigo-600 text-white tabular-nums">
                    {tb.hour}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {tb.activity}
                  </span>
                </div>
                <button
                  onClick={() => setTimeBlocks((prev) => prev.filter((item) => item.id !== tb.id))}
                  className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Evening Reflection Journal */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <BookMarked className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Kunlik Xulosa va Refleksiya Daftari
            </h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Bugun nimalarni o‘rgandingiz? Ertaga nimani yaxshiroq qilish mumkin? (Avtomatik saqlanadi)
          </p>

          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            rows={8}
            placeholder="1. Bugungi eng katta yutug‘im: ...&#10;2. Qaysi mavzuni takrorlashim kerak: ...&#10;3. Ertangi asosiy fokus: ..."
            className="flex-1 w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}
