import React, { useState, useMemo } from 'react';
import { Plus, Trash2, MapPin, User, Clock, Award, BookOpen } from 'lucide-react';
import { DAYS_UZ, getTodayDayId, timeToMinutes } from '../utils/timeUtils';

const COLOR_BADGES = {
  indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30',
  sky: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30',
  violet: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/15 dark:text-violet-300 dark:border-violet-500/30',
  amber: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30',
  rose: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30'
};

export default function Schedule({ classes, setClasses, notify }) {
  const [selectedDay, setSelectedDay] = useState(getTodayDayId());
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    subject: '',
    type: 'Ma’ruza',
    startTime: '08:30',
    endTime: '09:50',
    room: '',
    teacher: '',
    credits: 4,
    grade: 5,
    color: 'indigo'
  });

  const dayClasses = useMemo(() => {
    return classes
      .filter((c) => Number(c.day) === selectedDay)
      .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
  }, [classes, selectedDay]);

  // Credit-weighted GPA calculator
  const gpaStats = useMemo(() => {
    const uniqueSubjects = new Map();
    classes.forEach((c) => {
      if (!uniqueSubjects.has(c.subject)) {
        uniqueSubjects.set(c.subject, { credits: Number(c.credits || 4), grade: Number(c.grade || 5) });
      }
    });
    let totalCredits = 0;
    let totalPoints = 0;
    uniqueSubjects.forEach(({ credits, grade }) => {
      totalCredits += credits;
      totalPoints += credits * grade;
    });
    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
    return { gpa, totalCredits, subjectCount: uniqueSubjects.size };
  }, [classes]);

  const handleAddClass = (e) => {
    e.preventDefault();
    if (!form.subject.trim()) return;

    const newItem = {
      id: 'cls-' + Date.now(),
      day: selectedDay,
      ...form,
      subject: form.subject.trim(),
      room: form.room.trim() || 'Belgilanmagan',
      teacher: form.teacher.trim() || 'O‘qituvchi'
    };

    setClasses((prev) => [...prev, newItem]);
    setForm({
      subject: '',
      type: 'Ma’ruza',
      startTime: '10:00',
      endTime: '11:20',
      room: '',
      teacher: '',
      credits: 4,
      grade: 5,
      color: 'sky'
    });
    setShowForm(false);
    notify('Dars jadvalga muvaffaqiyatli qo‘shildi!', 'success');
  };

  const handleDelete = (id) => {
    setClasses((prev) => prev.filter((c) => c.id !== id));
    notify('Dars jadvaldan o‘chirildi', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header + GPA Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Haftalik Dars Jadvali & GPA
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Har bir darsdan 10 daqiqa oldin avtomatik bildirishnoma yuboriladi
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400">Semestr GPA ({gpaStats.totalCredits} kredit)</p>
              <p className="text-base font-extrabold text-slate-900 dark:text-white">
                {gpaStats.gpa} <span className="text-xs font-normal text-slate-400">/ 5.00</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/25 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Dars qo‘shish
          </button>
        </div>
      </div>

      {/* Add Class Form */}
      {showForm && (
        <form
          onSubmit={handleAddClass}
          className="rounded-3xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-500/30 p-6 shadow-lg space-y-4"
        >
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            {DAYS_UZ.find((d) => d.id === selectedDay)?.full} uchun yangi dars
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-500 mb-1">Fan nomi *</label>
              <input
                type="text"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Masalan: Operatsion Tizimlar"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Mashg‘ulot turi</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
              >
                <option>Ma’ruza</option>
                <option>Amaliyot</option>
                <option>Laboratoriya</option>
                <option>Seminar</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Auditoriya / Xona</label>
              <input
                type="text"
                value={form.room}
                onChange={(e) => setForm({ ...form, room: e.target.value })}
                placeholder="B-302"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Boshlanish vaqti</label>
              <input
                type="time"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Tugash vaqti</label>
              <input
                type="time"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Kredit / Maqsad baho</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={form.credits}
                  onChange={(e) => setForm({ ...form, credits: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                  title="Kredit soni"
                />
                <select
                  value={form.grade}
                  onChange={(e) => setForm({ ...form, grade: Number(e.target.value) })}
                  className="w-full px-2 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                  title="Kutilayotgan baho"
                >
                  <option value={5}>5 (A)</option>
                  <option value={4}>4 (B)</option>
                  <option value={3}>3 (C)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">O‘qituvchi</label>
              <input
                type="text"
                value={form.teacher}
                onChange={(e) => setForm({ ...form, teacher: e.target.value })}
                placeholder="Prof. Alimov"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 cursor-pointer"
            >
              Saqlash
            </button>
          </div>
        </form>
      )}

      {/* Day Selector Tabs */}
      <div className="grid grid-cols-6 gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        {DAYS_UZ.map((day) => {
          const isSelected = selectedDay === day.id;
          const count = classes.filter((c) => Number(c.day) === day.id).length;
          return (
            <button
              key={day.id}
              onClick={() => setSelectedDay(day.id)}
              className={`py-2.5 px-2 rounded-xl text-center transition cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="block text-xs sm:text-sm font-extrabold">{day.short}</span>
              <span
                className={`text-[10px] font-semibold ${
                  isSelected ? 'text-indigo-100' : 'text-slate-400'
                }`}
              >
                {count} para
              </span>
            </button>
          );
        })}
      </div>

      {/* Classes List */}
      {dayClasses.length === 0 ? (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center">
          <BookOpen className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
          <h3 className="mt-3 font-bold text-base text-slate-700 dark:text-slate-200">
            Bu kunga dars kiritilmagan
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Yuqoridagi “Dars qo‘shish” tugmasi orqali jadvalingizni shakllantiring.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dayClasses.map((cls, index) => (
            <div
              key={cls.id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 flex items-start justify-between gap-4 hover:shadow-md transition"
            >
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-slate-900 text-white dark:bg-slate-800">
                    {index + 1}-para
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                      COLOR_BADGES[cls.color] || COLOR_BADGES.indigo
                    }`}
                  >
                    {cls.type}
                  </span>
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    {cls.startTime} – {cls.endTime}
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
                  {cls.subject}
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" /> Xona: <strong>{cls.room}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-sky-500" /> {cls.teacher}
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {cls.credits} kredit • Baho: {cls.grade}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleDelete(cls.id)}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition cursor-pointer"
                title="Darsni o‘chirish"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
