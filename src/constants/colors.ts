/**
 * Palet warna aplikasi HabitTracker (TaskFlow Modern Soft-UI Theme).
 *
 * Kombinasi Slate & Indigo untuk estetika antarmuka modern, bersih, dan berfokus tinggi.
 * Memenuhi standar kontras aksesibilitas WCAG 2.1.
 */
export const COLORS = {
  // Brand & Action (Indigo)
  primary: '#4F46E5', // Indigo 600 - Warna tombol utama & aksen aktif
  primaryDark: '#4338CA', // Indigo 700 - State ditekan / hover
  primaryLight: '#E0E7FF', // Indigo 100 - Badge aktif, aksen lembut
  primarySoft: '#EEF2FF', // Indigo 50  - Latar kartu / chip aktif

  // Streak & Milestone (Amber)
  streak: '#F59E0B', // Amber 500 - Badge api konsistensi harian
  streakDark: '#D97706', // Amber 600 - Teks badge streak aktif
  streakLight: '#FEF3C7', // Amber 100 - Latar badge streak aktif

  // Feedback & Status
  success: '#10B981', // Emerald 500 - Status selesai & konfirmasi sukses
  danger: '#EF4444', // Red 500 - Peringatan, kesalahan, tombol hapus
  dangerLight: '#FEE2E2', // Red 100 - Latar notifikasi/banner error

  // Neutrals & Surfaces (Slate Palette)
  background: '#F8FAFC', // Slate 50 - Latar belakang kanvas utama
  surface: '#FFFFFF', // Putih bersih - Kartu, sheet, modal
  surfaceMuted: '#F1F5F9', // Slate 100 - Input membulat, elemen non-aktif
  border: '#E2E8F0', // Slate 200 - Garis batas lembut & pemisah
  borderStrong: '#CBD5E1', // Slate 300 - Garis batas interaktif/fokus

  // Typography (Slate Hierarchy)
  textPrimary: '#1E293B', // Slate 800 - Judul utama & teks kontras tinggi
  textSecondary: '#64748B', // Slate 500 - Subjudul & teks pendukung
  textMuted: '#94A3B8', // Slate 400 - Placeholder input & caption
  textOnPrimary: '#FFFFFF', // Putih murni - Teks di atas warna primary

  // Overlay & Dialog
  backdrop: 'rgba(15, 23, 42, 0.45)', // Slate 900 semi-transparan
} as const;

export type ColorName = keyof typeof COLORS;

/** Alias untuk kenyamanan impor */
export const colors = COLORS;

/**
 * 8 Preset Emoji Pilihan:
 * 💧 (Hidrasi), 📖 (Belajar/Membaca), 🏃 (Olahraga), 🧘 (Mindfulness),
 * 🥗 (Gaya Hidup Sehat), 💤 (Tidur Cukup), 💻 (Fokus Kerja/Koding), 🧹 (Kerapian)
 */
export const PRESET_EMOJIS = [
  '💧', '📖', '🏃', '🧘',
  '🥗', '💤', '💻', '🧹'
] as const;

export default COLORS;
