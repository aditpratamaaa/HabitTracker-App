import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit } from '../types/habit';
import { DEFAULT_HABITS } from '../constants/defaultHabits';

const STORAGE_KEY = '@habittracker_data_v1';

/**
 * Membaca data kebiasaan dari memori lokal perangkat.
 * Jika belum ada data (pertama kali buka), kembalikan data seed default.
 */
export async function getStoredHabits(): Promise<Habit[]> {
  try {
    const rawData = await AsyncStorage.getItem(STORAGE_KEY);
    if (!rawData) {
      // Seed data awal jika baru pertama kali dipasang
      await saveStoredHabits(DEFAULT_HABITS);
      return DEFAULT_HABITS;
    }
    const parsed: Habit[] = JSON.parse(rawData);
    return Array.isArray(parsed) ? parsed : DEFAULT_HABITS;
  } catch (error) {
    console.error('Gagal membaca data dari AsyncStorage:', error);
    return DEFAULT_HABITS;
  }
}

/**
 * Menyimpan seluruh data kebiasaan ke memori lokal perangkat.
 */
export async function saveStoredHabits(habits: Habit[]): Promise<void> {
  try {
    const rawData = JSON.stringify(habits);
    await AsyncStorage.setItem(STORAGE_KEY, rawData);
  } catch (error) {
    console.error('Gagal menyimpan data ke AsyncStorage:', error);
    throw error;
  }
}

/**
 * Mereset data penyimpanan kembali ke awal (untuk kebutuhan debugging/pengujian)
 */
export async function clearStoredHabits(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Gagal mereset AsyncStorage:', error);
  }
}
