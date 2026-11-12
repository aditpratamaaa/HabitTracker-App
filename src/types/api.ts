/**
 * Generic Interface untuk membungkus struktur standar response API
 * Sesuai dengan spesifikasi Modul 3 Praktikum Pemrograman Mobile (Halaman 20).
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

