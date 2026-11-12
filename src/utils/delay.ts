/**
 * Custom Promise utility untuk menunda eksekusi secara asynchronous.
 * Sesuai dengan spesifikasi Modul 3 Praktikum Pemrograman Mobile (Halaman 20).
 *
 * @param ms - Durasi penundaan dalam milidetik (milliseconds)
 * @returns Promise<void> yang selesai setelah waktu tunggu habis
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

