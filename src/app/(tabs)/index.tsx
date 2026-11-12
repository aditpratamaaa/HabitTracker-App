import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AddHabitModal } from '../../components/AddHabitModal';
import { EmptyState } from '../../components/EmptyState';
import { HabitCard } from '../../components/HabitCard';
import { HeaderOverview } from '../../components/HeaderOverview';
import { MotivationCard } from '../../components/MotivationCard';
import { ProgressCard } from '../../components/ProgressCard';
import { COLORS } from '../../constants/colors';
import type { Habit } from '../../constants/types';
import { useAuth } from '../../hooks/AuthContext';
import { initializeHabits } from '../../storage/habitStorage';
import { getTodayString } from '../../utils/dateUtils';
import { calculateStreak } from '../../utils/streakUtils';
import { isSupabaseConfigured, supabase } from '../../utils/supabase';

function mapSupabaseRowToHabit(row: Record<string, unknown>, todayStr: string): Habit {
  const isCompleted = Boolean(row.is_completed);
  return {
    id: String(row.id),
    title: typeof row.title === 'string' ? row.title : 'Kebiasaan Baru',
    emoji: typeof row.emoji === 'string' ? row.emoji : '🎯',
    is_completed: isCompleted,
    created_at: typeof row.created_at === 'string' ? row.created_at : todayStr,
    streak: isCompleted ? 1 : 0,
    completedDates: isCompleted ? [todayStr] : [],
  };
}

export default function HomeScreen() {
  const { user, isDemoUser, freezeTickets, consumeFreezeTicket } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const todayStr = getTodayString();

  /**
   * Fetch GET data kebiasaan langsung dari Supabase
   */
  const fetchHabits = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!isSupabaseConfigured || isDemoUser) {
        const localHabits = await initializeHabits(todayStr);
        setHabits(localHabits);
        return;
      }

      // REST API GET ke Supabase
      const { data, error: queryError } = await supabase
        .from('habits')
        .select('*')
        .order('created_at', { ascending: false });

      if (queryError) throw queryError;

      const mapped = (data ?? []).map((row) => mapSupabaseRowToHabit(row, todayStr));
      setHabits(mapped);
    } catch (err: unknown) {
      console.error('Error fetching habits from Supabase:', err);
      const message =
        err instanceof Error
          ? err.message
          : 'Gagal memuat kebiasaan. Periksa koneksi internet lalu coba lagi.';
      setError(message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [isDemoUser, todayStr]);

  // Eksekusi Fetch saat layar pertama kali dibuka
  useEffect(() => {
    const task = setTimeout(() => {
      void fetchHabits();
    }, 0);
    return () => clearTimeout(task);
  }, [fetchHabits]);

  // Pull-to-refresh
  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchHabits();
  }, [fetchHabits]);

  // Operasi Toggle Selesai/Belum (UPDATE Supabase)
  const handleToggleHabit = async (habitId: string) => {
    const target = habits.find((h) => h.id === habitId);
    if (!target) return;

    const nextCompleted = !target.is_completed;
    const dates = Array.isArray(target.completedDates) ? target.completedDates : [];
    const nextDates = nextCompleted
      ? Array.from(new Set([...dates, todayStr])).sort()
      : dates.filter((d) => d !== todayStr);

    const { streak, freezeUsed } = calculateStreak(nextDates, todayStr, freezeTickets);
    if (freezeUsed) {
      void consumeFreezeTicket();
    }

    // Optimistic UI Update untuk respon instan
    setHabits((prev) =>
      prev.map((h) =>
        h.id === habitId
          ? {
              ...h,
              is_completed: nextCompleted,
              streak,
              completedDates: nextDates,
            }
          : h
      )
    );

    if (isSupabaseConfigured && !isDemoUser) {
      const { error: updateError } = await supabase
        .from('habits')
        .update({ is_completed: nextCompleted })
        .eq('id', habitId);

      if (updateError) {
        Alert.alert('Gagal Memperbarui', updateError.message);
        void fetchHabits();
      }
    }
  };

  // Operasi Tambah Habit Baru (INSERT Supabase)
  const handleAddHabit = async (input: { title: string; emoji?: string } | string) => {
    const title = typeof input === 'string' ? input.trim() : input.title.trim();
    const emoji = typeof input === 'object' && input.emoji ? input.emoji : '🎯';

    if (!title) return;

    if (isSupabaseConfigured && !isDemoUser && user?.id) {
      const { data, error: insertError } = await supabase
        .from('habits')
        .insert([{ title, emoji, is_completed: false, user_id: user.id }])
        .select();

      if (insertError) {
        Alert.alert('Gagal Menambah Kebiasaan', insertError.message);
        return;
      }

      if (data && data.length > 0) {
        const created = mapSupabaseRowToHabit(data[0], todayStr);
        setHabits((prev) => [created, ...prev]);
      }
    } else {
      const newHabit: Habit = {
        id: Date.now().toString(),
        title,
        emoji,
        is_completed: false,
        created_at: todayStr,
        streak: 0,
        completedDates: [],
      };
      setHabits((prev) => [newHabit, ...prev]);
    }

    setIsModalOpen(false);
  };

  // Operasi Hapus Habit (DELETE Supabase)
  const handleDeleteHabit = async (habitId: string) => {
    const prevHabits = [...habits];
    setHabits((prev) => prev.filter((h) => h.id !== habitId));

    if (isSupabaseConfigured && !isDemoUser) {
      const { error: deleteError } = await supabase
        .from('habits')
        .delete()
        .eq('id', habitId);

      if (deleteError) {
        Alert.alert('Gagal Menghapus Kebiasaan', deleteError.message);
        setHabits(prevHabits);
      }
    }
  };

  const total = habits.length;
  const completed = habits.filter((h) => h.is_completed).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const progress = { completed, total, percentage };

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Memuat kebiasaan dari Supabase...</Text>
        </View>
      ) : (
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                colors={[COLORS.primary]}
                tintColor={COLORS.primary}
              />
            }
          >
            {/* 1. Curved Dark Navy Header (Stitch Feature) */}
            <HeaderOverview />

            {/* 2. Daily Progress Hero Card (Melayang di atas curved header) */}
            <ProgressCard progress={progress} />

            {/* 3. Kartu Motivasi Harian Asynchronous (Modul 3: External Public REST API) */}
            <MotivationCard />

            {/* Error Banner jika offline / server error */}
            {error ? (
              <View style={styles.errorState}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
                <Pressable onPress={() => void fetchHabits()} style={styles.retryButton}>
                  <Text style={styles.retryButtonText}>Coba Lagi</Text>
                </Pressable>
              </View>
            ) : null}

            {/* 3. Section Header "Today's Habits" */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{"Today's Habits"}</Text>
              <View style={styles.totalBadge}>
                <Text style={styles.totalBadgeText}>{habits.length} Total</Text>
              </View>
            </View>

            {/* 4. Daftar Kartu Kebiasaan */}
            {habits.length === 0 ? (
              <EmptyState />
            ) : (
              habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  todayStr={todayStr}
                  onToggle={handleToggleHabit}
                  onDelete={handleDeleteHabit}
                />
              ))
            )}

            {/* Spacer untuk memberi ruang pada Floating TabBar */}
            <View style={styles.bottomSpacer} />
          </ScrollView>

          {/* Floating Action Button (FAB +) */}
          <Pressable
            style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
            onPress={() => setIsModalOpen(true)}
            accessibilityRole="button"
            accessibilityLabel="Tambah Kebiasaan Baru"
          >
            <Text style={styles.fabIcon}>+</Text>
          </Pressable>

          {/* Modal Input Kebiasaan Baru */}
          <AddHabitModal
            visible={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleAddHabit}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.navyHeader, // Latar atas serasi dengan curved header
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // Latar konten Slate 50
    position: 'relative',
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  errorState: {
    marginHorizontal: 20,
    marginTop: 14,
    padding: 16,
    backgroundColor: COLORS.dangerLight,
    borderRadius: 16,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
  },
  retryButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: COLORS.danger,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    marginTop: 22,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B', // Slate 800
    letterSpacing: -0.3,
  },
  totalBadge: {
    backgroundColor: '#E2E8F0', // Slate 200
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  totalBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B', // Slate 500
  },
  bottomSpacer: {
    height: 110, // Spacer agar list item tidak tertutup floating bottom bar
  },
  fab: {
    position: 'absolute',
    bottom: 96, // Berada tepat di atas floating tab bar
    right: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.primary, // #4F46E5
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 8,
    zIndex: 40,
  },
  fabPressed: {
    backgroundColor: COLORS.primaryDark,
    transform: [{ scale: 0.94 }],
  },
  fabIcon: {
    fontSize: 32,
    color: '#FFFFFF',
    lineHeight: 34,
    fontWeight: '300',
  },
});
