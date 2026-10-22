# LAPORAN STATUS & KONDISI APLIKASI: HABITTRACKER-APP

**Mata Kuliah / Praktikum:** Pemrograman Mobile (Modul 1 & Modul 2)  
**Tahap Proyek:** Sprint 01 (Core & State), Sprint 02 (Secure App & Protected Routes), & Refactor TaskFlow Modern Soft-UI  
**Tanggal Pembaruan:** 17 Oktober 2026  
**Status Aplikasi:** 🟢 **Siap Produksi / *Production-Ready MVP + TaskFlow Soft-UI + Keystore Security***  
**Teknologi:** React Native 0.86.3, Expo SDK 57, React 19.2.3, Expo Router 57, TypeScript 6.0.3, Expo SecureStore 57, Expo Haptics 57  

---

## 1. Ringkasan Eksekutif

Aplikasi **HabitTracker-App** telah mencapai kematangan fungsional dan estetika penuh. Seluruh antarmuka telah berhasil diperbarui ke gaya desain **TaskFlow Modern Soft-UI** dengan palet warna Slate & Indigo, kartu bersudut melengkung halus, tipografi kontras tinggi, serta umpan balik taktil getaran (*Haptics*).

Struktur proyek juga telah disempurnakan dengan penambahan delegasi `package.json` di root workspace sehingga perintah `npm start`, `npm run android`, maupun `npm run web` dapat dieksekusi secara instan dari root maupun subfolder.

Hasil diagnosa otomatis:
- **TypeScript Compiler (`npx tsc --noEmit`):** 0 Error (Lulus 100%)
- **ESLint (`npx expo lint`):** 0 Warning, 0 Error (Lulus 100%)
- **Bundler Metro / Web:** Berhasil melakukan build dan bundle tanpa kendala (`Bundled successfully`).

---

## 2. Rincian Pembaruan UI/UX TaskFlow Modern Soft-UI

### A. Palet Warna Terpadu (`src/constants/colors.ts`)
- **Primary:** `#4F46E5` (Indigo) — tombol utama, kartu progres, dan status centang aktif.
- **Background:** `#F8FAFC` (Slate 50) — kanvas latar aplikasi yang bersih dan tidak melelahkan mata.
- **Surface:** `#FFFFFF` (Putih) — kartu kebiasaan, sheet modal, dan kontainer form login.
- **Typography:** `#1E293B` (Slate 800) untuk judul tebal dan `#64748B` (Slate 500) untuk subjudul/caption.
- **Streak & Feedback:** `#F59E0B` (Amber 500) untuk badge api konsistensi harian dan `#10B981` (Emerald 500) untuk status sukses.

### B. Layar Masuk (`src/app/login.tsx`)
- **Latar Belakang Putih:** Kontainer utama menggunakan `COLORS.surface` (`#FFFFFF`).
- **Header TaskFlow:** Sapaan tebal **"Welcome back!"** dengan subjudul **"Login to continue"**.
- **Input Form Lega:** Border abu-abu tipis presisi (1px), `borderRadius: 14`, padding horizontal 16px, dan latar belakang lembut Slate-50.
- **Tombol Login Berbentuk Kapsul (*Pill Shape*):** Warna Indigo solid dengan `borderRadius: 30`, bayangan halus, dan teks putih tebal.
- **Aksesibilitas & Fitur Demo:** Label WCAG lengkap, banner error ramah screen reader, serta tombol auto-fill kredensial demo (`user@mail.com` / `password123`).

### C. Kartu Kemajuan Harian (`src/components/ProgressCard.tsx`)
- **Latar Solid Indigo Penuh:** Kartu berlatar `#4F46E5` dengan sudut lengkung besar `borderRadius: 24`.
- **Drop Shadow Tebal tapi Lembut:** Bayangan lembut bergradasi Indigo (`shadowOpacity: 0.32`, `shadowRadius: 18`, `elevation: 8`).
- **Tipografi Putih Kontras Tinggi:** Teks persentase kemajuan tampil sangat menonjol ($40\text{ px}$, font-weight: 900) dengan batang progres putih kontras.

### D. Kartu Kebiasaan (`src/components/HabitCard.tsx`)
- **Permukaan Putih di Atas Latar Abu-Abu:** Kontras lembut di atas kanvas `Slate-50`.
- **Sudut Melengkung `20px` & Tanpa Border Keras:** Dilengkapi bayangan sangat halus (`shadowOpacity: 0.04`, `elevation: 2`).
- **Tombol Centang Lingkaran Sempurna ($44 \times 44\text{ px}$):**
  - *Belum selesai:* Latar putih dengan border tipis Slate.
  - *Selesai:* Terisi solid Indigo (`#4F46E5`) dengan centang putih tegas (`✓`).
- **Getaran Taktil (Haptics):** Integrasi `expo-haptics` (getaran sukses saat centang, getaran ringan saat pembatalan).

---

## 3. Fitur Inti & Keamanan yang Aktif

1. **Keamanan & Protected Routes (`src/app/_layout.tsx` & `src/storage/secureStorage.ts`):**
   - Menggunakan Hardware Keystore (Android) dan Keychain (iOS) via `expo-secure-store` untuk menyimpan token sesi (dengan fallback web).
   - Pengalihan otomatis via `NavigationGuard` antara `/login` dan `/` berdasarkan status token.
2. **Manajemen Kebiasaan (`src/hooks/useHabits.ts` & `src/storage/habitStorage.ts`):**
   - Operasi CRUD (Tambah, Centang, Hapus dengan animasi `LayoutAnimation`).
   - Penyimpanan lokal persisten melalui `AsyncStorage` v2.
   - Deteksi pergantian hari otomatis via timeout 00:00 dan listener `AppState`.
3. **Kalkulator Runtutan Streak (`src/utils/streakUtils.ts`):**
   - Perhitungan streak presisi dengan perlindungan streak hari kemarin.

---

## 4. Cara Menjalankan Aplikasi

Aplikasi dapat dijalankan langsung dari folder root workspace:
```bash
# Menjalankan Dev Server
npm start

# Menjalankan langsung di Web Browser
npm run web

# Menjalankan di Android Emulator / Device
npm run android
```
