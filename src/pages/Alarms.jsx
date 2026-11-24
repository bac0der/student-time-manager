import React, { useState } from 'react';
import { BellRing, Plus, Trash2, Volume2, Bell, CheckCircle2 } from 'lucide-react';
import { DAYS_UZ } from '../utils/timeUtils';
import { soundEngine } from '../utils/soundEngine';

const TONES = [
  { id: 'marimba', label: 'Gentle Marimba' },
  { id: 'zen', label: 'Zen Bell (Tinch)' },
  { id: 'digital', label: 'Digital Pulse' },
  { id: 'classic', label: 'Classic Signal' }
];

export default function Alarms({
  alarms,
  setAlarms,
  classReminderEnabled,
  setClassReminderEnabled,
  notifPermission,
  onRequestNotif,
  notify
}) {
  const [time, setTime] = useState('07:00');
  const [label, setLabel] = useState('');
  const [tone, setTone] = useState('marimba');
  const [days, setDays] = useState([1, 2, 3, 4, 5, 6]);

  const toggleDay = (dayId) => {
    setDays((prev) => (prev.includes(dayId) ? prev.filter((d) => d !== dayId) : [...prev, dayId]));
  };

  const handleAddAlarm = (e) => {
    e.preventDefault();
    const newAlarm = {
      id: 'alm-' + Date.now(),
      time,
      label: label.trim() || 'Talaba budilnigi',
      days: days.length > 0 ? days : [1, 2, 3, 4, 5, 6],
      tone,
      enabled: true
    };
    setAlarms((prev) => [...prev, newAlarm]);
    setLabel('');
    notify(`Budilnik ${time} ga o‘rnatildi!`, 'success');
  };

  const toggleAlarm = (id) => {
    setAlarms((prev) => prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)));
  };

  const deleteAlarm = (id) => {
    setAlarms((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Aqlli Budilniklar & Bildirishnomalar
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Uyg‘onish, darsga chiqish va kechki o‘qish vaqtlarini aniq boshqaring
          </p>
        </div>

        {notifPermission === 'granted' ? (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" /> Push bildirishnomalar yoqilgan
          </span>
        ) : (
          <button
            onClick={onRequestNotif}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow cursor-pointer"
          >
            <Bell className="w-4 h-4" /> Brauzer bildirishnomalariga ruxsat berish
          </button>
        )}
      </div>

      {/* Automatic Class Reminder Toggle */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-50 to-sky-50 dark:from-indigo-500/10 dark:to-sky-500/10 border border-indigo-200/70 dark:border-indigo-500/20 p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <BellRing className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
              Darsdan 10 daqiqa oldin avtomatik ogohlantirish
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Dars jadvalidagi har bir ma’ruza va amaliyot boshlanishidan 10 daqiqa avval ovozli signal va push-xabar beradi.
            </p>
          </div>
        </div>

        <button
          onClick={() => setClassReminderEnabled(!classReminderEnabled)}
          className={`w-14 h-8 rounded-full p-1 transition cursor-pointer shrink-0 ${
            classReminderEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full bg-white shadow transform transition ${
              classReminderEnabled ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Create New Alarm Card */}
      <form
        onSubmit={handleAddAlarm}
        className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4"
      >
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Yangi budilnik yaratish</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Vaqt</label>
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-lg font-extrabold"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-500 mb-1">Eslatma matni</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Masalan: 1-para darsga uyg‘onish"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Signal ohangi</label>
            <div className="flex gap-2">
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="flex-1 px-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
              >
                {TONES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => soundEngine.playMelody(tone)}
                className="px-3 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300 hover:bg-indigo-100 cursor-pointer"
                title="Ohangni eshitib ko‘rish"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Days of week */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div className="flex flex-wrap items-center gap-1.5">
            {DAYS_UZ.map((d) => {
              const active = days.includes(d.id);
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => toggleDay(d.id)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition cursor-pointer ${
                    active
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {d.short}
                </button>
              );
            })}
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Budilnik qo‘shish
          </button>
        </div>
      </form>

      {/* Saved Alarms List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alarms.map((alarm) => (
          <div
            key={alarm.id}
            className={`rounded-3xl border p-5 flex items-center justify-between gap-4 transition ${
              alarm.enabled
                ? 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-sm'
                : 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 opacity-65'
            }`}
          >
            <div>
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl font-extrabold tabular-nums text-slate-900 dark:text-white">
                  {alarm.time}
                </span>
                <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
                  {TONES.find((t) => t.id === alarm.tone)?.label || alarm.tone}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">
                {alarm.label}
              </p>
              <div className="flex gap-1 mt-2">
                {DAYS_UZ.map((d) => (
                  <span
                    key={d.id}
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      alarm.days.includes(d.id)
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300'
                        : 'text-slate-400'
                    }`}
                  >
                    {d.short}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => toggleAlarm(alarm.id)}
                className={`w-12 h-7 rounded-full p-1 transition cursor-pointer ${
                  alarm.enabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow transform transition ${
                    alarm.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>

              <button
                onClick={() => deleteAlarm(alarm.id)}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
