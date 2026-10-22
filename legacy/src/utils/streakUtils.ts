import { Habit, DayOverviewStats } from '../types/habit';
import { getLocalDateString, getYesterdayDateString } from './dateUtils';

/**
 * Memeriksa apakah habit selesai pada tanggal tertentu
 */
export function isCompletedOnDate(completedDates: string[], dateString: string): boolean {
  return completedDates.includes(dateString);
}

/**
 * Menghitung runtutan hari berturut-turut (Streak) tanpa terputus
 * Logika:
 * - Jika hari ini selesai: streak minimal 1, lalu telusuri mundur (kemarin, kemarin lusa, dst)
 * - Jika hari ini belum selesai: periksa kemarin. Jika kemarin selesai, streak dipertahankan hingga kemarin. Jika tidak, streak = 0.
 */
export function calculateStreak(completedDates: string[], referenceDate: Date = new Date()): number {
  if (!completedDates || completedDates.length === 0) {
    return 0;
  }

  const todayStr = getLocalDateString(referenceDate);
  const yesterdayStr = getYesterdayDateString(referenceDate);

  const completedToday = completedDates.includes(todayStr);
  const completedYesterday = completedDates.includes(yesterdayStr);

  // Jika hari ini belum selesai dan kemarin juga tidak selesai, maka rantai konsistensi putus
  if (!completedToday && !completedYesterday) {
    return 0;
  }

  // Tentukan titik awal penelusuran mundur
  let count = 0;
  let checkDate = new Date(referenceDate);

  if (completedToday) {
    count = 1;
    // Mulai periksa dari hari kemarin
    checkDate.setDate(checkDate.getDate() - 1);
  } else {
    // Hari ini belum selesai, tapi kemarin selesai
    count = 1;
    // Mulai periksa dari 2 hari yang lalu
    checkDate.setDate(checkDate.getDate() - 2);
  }

  // Loop penelusuran mundur hari demi hari
  while (true) {
    const checkDateStr = getLocalDateString(checkDate);
    if (completedDates.includes(checkDateStr)) {
      count++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return count;
}

/**
 * Menghitung persentase dan ringkasan kepatuhan harian
 */
export function calculateDailyOverviewStats(
  habits: Habit[],
  dateString: string = getLocalDateString()
): DayOverviewStats {
  const totalHabits = habits.length;
  if (totalHabits === 0) {
    return {
      totalHabits: 0,
      completedTodayCount: 0,
      percentage: 0,
    };
  }

  const completedTodayCount = habits.filter((h) =>
    h.completedDates.includes(dateString)
  ).length;

  const percentage = Math.round((completedTodayCount / totalHabits) * 100);

  return {
    totalHabits,
    completedTodayCount,
    percentage,
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
