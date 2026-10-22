# 🎯 HabitTracker-App

Aplikasi mobile pelacak kebiasaan harian (*Daily Habit Tracker*) modern dan interaktif yang dibangun menggunakan **React Native**, **Expo SDK 57**, **TypeScript**, dan **Supabase**. Dirancang dengan prinsip desain **TaskFlow Modern Soft-UI**, animasi getaran taktil (*Haptics*), serta pengamanan sesi autentikasi berbasis enkripsi perangkat keras (*Keystore/Keychain*).

---

## ✨ Fitur Utama

- **🎨 TaskFlow Modern Soft-UI**: Antarmuka bersih, palet warna seimbang (*Indigo & Slate 50*), kartu bersudut melengkung halus, dan tipografi kontras tinggi.
- **⚡ Habit Management**:
  - Tambah kebiasaan baru dengan pemilih emoji interaktif (*Add Habit Modal*).
  - Tandai selesai / belum selesai dengan tombol centang lingkaran taktil (*Taptic Haptic Feedback*).
  - Hapus kebiasaan dengan konfirmasi aman.
- **🔥 Streak & Progress Tracking**:
  - Kartu kemajuan harian (*Daily Progress Summary*) dengan persentase real-time dan bilah kemajuan (*Progress Bar*).
  - Penghitungan streak konsistensi harian (*Daily Streak Counter*).
- **🔒 Keystore Security & Protected Routes**:
  - Penyimpanan sesi terenkripsi via `expo-secure-store` (Hardware Keystore di Android, Keychain di iOS).
  - *Navigation Guard* otomatis yang melindungi rute aplikasi (`/login` ↔ `/`).
- **☁️ Supabase Cloud Sync & Demo Mode**:
  - Terintegrasi dengan REST API Supabase PostgreSQL.
  - Mode Demo / Offline otomatis aktif jika kredensial Supabase belum diisi.

---

## 🛠️ Teknologi & Dependensi

- **Core**: React Native `0.86.3`, Expo SDK `~57.0.29`, React `19.2.3`
- **Routing**: Expo Router `~57.0.27` (File-based Routing)
- **Language**: TypeScript `~6.0.3` (Strict Mode)
- **Storage & Security**: `@react-native-async-storage/async-storage`, `expo-secure-store`
- **Feedback & Taptic**: `expo-haptics`
- **Backend & Cloud**: `@supabase/supabase-js`

---

## 🚀 Memulai (Quick Start)

### 1. Prasyarat
- [Node.js](https://nodejs.org/) (versi LTS disarankan, v18+)
- [Git](https://git-scm.com/)
- Aplikasi **Expo Go** di ponsel (Android/iOS) atau Emulator/Simulator.

### 2. Instalasi
Clone repository dan pasang dependensi:
```bash
git clone https://github.com/aditpratamaaa/HabitTracker-App.git
cd HabitTracker-App
npm install
```

### 3. Konfigurasi Environment (`.env`)
Salin file template `.env.example` ke `.env`:
```bash
cp .env.example .env
```
Isi variabel berikut jika ingin menghubungkan ke proyek Supabase:
```env
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```
> *Catatan: Jika dibiarkan default/kosong, aplikasi secara otomatis berjalan dalam **Mode Demo** (penyimpanan lokal).*

### 4. Menjalankan Aplikasi
```bash
# Jalankan Metro Bundler
npx expo start

# Atau langsung ke platform tertentu:
npm run android   # Android Emulator / Device
npm run ios       # iOS Simulator
npm run web       # Browser Web
```

### 5. Akun Uji Coba (Demo Mode)
Jika menggunakan Mode Demo, gunakan kredensial bawaan berikut pada layar login:
- **Email**: `user@mail.com`
- **Password**: `password123`

---

## 🧪 Pengujian & Kualitas Kode

```bash
# Typecheck TypeScript
npx tsc --noEmit

# Linting ESLint (Expo Config)
npm run lint
```

---

## 📄 Lisensi

Didistribusikan di bawah lisensi MIT. Lihat file [LICENSE](LICENSE) untuk informasi lebih lanjut.
