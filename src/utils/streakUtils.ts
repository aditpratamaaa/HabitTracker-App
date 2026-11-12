import type { Habit } from '../constants/types';
import { addDays, getTodayString } from './dateUtils';


/** Ringkasan kemajuan harian untuk kartu progres. */
export interface DailyProgress {
  total: number;
  completed: number;
  /** 0–100, dibulatkan */
  percentage: number;
}

/** Hasil kalkulasi streak dengan status penggunaan tiket freeze. */
export interface StreakResult {
  /** Jumlah hari berturut-turut (streak) */
  streak: number;
  /** Menandakan apakah 1 tiket freeze digunakan untuk melindungi streak kemarin */
  freezeUsed: boolean;
  /** Sisa tiket freeze yang tersedia setelah kalkulasi */
  remainingTickets: number;
}

/**
 * Menghitung jumlah hari berturut-turut (streak) yang diselesaikan dengan dukungan Tiket Freeze (❄️).
 *
 * Aturan Gamifikasi:
 * 1. Hari ini selesai:
 *    - Kemarin selesai → streak berlanjut normal.
 *    - Kemarin bolos, tapi freeze_tickets > 0 dan 2 hari lalu selesai:
 *      → Tiket freeze melindungi kemarin (freezeUsed = true), streak dari 2 hari lalu dipertahankan + hari ini!
 *    - Kemarin bolos dan tiket habis → streak reset menjadi 1 (hanya hari ini).
 * 2. Hari ini BELUM selesai:
 *    - Kemarin selesai → streak tetap aman, pengguna masih punya waktu hari ini.
 *    - Kemarin bolos:
 *      - freeze_tickets > 0 dan 2 hari lalu selesai:
 *        → Tiket freeze digunakan (freezeUsed = true), streak dipertahankan (tidak reset ke 0)!
 *      - freeze_tickets <= 0 atau streak memang putus sebelumnya:
 *        → Streak di-reset ke 0.
 */
export function calculateStreak(
  completedDates: readonly string[],
  todayStr: string = getTodayString(),
  freezeTickets: number = 0
): StreakResult {
  const safeTickets = Math.max(0, freezeTickets);
  const defaultResult: StreakResult = {
    streak: 0,
    freezeUsed: false,
    remainingTickets: safeTickets,
  };

  if (!completedDates || completedDates.length === 0) {
    return defaultResult;
  }

  const done = new Set(completedDates);
  const yesterdayStr = addDays(todayStr, -1);
  const twoDaysAgoStr = addDays(todayStr, -2);

  // KASUS 1: Hari ini dicentang
  if (done.has(todayStr)) {
    if (done.has(yesterdayStr)) {
      // Kemarin dicentang: streak beruntun normal
      let streak = 0;
      let cursor = todayStr;
      while (done.has(cursor)) {
        streak += 1;
        cursor = addDays(cursor, -1);
      }
      return { streak, freezeUsed: false, remainingTickets: safeTickets };
    } else if (safeTickets > 0 && done.has(twoDaysAgoStr)) {
      // Kemarin bolos, tetapi dilindungi 1 Tiket Freeze!
      let streak = 1; // Hari ini
      let cursor = twoDaysAgoStr;
      while (done.has(cursor)) {
        streak += 1;
        cursor = addDays(cursor, -1);
      }
      return {
        streak,
        freezeUsed: true,
        remainingTickets: safeTickets - 1,
      };
    } else {
      // Kemarin bolos dan tidak ada tiket freeze
      return { streak: 1, freezeUsed: false, remainingTickets: safeTickets };
    }
  }

  // KASUS 2: Hari ini BELUM dicentang
  if (done.has(yesterdayStr)) {
    // Kemarin selesai: streak aman (pengguna masih punya waktu hari ini)
    let streak = 0;
    let cursor = yesterdayStr;
    while (done.has(cursor)) {
      streak += 1;
      cursor = addDays(cursor, -1);
    }
    return { streak, freezeUsed: false, remainingTickets: safeTickets };
  } else if (safeTickets > 0 && done.has(twoDaysAgoStr)) {
    // Kemarin bolos, tetapi dilindungi 1 Tiket Freeze (Streak TIDAK di-reset ke 0!)
    let streak = 0;
    let cursor = twoDaysAgoStr;
    while (done.has(cursor)) {
      streak += 1;
      cursor = addDays(cursor, -1);
    }
    return {
      streak,
      freezeUsed: true,
      remainingTickets: safeTickets - 1,
    };
  }

  // Kemarin bolos dan tidak ada tiket freeze (atau 2 hari lalu juga tidak selesai)
  return defaultResult;
}

/** Helper untuk mendapatkan nilai numerik streak secara langsung */
export function getStreakCount(
  completedDates: readonly string[],
  todayStr: string = getTodayString(),
  freezeTickets: number = 0
): number {
  return calculateStreak(completedDates, todayStr, freezeTickets).streak;
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
 * Mengembalikan salinan habit dengan streak yang dihitung ulang dengan mempertimbangkan tiket freeze.
 */
export function withFreshStreak(
  habit: Habit,
  todayStr: string = getTodayString(),
  freezeTickets: number = 0
): Habit {
  const dates = Array.isArray(habit.completedDates) ? habit.completedDates : [];
  const { streak } = calculateStreak(dates, todayStr, freezeTickets);
  return streak === habit.streak ? habit : { ...habit, streak };
}

/** Versi array dari `withFreshStreak`. */
export function refreshStreaks(
  habits: readonly Habit[],
  todayStr: string = getTodayString(),
  freezeTickets: number = 0
): Habit[] {
  return habits.map((habit) => withFreshStreak(habit, todayStr, freezeTickets));
}

/**
 * Centang / batal-centang habit pada `todayStr`, lalu hitung ulang streak.
 * Tidak memutasi objek asli (aman untuk state React).
 */
export function toggleHabitCompletion(
  habit: Habit,
  todayStr: string = getTodayString(),
  freezeTickets: number = 0
): Habit {
  const dates = Array.isArray(habit.completedDates) ? habit.completedDates : [];
  const completedDates = isCompletedOn(habit, todayStr)
    ? dates.filter((date) => date !== todayStr)
    : [...dates, todayStr].sort();

  const { streak } = calculateStreak(completedDates, todayStr, freezeTickets);

  return {
    ...habit,
    completedDates,
    streak,
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

