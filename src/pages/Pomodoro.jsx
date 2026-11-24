import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Award, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

const PRESETS = [
  { id: 'classic', label: '25 / 5 Klassik', focus: 25, breakMin: 5 },
  { id: 'deep', label: '50 / 10 Chuqur', focus: 50, breakMin: 10 },
  { id: 'ultradian', label: '90 / 20 Ilmiy Blok', focus: 90, breakMin: 20 }
];

export default function Pomodoro({
  classes,
  focusMinutesToday,
  setFocusMinutesToday,
  focusHistory,
  setFocusHistory,
  notify
}) {
  const [preset, setPreset] = useState(PRESETS[0]);
  const [mode, setMode] = useState('focus'); // 'focus' | 'break'
  const [secondsLeft, setSecondsLeft] = useState(PRESETS[0].focus * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(
    classes[0]?.subject || 'Mustaqil o‘qish'
  );
  const [ambientType, setAmbientType] = useState(null);

  const totalSeconds = (mode === 'focus' ? preset.focus : preset.breakMin) * 60;
  const progress = Math.round(((totalSeconds - secondsLeft) / totalSeconds) * 100);

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          soundEngine.playPomodoroComplete();

          if (mode === 'focus') {
            setFocusMinutesToday((m) => m + preset.focus);
            setFocusHistory((hist) => ({
              ...hist,
              [selectedSubject]: (hist[selectedSubject] || 0) + preset.focus
            }));
            notify(`Ajoyib! ${preset.focus} daqiqa fokus yakunlandi. Endi tanaffus!`, 'success');
            setMode('break');
            return preset.breakMin * 60;
          } else {
            notify('Tanaffus tugadi! Yangi fokus sessiyasiga tayyormisiz?', 'info');
            setMode('focus');
            return preset.focus * 60;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, mode, preset, selectedSubject, setFocusMinutesToday, setFocusHistory, notify]);

  const handleSelectPreset = (p) => {
    setIsRunning(false);
    setPreset(p);
    setMode('focus');
    setSecondsLeft(p.focus * 60);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft((mode === 'focus' ? preset.focus : preset.breakMin) * 60);
  };

  const handleAmbient = (type) => {
    const active = soundEngine.toggleAmbient(type);
    setAmbientType(active);
  };

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const secs = String(secondsLeft % 60).padStart(2, '0');

  const uniqueSubjects = Array.from(
    new Set(['Mustaqil o‘qish', 'Dasturlash / Loyiha', ...classes.map((c) => c.subject)])
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Fokus & Pomodoro Studiyasi
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Chalg‘imasdan o‘qish taymeri va diqqatni jamlovchi akustik fon shovqinlari
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Timer Card */}
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 text-center shadow-sm">
          {/* Presets */}
          <div className="flex flex-wrap justify-center gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  preset.id === p.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/70'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Subject selector */}
          <div className="mt-5 max-w-xs mx-auto">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Hozirgi o‘qilayotgan fan
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-center"
            >
              {uniqueSubjects.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>

          {/* Circular-like Timer Display */}
          <div className="my-8 relative max-w-xs mx-auto">
            <div className="w-56 h-56 mx-auto rounded-full border-8 border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center relative shadow-inner">
              <span
                className={`text-xs font-extrabold uppercase tracking-widest px-3 py-0.5 rounded-full ${
                  mode === 'focus'
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400'
                    : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400'
                }`}
              >
                {mode === 'focus' ? 'Fokus Vaqti' : 'Tanaffus'}
              </span>
              <span className="mt-2 text-5xl font-extrabold tabular-nums tracking-tight text-slate-900 dark:text-white">
                {mins}:{secs}
              </span>
              <span className="mt-1 text-xs font-semibold text-slate-400">{progress}% bajarildi</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition cursor-pointer"
            >
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isRunning ? 'To‘xtatib turish' : 'Boshlash'}
            </button>
            <button
              onClick={handleReset}
              className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition cursor-pointer"
              title="Qayta boshlash"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Side: Focus Sounds & Subject Stats */}
        <div className="space-y-5">
          {/* Ambient Audio Generator */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-4 h-4" /> Akustik Fokus Foni
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Tashqi shovqinlarni to‘sish uchun Web Audio sintezlangan tovushlar:
            </p>

            <div className="mt-4 space-y-2.5">
              <button
                onClick={() => handleAmbient('brown')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border text-xs font-bold transition cursor-pointer ${
                  ambientType === 'brown'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                }`}
              >
                <span>Brown Noise (Yomg‘ir / Chuqur fon)</span>
                {ambientType === 'brown' ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-50" />}
              </button>

              <button
                onClick={() => handleAmbient('alpha')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border text-xs font-bold transition cursor-pointer ${
                  ambientType === 'alpha'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                }`}
              >
                <span>Alpha Fokus To‘lqini (140Hz)</span>
                {ambientType === 'alpha' ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-50" />}
              </button>
            </div>
          </div>

          {/* Subject Time Breakdown */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" /> Fanlar kesimida fokus
              </h3>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                Bugun: {focusMinutesToday} daq
              </span>
            </div>

            {Object.keys(focusHistory).length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                Hali yakunlangan sessiyalar yo‘q. Birinchi Pomodoro taymerini ishga tushiring!
              </p>
            ) : (
              <div className="space-y-2.5">
                {Object.entries(focusHistory).map(([subj, mins]) => (
                  <div key={subj} className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 truncate pr-2">{subj}</span>
                    <span className="font-extrabold text-indigo-600 dark:text-indigo-400 shrink-0">{mins} daq</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
