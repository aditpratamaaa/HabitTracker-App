/**
 * Model data utama untuk satu kebiasaan (habit).
 * Selaras dengan skema tabel Supabase `habits`:
 * - id: string
 * - title: string
 * - emoji: string
 * - is_completed: boolean
 * - created_at: string
 */
export interface Habit {
  /** ID unik (UUID atau text dari database Supabase) */
  id: string;
  /** Judul atau nama kebiasaan */
  title: string;
  /** Ikon visual emoji */
  emoji: string;
  /** Status penyelesaian kebiasaan */
  is_completed: boolean;
  /** Waktu pembuatan data (ISO timestamp string) */
  created_at: string;

  /**
   * Properti pembantu UI / kompatibilitas TaskFlow Soft-UI
   * (Opsional untuk mendukung tampilan streak dan progress harian tanpa mengubah kode komponen UI)
   */
  streak?: number | any;
  completedDates?: string[];
  createdAt?: string;
}
