/**
 * Palet warna resmi aplikasi HabitTracker berdasarkan TaskFlow Kinetic (Stitch Design System).
 *
 * Menggabungkan Deep Indigo (#4F46E5), Dark Navy (#0F172A), Streak Amber (#F59E0B),
 * dan kanvas sejuk Slate (#F8FAFC) dengan standar kontras WCAG AAA/AA.
 */
export const COLORS = {
  // Brand & Action (Deep Indigo)
  primary: '#4F46E5', // Indigo 600 - Tombol utama, hero progress fill
  primaryDark: '#3525CD', // Deep Indigo - State ditekan / active
  primaryLight: '#E0E7FF', // Indigo 100 - Aksen lembut
  primarySoft: '#EEF2FF', // Indigo 50  - Latar chip aktif
  primaryContainer: '#4F46E5',
  onPrimary: '#FFFFFF',

  // Dark Navy Curved Header & Accents (Stitch Feature)
  navyHeader: '#0F172A', // Slate 900 - Curved header atas beranda & status bar
  navyMuted: '#1E293B',
  navyBadge: 'rgba(30, 41, 59, 0.8)',

  // Streak & Milestone (Amber Flame)
  streak: '#F59E0B', // Amber 500 - Badge api konsistensi harian 🔥
  streakDark: '#D97706', // Amber 600
  streakLight: '#FEF3C7', // Amber 100
  secondary: '#F59E0B',
  secondaryContainer: '#FEA619',
  onSecondaryContainer: '#684000',

  // Feedback & Status
  success: '#10B981', // Emerald 500 - Status selesai
  successLight: '#D1FAE5',
  danger: '#EF4444', // Red 500 - Peringatan, kesalahan, tombol hapus
  dangerLight: '#FEE2E2', // Red 100
  error: '#BA1A1A',

  // Neutrals & Soft-UI Surfaces
  background: '#F8FAFC', // Slate 50 - Latar belakang kanvas utama
  surface: '#FFFFFF', // Putih bersih - Kartu bento, sheet, modal
  surfaceDim: '#CFDAF2',
  surfaceContainerLow: '#F0F3FF', // Latar input lembut
  surfaceContainer: '#E7EEFF',
  surfaceContainerHigh: '#DEE8FF',
  surfaceContainerHighest: '#D8E3FB',
  surfaceMuted: '#F1F5F9', // Slate 100

  // Garis batas (Borders)
  border: '#E2E8F0', // Slate 200 - Garis batas lembut
  borderStrong: '#CBD5E1', // Slate 300 - Border aktif

  // Typography Hierarchy
  textPrimary: '#1E293B', // Slate 800 / On-surface
  textSecondary: '#64748B', // Slate 500 - Subjudul & deskripsi
  textMuted: '#94A3B8', // Slate 400 - Placeholder input & caption
  textOnPrimary: '#FFFFFF', // Putih murni
  textOnNavy: '#FFFFFF',

  // Shadows & Overlays
  shadowSoft: 'rgba(79, 70, 229, 0.08)',
  shadowCard: 'rgba(15, 23, 42, 0.05)',
  backdrop: 'rgba(15, 23, 42, 0.55)',
} as const;

export type ColorName = keyof typeof COLORS;
export const colors = COLORS;

/**
 * Preset Emoji untuk pemilihan kategori kebiasaan
 */
export const PRESET_EMOJIS = [
  '💧', '📖', '🏃', '🧘',
  '🥗', '💤', '💻', '🧹',
  '🎯', '🏋️', '🍎', '✨'
] as const;

export default COLORS;
