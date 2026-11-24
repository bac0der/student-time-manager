export const DAYS_UZ = [
  { id: 1, short: 'Du', full: 'Dushanba' },
  { id: 2, short: 'Se', full: 'Seshanba' },
  { id: 3, short: 'Ch', full: 'Chorshanba' },
  { id: 4, short: 'Pa', full: 'Payshanba' },
  { id: 5, short: 'Ju', full: 'Juma' },
  { id: 6, short: 'Sh', full: 'Shanba' }
];

export const MONTHS_UZ = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
];

export const WEEKDAYS_FULL_UZ = [
  'Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'
];

export function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

export function formatMinutesDiff(mins) {
  const abs = Math.max(0, Math.round(mins));
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  if (h > 0 && m > 0) return `${h} soat ${m} daqiqa`;
  if (h > 0) return `${h} soat`;
  return `${m} daqiqa`;
}

export function getTodayDayId(date = new Date()) {
  const jsDay = date.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
  return jsDay === 0 ? 1 : jsDay;
}

export function formatUzbekDate(date = new Date()) {
  const dayName = WEEKDAYS_FULL_UZ[date.getDay()];
  const day = date.getDate();
  const month = MONTHS_UZ[date.getMonth()];
  const year = date.getFullYear();
  return `${day}-${month}, ${year} • ${dayName}`;
}

export function getCurrentClassStatus(classes, now = new Date()) {
  const jsDay = now.getDay();
  if (jsDay === 0) {
    return { status: 'weekend', message: 'Bugun yakshanba — dam olish va haftalik tahlil kuni!' };
  }

  const todayClasses = classes
    .filter((c) => Number(c.day) === jsDay)
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  if (todayClasses.length === 0) {
    return { status: 'free', message: 'Bugun jadvalda darslar yo‘q. Mustaqil ta’lim uchun ajoyib kun!' };
  }

  const currentMins = now.getHours() * 60 + now.getMinutes();

  for (let i = 0; i < todayClasses.length; i++) {
    const cls = todayClasses[i];
    const start = timeToMinutes(cls.startTime);
    const end = timeToMinutes(cls.endTime);

    if (currentMins >= start && currentMins < end) {
      const total = end - start;
      const elapsed = currentMins - start;
      const progress = Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
      return {
        status: 'ongoing',
        current: cls,
        next: todayClasses[i + 1] || null,
        remainingMins: end - currentMins,
        progress
      };
    }

    if (currentMins < start) {
      return {
        status: 'upcoming',
        next: cls,
        startsInMins: start - currentMins
      };
    }
  }

  return {
    status: 'finished',
    message: 'Bugungi barcha darslar yakunlandi! Vazifalar va takrorlashga o‘tishingiz mumkin.'
  };
}
