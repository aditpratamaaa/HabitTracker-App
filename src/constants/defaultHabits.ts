import type { Habit } from './types';

/**
 * Data awal (seed) yang disuntikkan saat aplikasi pertama kali dibuka
 * (storage masih kosong), agar layar utama tidak tampil kosong.
 */
export const DEFAULT_HABITS: Habit[] = [
  {
    id: 'habit_seed_1',
    title: 'Minum 2 Liter Air',
    emoji: '💧',
    is_completed: false,
    created_at: '2026-10-01',
    streak: 0,
    completedDates: [],
    createdAt: '2026-10-01',
  },
  {
    id: 'habit_seed_2',
    title: 'Membaca Buku 15 Menit',
    emoji: '📖',
    is_completed: false,
    created_at: '2026-10-01',
    streak: 0,
    completedDates: [],
    createdAt: '2026-10-01',
  },
  {
    id: 'habit_seed_3',
    title: 'Olahraga Ringan / Jalan Kaki',
    emoji: '🏃',
    is_completed: false,
    created_at: '2026-10-01',
    streak: 0,
    completedDates: [],
    createdAt: '2026-10-01',
  },
];
