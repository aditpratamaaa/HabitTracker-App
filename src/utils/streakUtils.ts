import type { Habit } from '../constants/types';
import { addDays, getTodayString } from './dateUtils';


/** Ringkasan kemajuan harian untuk kartu progres. */
export interface DailyProgress {
  total: number;
  completed: number;
  /** 0–100, dibulatkan */
  percentage: number;
}

/**
 * Menghitung jumlah hari berturut-turut (streak) yang diselesaikan.
 *
 * Aturan:
 * - Hari ini selesai      → hitung mundur mulai dari hari ini.
 * - Hari ini BELUM selesai, tapi kemarin selesai → streak tetap aman,
 *   hitung mundur mulai dari kemarin (pengguna masih punya waktu hari ini).
 * - Hari ini & kemarin sama-sama tidak selesai → streak putus (0).
 *
 * Contoh (hari ini 15 Okt):
 *   [13, 14, 15] → 3   |   [13, 14] → 2   |   [12, 13] → 0
 */
export function calculateStreak(
  completedDates: readonly string[],
  todayStr: string = getTodayString()
): number {
  if (completedDates.length === 0) return 0;

  const done = new Set(completedDates);
  const yesterdayStr = addDays(todayStr, -1);

  let cursor: string;
  if (done.has(todayStr)) {
    cursor = todayStr;
  } else if (done.has(yesterdayStr)) {
    cursor = yesterdayStr;
  } else {
    return 0;
  }

  // Setiap iterasi memakai tanggal berbeda dari Set, jadi pasti berhenti.
  let streak = 0;
  while (done.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

/** Apakah habit sudah dicentang pada tanggal tertentu. */
export function isCompletedOn(habit: Habit, dateStr: string): boolean {
  if (typeof habit.is_completed === 'boolean') {
    return habit.is_completed;
  }
  if (!Array.isArray(habit.completedDates)) return false;
  return habit.completedDates.includes(dateStr);
}


/**
 * Mengembalikan salinan habit dengan streak yang dihitung ulang.
 * Panggil setiap kali data dimuat atau hari berganti agar streak tidak basi.
 */
export function withFreshStreak(habit: Habit, todayStr: string = getTodayString()): Habit {
  const dates = Array.isArray(habit.completedDates) ? habit.completedDates : [];
  const streak = calculateStreak(dates, todayStr);
  return streak === habit.streak ? habit : { ...habit, streak };
}

/** Versi array dari `withFreshStreak`. */
export function refreshStreaks(habits: readonly Habit[], todayStr: string = getTodayString()): Habit[] {
  return habits.map((habit) => withFreshStreak(habit, todayStr));
}

/**
 * Centang / batal-centang habit pada `todayStr`, lalu hitung ulang streak.
 * Tidak memutasi objek asli (aman untuk state React).
 */
export function toggleHabitCompletion(habit: Habit, todayStr: string = getTodayString()): Habit {
  const dates = Array.isArray(habit.completedDates) ? habit.completedDates : [];
  const completedDates = isCompletedOn(habit, todayStr)
    ? dates.filter((date) => date !== todayStr)
    : [...dates, todayStr].sort();

  return {
    ...habit,
    completedDates,
    streak: calculateStreak(completedDates, todayStr),
  };
}


/** Statistik kemajuan hari ini: berapa dari total habit yang sudah selesai. */
export function getDailyProgress(
  habits: readonly Habit[],
  todayStr: string = getTodayString()
): DailyProgress {
  const total = habits.length;
  if (total === 0) return { total: 0, completed: 0, percentage: 0 };

  const completed = habits.filter((habit) => isCompletedOn(habit, todayStr)).length;
  return {
    total,
    completed,
    percentage: Math.round((completed / total) * 100),
  };
}

/**
 * Umpan balik motivasi psikologis berdasarkan capaian persentase
 */
export function getMotivationalProgressMessage(percentage: number): string {
  if (percentage === 0) {
    return 'Belum ada kebiasaan yang dicentang. Ayo mulai kebiasaan pertamamu!';
  } else if (percentage < 50) {
    return 'Langkah awal yang bagus! Selesaikan sisa targetmu hari ini.';
  } else if (percentage < 100) {
    return 'Hebat! Kamu sudah hampir menyelesaikan semua target!';
  } else {
    return 'Luar biasa! Semua target hari ini tuntas sempurna! 🎉';
  }
}

