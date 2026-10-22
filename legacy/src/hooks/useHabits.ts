import { useState, useEffect, useCallback, useMemo } from 'react';
import { Habit, DayOverviewStats, HabitFormData } from '../types/habit';
import { getStoredHabits, saveStoredHabits } from '../services/habitStorage';
import { getLocalDateString } from '../utils/dateUtils';
import { calculateDailyOverviewStats } from '../utils/streakUtils';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const todayStr = useMemo(() => getLocalDateString(), []);

  // Memuat data saat hook pertama kali dipasang
  useEffect(() => {
    let isMounted = true;
    getStoredHabits()
      .then((data) => {
        if (isMounted) {
          setHabits(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error saat load data habits:', err);
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Memuat ulang data secara manual
  const refreshHabits = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getStoredHabits();
      setHabits(data);
    } catch (err) {
      console.error('Error saat refresh data habits:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Statistik kepatuhan harian yang dihitung secara otomatis (reactive memo)
  const stats: DayOverviewStats = useMemo(() => {
    return calculateDailyOverviewStats(habits, todayStr);
  }, [habits, todayStr]);

  // Single-Tap Toggle: Menandai selesai atau membatalkan hari ini
  const toggleHabit = useCallback(
    async (habitId: string) => {
      const updated = habits.map((habit) => {
        if (habit.id !== habitId) return habit;

        const isCompleted = habit.completedDates.includes(todayStr);
        let newDates: string[];

        if (isCompleted) {
          // Pembatalan (uncheck)
          newDates = habit.completedDates.filter((d) => d !== todayStr);
        } else {
          // Penandaan selesai
          newDates = [...habit.completedDates, todayStr];
        }

        return {
          ...habit,
          completedDates: newDates,
        };
      });

      // Optimistic state update
      setHabits(updated);

      // Simpan ke storage lokal
      try {
        await saveStoredHabits(updated);
      } catch (err) {
        console.error('Gagal menyimpan perubahan centang:', err);
      }
    },
    [habits, todayStr]
  );

  // Menambahkan kebiasaan baru
  const addHabit = useCallback(
    async (formData: HabitFormData) => {
      const newHabit: Habit = {
        id: `habit_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        title: formData.title.trim(),
        icon: formData.icon || '🎯',
        createdAt: todayStr,
        completedDates: [],
      };

      const updated = [newHabit, ...habits];
      setHabits(updated);

      try {
        await saveStoredHabits(updated);
      } catch (err) {
        console.error('Gagal menyimpan habit baru:', err);
      }
    },
    [habits, todayStr]
  );

  // Menghapus kebiasaan yang tidak relevan
  const deleteHabit = useCallback(
    async (habitId: string) => {
      const updated = habits.filter((h) => h.id !== habitId);
      setHabits(updated);

      try {
        await saveStoredHabits(updated);
      } catch (err) {
        console.error('Gagal menghapus habit:', err);
      }
    },
    [habits]
  );

  return {
    habits,
    isLoading,
    todayStr,
    stats,
    toggleHabit,
    addHabit,
    deleteHabit,
    refreshHabits,
  };
}
