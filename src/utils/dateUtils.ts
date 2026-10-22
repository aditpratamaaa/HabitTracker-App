/**
 * Utilitas tanggal berbasis zona waktu LOKAL perangkat.
 *
 * Semua tanggal direpresentasikan sebagai string "YYYY-MM-DD".
 *
 * PENTING: jangan menyimpan hasil `getTodayString()` di level modul
 * (mis. `const TODAY = getTodayString()`), karena nilainya akan "membeku"
 * sejak modul pertama kali dimuat dan menjadi salah setelah lewat tengah
 * malam. Selalu panggil fungsinya tepat saat nilainya dibutuhkan.
 */

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Menambahkan nol di depan angka satu digit: 5 -> "05", 12 -> "12" */
function pad2(value: number): string {
  return `0${value}`.slice(-2);
}

/**
 * Mengubah objek Date menjadi "YYYY-MM-DD" berdasarkan waktu lokal.
 * Sengaja tidak memakai toISOString() karena hasilnya UTC — di WIB (UTC+7)
 * jam 00:00–06:59 akan terbaca sebagai tanggal kemarin.
 */
export function toDateString(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

/** Tanggal hari ini ("YYYY-MM-DD"), dihitung ulang setiap kali dipanggil. */
export function getTodayString(): string {
  try {
    return toDateString(new Date());
  } catch {
    const d = new Date();
    const m = `0${d.getMonth() + 1}`.slice(-2);
    const day = `0${d.getDate()}`.slice(-2);
    return `${d.getFullYear()}-${m}-${day}`;
  }
}

/** Alias kompatibilitas untuk kode/cache lama */
export const getLocalDateString = getTodayString;
export default getTodayString;


/**
 * Mengubah "YYYY-MM-DD" menjadi Date lokal pada pukul 12:00 siang.
 * Jam 12 dipakai agar aman dari pergeseran DST yang terjadi di sekitar
 * tengah malam di beberapa zona waktu.
 */
export function parseDateString(dateStr: string): Date {
  const year = Number(dateStr.slice(0, 4));
  const month = Number(dateStr.slice(5, 7));
  const day = Number(dateStr.slice(8, 10));
  return new Date(year, month - 1, day, 12);
}

/** Validasi format "YYYY-MM-DD" sekaligus tanggal yang benar-benar ada (menolak 2026-02-30). */
export function isValidDateString(value: string): boolean {
  if (!DATE_PATTERN.test(value)) return false;
  return toDateString(parseDateString(value)) === value;
}

/** Menggeser tanggal sebanyak `amount` hari (boleh negatif). */
export function addDays(dateStr: string, amount: number): string {
  const date = parseDateString(dateStr);
  date.setDate(date.getDate() + amount);
  return toDateString(date);
}

/**
 * Tanggal sehari sebelum `fromDateStr`.
 * Default parameter dievaluasi saat fungsi dipanggil, jadi tetap dinamis.
 */
export function getYesterdayString(fromDateStr: string = getTodayString()): string {
  return addDays(fromDateStr, -1);
}

/**
 * Sisa milidetik hingga pukul 00:00 berikutnya.
 * Dipakai untuk memasang timer agar `todayStr` di UI diperbarui tepat
 * saat pergantian hari, walaupun aplikasi tetap terbuka.
 */
export function getMsUntilNextMidnight(now: Date = new Date()): number {
  const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return nextMidnight.getTime() - now.getTime();
}

/**
 * Format tanggal ramah pengguna untuk header bahasa Indonesia
 * Contoh: "Kamis, 15 Oktober 2026"
 */
export function getFormattedHeaderDate(date: Date = new Date()): string {
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const dayName = dayNames[date.getDay()];
  const dayNum = date.getDate();
  const monthName = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${dayName}, ${dayNum} ${monthName} ${year}`;
}

/**
 * Mengembalikan salam penyemangat dinamis berdasarkan jam lokal
 */
export function getGreetingText(date: Date = new Date()): { greeting: string; motivationalText: string } {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const timeInMinutes = hour * 60 + minute;

  // 04:00 - 10:59: "Selamat Pagi 🌅"
  if (timeInMinutes >= 4 * 60 && timeInMinutes < 11 * 60) {
    return {
      greeting: 'Selamat Pagi 🌅',
      motivationalText: 'Awali harimu dengan langkah kecil penuh konsistensi!',
    };
  }
  // 11:00 - 14:59: "Selamat Siang ☀️"
  else if (timeInMinutes >= 11 * 60 && timeInMinutes < 15 * 60) {
    return {
      greeting: 'Selamat Siang ☀️',
      motivationalText: 'Tetap jaga fokus dan energi positifmu siang ini.',
    };
  }
  // 15:00 - 18:29: "Selamat Sore 🌤️"
  else if (timeInMinutes >= 15 * 60 && timeInMinutes < 18 * 60 + 30) {
    return {
      greeting: 'Selamat Sore 🌤️',
      motivationalText: 'Sore yang menyenangkan untuk menuntaskan resolusimu.',
    };
  }
  // 18:30 - 03:59: "Selamat Malam 🌙"
  else {
    return {
      greeting: 'Selamat Malam 🌙',
      motivationalText: 'Evaluasi pencapaian hari ini dan istirahatlah dengan bangga.',
    };
  }
}

