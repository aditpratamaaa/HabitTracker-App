/**
 * Konstanta Autentikasi Dummy untuk Keperluan Pengujian & Validasi Lokal
 * Sprint 02: Secure Mobile App
 */

export interface AuthCredentials {
  email: string;
  password: string;
  name: string;
}

/**
 * Kredensial dummy standar untuk pengujian login lokal.
 * CATATAN KEAMANAN: Jangan gunakan kredensial hardcoded di lingkungan produksi.
 */
export const DUMMY_CREDENTIALS: AuthCredentials = {
  email: 'user@mail.com',
  password: 'password123',
  name: 'Adit Pratama',
};

/**
 * Kunci penyimpanan token sesi pada SecureStore.
 */
export const AUTH_STORAGE_KEYS = {
  TOKEN: 'user_session_token',
  USER_INFO: 'user_session_info',
} as const;

/**
 * Token dummy standar saat login berhasil divalidasi.
 */
export const DUMMY_SESSION_TOKEN = 'mock_jwt_token_sprint02_secure_habittracker_2026';
