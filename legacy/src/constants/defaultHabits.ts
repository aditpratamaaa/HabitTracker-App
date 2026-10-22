import { Habit } from '../types/habit';

/**
 * Fallback Data Awal (Seed Data) sesuai Spesifikasi 3.2:
 * Saat aplikasi pertama kali diinstal (clean install),
 * sistem menyuntikkan 3 contoh kebiasaan umum agar antarmuka tidak kosong:
 * 1. 💧 Minum 2 Liter Air
 * 2. 📖 Membaca Buku 15 Menit
 * 3. 🏃 Olahraga Ringan / Jalan Kaki
 */
export const DEFAULT_HABITS: Habit[] = [
  {
    id: 'habit_seed_1',
    title: 'Minum 2 Liter Air',
    icon: '💧',
    createdAt: '2026-10-01',
    completedDates: [],
    color: '#3B82F6',
  },
  {
    id: 'habit_seed_2',
    title: 'Membaca Buku 15 Menit',
    icon: '📖',
    createdAt: '2026-10-01',
    completedDates: [],
    color: '#8B5CF6',
  },
  {
    id: 'habit_seed_3',
    title: 'Olahraga Ringan / Jalan Kaki',
    icon: '🏃',
    createdAt: '2026-10-01',
    completedDates: [],
    color: '#10B981',
  },
];
