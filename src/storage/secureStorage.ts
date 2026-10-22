import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { AUTH_STORAGE_KEYS } from '../constants/auth';

/**
 * Key penyimpanan token di dalam Hardware Keystore (Android) / Keychain (iOS).
 */
const TOKEN_KEY = AUTH_STORAGE_KEYS.TOKEN;

/**
 * Opsi konfigurasi keamanan untuk SecureStore:
 * - keychainAccessible: WHEN_UNLOCKED (iOS) memastikan token hanya dapat dibaca
 *   saat perangkat pengguna dalam kondisi tidak terkunci (unlocked).
 */
const SECURE_STORE_OPTIONS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED,
};

/**
 * Menyimpan token autentikasi pengguna secara aman ke dalam Keystore/Keychain.
 *
 * @param token - String token JWT atau session token yang akan disimpan.
 * @returns Promise<boolean> - True jika berhasil disimpan, False jika gagal.
 */
export async function saveToken(token: string): Promise<boolean> {
  try {
    if (!token || typeof token !== 'string') {
      console.warn('[SecureStore] Gagal menyimpan: Token tidak valid.');
      return false;
    }

    // Penanganan khusus platform Web (SecureStore berbasis hardware tidak tersedia di browser)
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(TOKEN_KEY, token);
        return true;
      }
      return false;
    }

    // Simpan ke Hardware Keystore / iOS Keychain
    await SecureStore.setItemAsync(TOKEN_KEY, token, SECURE_STORE_OPTIONS);
    return true;
  } catch (error) {
    // Catatan Keamanan: Jangan mencetak nilai token ke dalam log saat error terjadi
    console.error(
      '[SecureStore] Terjadi kesalahan saat menyimpan token ke secure storage:',
      error instanceof Error ? error.message : error
    );
    return false;
  }
}

/**
 * Mengambil token autentikasi yang tersimpan di Keystore/Keychain.
 *
 * @returns Promise<string | null> - Token string jika ditemukan, atau null jika tidak ada/gagal.
 */
export async function getToken(): Promise<string | null> {
  try {
    // Penanganan khusus platform Web
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(TOKEN_KEY);
      }
      return null;
    }

    // Ambil dari Hardware Keystore / iOS Keychain
    const token = await SecureStore.getItemAsync(
      TOKEN_KEY,
      SECURE_STORE_OPTIONS
    );
    return token;
  } catch (error) {
    console.error(
      '[SecureStore] Terjadi kesalahan saat mengambil token dari secure storage:',
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

/**
 * Menghapus token autentikasi (misal saat logout).
 *
 * @returns Promise<boolean> - True jika berhasil dihapus, False jika gagal.
 */
export async function deleteToken(): Promise<boolean> {
  try {
    // Penanganan khusus platform Web
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(TOKEN_KEY);
        return true;
      }
      return false;
    }

    // Hapus dari Hardware Keystore / iOS Keychain
    await SecureStore.deleteItemAsync(TOKEN_KEY, SECURE_STORE_OPTIONS);
    return true;
  } catch (error) {
    console.error(
      '[SecureStore] Terjadi kesalahan saat menghapus token dari secure storage:',
      error instanceof Error ? error.message : error
    );
    return false;
  }
}

/**
 * Memeriksa ketersediaan modul SecureStore pada perangkat saat ini.
 *
 * @returns Promise<boolean> - True jika perangkat mendukung hardware-backed keystore.
 */
export async function isSecureStoreAvailable(): Promise<boolean> {
  try {
    if (Platform.OS === 'web') {
      return false;
    }
    return await SecureStore.isAvailableAsync();
  } catch {
    return false;
  }
}
