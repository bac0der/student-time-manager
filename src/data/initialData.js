export const MOTIVATIONAL_QUOTES = [
  { text: 'Bugun qilingan kichik intizom — ertangi katta muvaffaqiyatning poydevori.', author: 'Talaba Vaqti' },
  { text: 'Vaqtni boshqara olmagan inson hech narsani boshqara olmaydi.', author: 'Piter Druker' },
  { text: 'Muvaffaqiyat har kuni takrorlanadigan kichik odatlar yig‘indisidir.', author: 'Jeyms Klir' },
  { text: 'Qiyin vazifani ertalab birinchi bo‘lib bajaring — kunning qolgan qismi yengil o‘tadi.', author: 'Brayan Treysi' },
  { text: 'Chalg‘imasdan o‘tkazilgan 50 daqiqa, telefonga qarab o‘tkazilgan 3 soatdan unumliroq.', author: 'Deep Work' }
];

export const INITIAL_CLASSES = [
  {
    id: 'cls-1',
    day: 1,
    subject: 'Amaliy Matematika',
    type: 'Ma’ruza',
    startTime: '08:30',
    endTime: '09:50',
    room: 'A-304',
    teacher: 'Prof. Karimov A.',
    credits: 6,
    grade: 5,
    color: 'indigo'
  },
  {
    id: 'cls-2',
    day: 1,
    subject: 'Algoritmlar va Ma’lumotlar Tuzilmasi',
    type: 'Amaliyot',
    startTime: '10:00',
    endTime: '11:20',
    room: 'B-210',
    teacher: 'Dots. Rahimov B.',
    credits: 6,
    grade: 5,
    color: 'sky'
  },
  {
    id: 'cls-3',
    day: 2,
    subject: 'Iqtisodiyot va Menejment Asoslari',
    type: 'Seminar',
    startTime: '09:00',
    endTime: '10:20',
    room: 'C-105',
    teacher: 'Nazarova D.',
    credits: 4,
    grade: 4,
    color: 'emerald'
  },
  {
    id: 'cls-4',
    day: 3,
    subject: 'Web Dasturlash Texnologiyalari',
    type: 'Laboratoriya',
    startTime: '11:30',
    endTime: '12:50',
    room: 'Lab-402',
    teacher: 'Tursunov J.',
    credits: 6,
    grade: 5,
    color: 'violet'
  },
  {
    id: 'cls-5',
    day: 4,
    subject: 'Ingliz Tili (Academic Writing)',
    type: 'Amaliyot',
    startTime: '10:00',
    endTime: '11:20',
    room: 'D-201',
    teacher: 'Sodiqova M.',
    credits: 4,
    grade: 5,
    color: 'amber'
  },
  {
    id: 'cls-6',
    day: 5,
    subject: 'Ma’lumotlar Bazasi Tizimlari',
    type: 'Ma’ruza',
    startTime: '08:30',
    endTime: '09:50',
    room: 'A-101',
    teacher: 'Prof. Alimov S.',
    credits: 4,
    grade: 4,
    color: 'rose'
  }
];

export const INITIAL_TASKS = [
  {
    id: 'tsk-1',
    title: 'Mustaqil ish: 4-mavzu taqdimotini tayyorlash',
    subject: 'Menejment',
    deadline: new Date().toISOString().split('T')[0],
    urgent: true,
    important: true,
    completed: false,
    subtasks: [
      { id: 'st-1', text: 'Reja va kirish qismini yozish', done: true },
      { id: 'st-2', text: 'Diagramma va jadvallarni qo‘shish', done: false },
      { id: 'st-3', text: 'Nutq matnini 5 daqiqaga moslash', done: false }
    ]
  },
  {
    id: 'tsk-2',
    title: 'Amaliy matematikadan 12 ta misolni yechish',
    subject: 'Amaliy Matematika',
    deadline: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    urgent: false,
    important: true,
    completed: false,
    subtasks: [
      { id: 'st-4', text: '1–6 misollar (Integral)', done: true },
      { id: 'st-5', text: '7–12 misollar (Differensial tenglamalar)', done: false }
    ]
  },
  {
    id: 'tsk-3',
    title: 'Dekanatga stipendiya hujjatlarini topshirish',
    subject: 'Tashkiliy',
    deadline: new Date().toISOString().split('T')[0],
    urgent: true,
    important: false,
    completed: false,
    subtasks: []
  },
  {
    id: 'tsk-4',
    title: 'GitHub profil uchun yangi loyiha README yozish',
    subject: 'Portfolio',
    deadline: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    urgent: false,
    important: false,
    completed: true,
    subtasks: []
  }
];

export const INITIAL_TOP_GOALS = [
  { id: 'g-1', text: '2 ta Pomodoro sessiyasida matematika misollarini tugatish', done: false },
  { id: 'g-2', text: 'Ertaga bo‘ladigan ma’ruza konspektini ko‘zdan kechirish', done: true },
  { id: 'g-3', text: 'Kamida 30 daqiqa ingliz tilida podkast eshitish', done: false }
];

export const INITIAL_ALARMS = [
  {
    id: 'alm-1',
    time: '06:45',
    label: 'Uyg‘onish va tonggi tayyorgarlik',
    days: [1, 2, 3, 4, 5, 6],
    tone: 'marimba',
    enabled: true
  },
  {
    id: 'alm-2',
    time: '19:30',
    label: 'Kechki chuqur o‘qish (Deep Work) boshlanishi',
    days: [1, 2, 3, 4, 5],
    tone: 'zen',
    enabled: true
  },
  {
    id: 'alm-3',
    time: '22:45',
    label: 'Ertangi sumka va kiyimlarni tayyorlab uxlash',
    days: [1, 2, 3, 4, 5, 6],
    tone: 'digital',
    enabled: false
  }
];

export const INITIAL_HABITS = [
  {
    id: 'hab-1',
    name: 'Tonggi 1 stakan suv va badantarbiya',
    category: 'Sog‘liq',
    days: [true, true, true, false, true, false, false]
  },
  {
    id: 'hab-2',
    name: 'Kamida 60 daqiqa konspekt va dars tayyorlash',
    category: 'O‘qish',
    days: [true, true, false, true, true, false, false]
  },
  {
    id: 'hab-3',
    name: 'Ingliz tilidan 15 ta yangi so‘z yodlash',
    category: 'Til',
    days: [true, false, true, true, false, false, false]
  },
  {
    id: 'hab-4',
    name: 'Soat 23:30 dan kechikmay uxlash',
    category: 'Intizom',
    days: [false, true, true, false, false, false, false]
  }
];

export const INITIAL_TIME_BLOCKS = [
  { id: 'tb-1', hour: '07:00', activity: 'Nonushta va kunlik reja ko‘zdan kechirish', tag: 'Shaxsiy' },
  { id: 'tb-2', hour: '08:30', activity: 'Universitet darslari (1-2-paralar)', tag: 'Universitet' },
  { id: 'tb-3', hour: '14:00', activity: 'Tushlik va 40 daqiqa hordiq', tag: 'Dam olish' },
  { id: 'tb-4', hour: '16:00', activity: 'Mustaqil ish va uy vazifalari (Pomodoro)', tag: 'O‘qish' },
  { id: 'tb-5', hour: '20:00', activity: 'Loyiha / dasturlash amaliyoti', tag: 'Rivojlanish' }
];
