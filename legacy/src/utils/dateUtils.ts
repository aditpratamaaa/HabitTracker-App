/**
 * Mengembalikan string tanggal lokal perangkat dalam format YYYY-MM-DD
 * Mencegah pergeseran tanggal akibat UTC offset jika menggunakan toISOString()
 */
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Mengembalikan string tanggal kemarin dalam format YYYY-MM-DD
 */
export function getYesterdayDateString(date: Date = new Date()): string {
  const yesterday = new Date(date);
  yesterday.setDate(yesterday.getDate() - 1);
  return getLocalDateString(yesterday);
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
