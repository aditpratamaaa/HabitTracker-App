import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppState, type AppStateStatus, LayoutAnimation } from 'react-native';

import type { Habit } from '../constants/types';
import { useAuth } from './AuthContext';
import {
  generateHabitId,
  initializeHabits,
  saveHabits,
} from '../storage/habitStorage';
import { getTodayString } from '../utils/dateUtils';
import { calculateStreak, type DailyProgress } from '../utils/streakUtils';
import {
  isSupabaseConfigured,
  requireSupabaseConfiguration,
  supabase,
} from '../utils/supabase';

export type AddHabitInput = string | { title: string; emoji?: string; icon?: string };

function toHabit(row: Record<string, unknown>): Habit {
  const today = getTodayString();
  return {
    id: String(row.id),
    title: typeof row.title === 'string' ? row.title : '',
    emoji: typeof row.emoji === 'string' ? row.emoji : '🎯',
    is_completed: Boolean(row.is_completed),
    created_at: typeof row.created_at === 'string' ? row.created_at : today,
    streak: Boolean(row.is_completed) ? 1 : 0,
    completedDates: Boolean(row.is_completed) ? [today] : [],
  };
}

export function useHabits() {
  const { user, freezeTickets, consumeFreezeTicket } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [todayStr, setTodayStr] = useState(getTodayString);

  const isDemo = user?.id === 'demo-user-id' || !isSupabaseConfigured;

  const fetchHabits = useCallback(async () => {
    if (!user) {
      setHabits([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Mode Demo / Penyimpanan Lokal jika akun demo atau Supabase belum diatur
    if (user.id === 'demo-user-id' || !isSupabaseConfigured) {
      try {
        const localHabits = await initializeHabits(todayStr);
        setHabits(localHabits);
      } catch (err) {
        console.warn('Gagal memuat kebiasaan lokal:', err);
        setError('Gagal memuat data kebiasaan lokal.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    try {
      requireSupabaseConfiguration();
      const { data, error: queryError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (queryError) throw queryError;
      setHabits((data ?? []).map((row) => toHabit(row)));
    } catch (cause) {
      setHabits([]);
      setError(
        cause instanceof Error
          ? cause.message
          : 'Gagal memuat kebiasaan. Periksa koneksi internet lalu coba lagi.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [todayStr, user]);

  useEffect(() => {
    // Jadwalkan request setelah render pertama agar tidak memicu cascading render.
    const task = setTimeout(() => {
      void fetchHabits();
    }, 0);
    return () => clearTimeout(task);
  }, [fetchHabits]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') {
        setTodayStr(getTodayString());
        void fetchHabits();
      }
    });
    return () => subscription.remove();
  }, [fetchHabits]);

  const progress: DailyProgress = useMemo(() => {
    const completed = habits.filter((habit) => habit.is_completed).length;
    return {
      total: habits.length,
      completed,
      percentage: habits.length === 0 ? 0 : Math.round((completed / habits.length) * 100),
    };
  }, [habits]);

  const toggleHabit = useCallback(
    async (habitId: string) => {
      if (!user) return;
      const before = habits;
      const target = before.find((habit) => habit.id === habitId);
      if (!target) return;

      const is_completed = !target.is_completed;
      const dates = Array.isArray(target.completedDates) ? target.completedDates : [];
      const completedDates = is_completed
        ? [...dates.filter((d) => d !== todayStr), todayStr].sort()
        : dates.filter((d) => d !== todayStr);
      const { streak, freezeUsed } = calculateStreak(completedDates, todayStr, freezeTickets);
      if (freezeUsed) {
        void consumeFreezeTicket();
      }

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      const nextHabits = before.map((habit) =>
        habit.id === habitId
          ? { ...habit, is_completed, streak, completedDates }
          : habit
      );
      setHabits(nextHabits);

      // Mode Demo / Penyimpanan Lokal
      if (user.id === 'demo-user-id' || !isSupabaseConfigured) {
        try {
          await saveHabits(nextHabits);
        } catch (err) {
          console.warn('Gagal menyimpan perubahan kebiasaan lokal:', err);
          setHabits(before);
        }
        return;
      }

      // Mode Supabase
      const { error: updateError } = await supabase
        .from('habits')
        .update({ is_completed })
        .eq('id', habitId)
        .eq('user_id', user.id);

      if (updateError) {
        setHabits(before);
        setError(updateError.message);
      }
    },
    [consumeFreezeTicket, freezeTickets, habits, todayStr, user]
  );

  const addHabit = useCallback(
    async (input: AddHabitInput, optionalEmoji?: string) => {
      if (!user) return;
      const title = (typeof input === 'string' ? input : input.title).trim();
      if (!title) {
        setError('Nama kebiasaan tidak boleh kosong.');
        return;
      }

      const emoji =
        typeof input === 'string'
          ? optionalEmoji ?? '🎯'
          : input.emoji ?? input.icon ?? optionalEmoji ?? '🎯';

      // Mode Demo / Penyimpanan Lokal
      if (user.id === 'demo-user-id' || !isSupabaseConfigured) {
        const newHabit: Habit = {
          id: generateHabitId(),
          title,
          emoji,
          is_completed: false,
          created_at: todayStr,
          streak: 0,
          completedDates: [],
        };
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const next = [newHabit, ...habits];
        setHabits(next);
        try {
          await saveHabits(next);
        } catch (err) {
          console.warn('Gagal menyimpan kebiasaan baru lokal:', err);
        }
        return;
      }

      // Mode Supabase
      const { data, error: insertError } = await supabase
        .from('habits')
        .insert({ user_id: user.id, title, emoji, is_completed: false })
        .select()
        .single();

      if (insertError) {
        setError(insertError.message);
        return;
      }

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setHabits((current) => [toHabit(data), ...current]);
    },
    [habits, todayStr, user]
  );

  const deleteHabit = useCallback(
    async (habitId: string) => {
      if (!user) return;
      const before = habits;
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      const nextHabits = habits.filter((habit) => habit.id !== habitId);
      setHabits(nextHabits);

      // Mode Demo / Penyimpanan Lokal
      if (user.id === 'demo-user-id' || !isSupabaseConfigured) {
        try {
          await saveHabits(nextHabits);
        } catch (err) {
          console.warn('Gagal menghapus kebiasaan lokal:', err);
          setHabits(before);
        }
        return;
      }

      // Mode Supabase
      const { error: deleteError } = await supabase
        .from('habits')
        .delete()
        .eq('id', habitId)
        .eq('user_id', user.id);

      if (deleteError) {
        setHabits(before);
        setError(deleteError.message);
      }
    },
    [habits, user]
  );

  return {
    habits,
    isLoading,
    error,
    todayStr,
    progress,
    isDemo,
    toggleHabit,
    addHabit,
    deleteHabit,
    refreshHabits: fetchHabits,
    freezeTickets,
  };
}

