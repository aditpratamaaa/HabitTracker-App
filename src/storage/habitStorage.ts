import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_HABITS } from '../constants/defaultHabits';
import type { Habit } from '../constants/types';
import { getTodayString, isValidDateString } from '../utils/dateUtils';
import { refreshStreaks } from '../utils/streakUtils';


/** Key untuk skema data baru (field `emoji` + `streak`). */
export const STORAGE_KEY = '@habittracker/habits_v2';

/** Key versi lama (field `icon`, tanpa `streak`) — hanya dibaca untuk migrasi. */
const LEGACY_STORAGE_KEY = '@habittracker_data_v1';

/** Membuat ID unik untuk habit baru. Memakai .slice(), bukan .substr() yang deprecated. */
export function generateHabitId(): string {
  return `habit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Memvalidasi & merapikan satu item mentah dari storage.
 * Mendukung data lama (`icon` → `emoji`). Item rusak dibuang (return null).
 */
function normalizeHabit(raw: unknown): Habit | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const item = raw as Record<string, unknown>;

  if (typeof item.id !== 'string' || typeof item.title !== 'string') return null;

  const emoji =
    typeof item.emoji === 'string' ? item.emoji : typeof item.icon === 'string' ? item.icon : '🎯';

  const completedDates = Array.isArray(item.completedDates)
    ? [
        ...new Set(
          item.completedDates.filter(
            (date): date is string => typeof date === 'string' && isValidDateString(date)
          )
        ),
      ].sort()
    : [];

  const createdAt =
    typeof item.createdAt === 'string' && isValidDateString(item.createdAt)
      ? item.createdAt
      : getTodayString();

  // streak diisi 0 dulu; dihitung ulang oleh refreshStreaks()
  return {
    id: item.id,
    title: item.title,
    emoji,
    is_completed: typeof item.is_completed === 'boolean' ? item.is_completed : false,
    created_at: typeof item.created_at === 'string' ? item.created_at : createdAt,
    streak: 0,
    completedDates,
    createdAt,
  };
}

/**
 * Membaca & mem-parse daftar habit dari sebuah key.
 * - Key belum ada         → null
 * - JSON rusak/bukan array → null (dengan peringatan)
 * - Gagal I/O AsyncStorage → error dilempar (JANGAN ditimpa data default)
 */
async function readHabitList(key: string): Promise<Habit[] | null> {
  const raw = await AsyncStorage.getItem(key);
  if (raw === null) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.warn(`[habitStorage] Data di "${key}" bukan array, diabaikan.`);
      return null;
    }
    return parsed.map(normalizeHabit).filter((habit): habit is Habit => habit !== null);
  } catch (error) {
    console.warn(`[habitStorage] Data di "${key}" rusak (JSON tidak valid), diabaikan.`, error);
    return null;
  }
}

/** Salinan data seed agar array konstanta tidak ikut termutasi. */
function cloneDefaultHabits(): Habit[] {
  return DEFAULT_HABITS.map((habit) => ({
    ...habit,
    completedDates: Array.isArray(habit.completedDates) ? [...habit.completedDates] : [],
  }));
}

/**
 * Memuat daftar habit dari storage dengan streak yang sudah dihitung ulang.
 *
 * @returns `null` jika storage belum pernah diisi (beda dengan `[]`, yang
 *          berarti pengguna memang sudah menghapus semua habit).
 */
export async function loadHabits(todayStr: string = getTodayString()): Promise<Habit[] | null> {
  const habits = await readHabitList(STORAGE_KEY);
  return habits === null ? null : refreshStreaks(habits, todayStr);
}

/** Menyimpan seluruh daftar habit. Error dilempar agar pemanggil bisa menanganinya. */
export async function saveHabits(habits: readonly Habit[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

/**
 * Titik masuk saat aplikasi dibuka:
 * 1. Jika data v2 sudah ada → kembalikan data itu.
 * 2. Jika belum, tapi ada data versi lama → migrasikan ke v2.
 * 3. Jika storage benar-benar kosong → isi dengan DEFAULT_HABITS.
 *
 * Data lama di LEGACY_STORAGE_KEY tidak dihapus (aman untuk rollback).
 */
export async function initializeHabits(todayStr: string = getTodayString()): Promise<Habit[]> {
  try {
    const stored = await loadHabits(todayStr);
    if (stored !== null) return stored;

    const legacy = await readHabitList(LEGACY_STORAGE_KEY);
    const initial = refreshStreaks(legacy ?? cloneDefaultHabits(), todayStr);

    await saveHabits(initial);
    return initial;
  } catch (error) {
    console.warn('[habitStorage] Gagal akses AsyncStorage, menggunakan default habits:', error);
    return refreshStreaks(cloneDefaultHabits(), todayStr);
  }
}


/** Menghapus data v2 (untuk debugging). Pembukaan berikutnya akan seed ulang. */
export async function clearHabits(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
