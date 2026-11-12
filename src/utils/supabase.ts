import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Konfigurasi Supabase Client
 *
 * Anda dapat mengisi kredensial pada file `.env` (direkomendasikan):
 * EXPO_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
 * EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
 */
const rawUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const rawKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Sanitasi URL untuk mencegah crash:
 * "Error: Invalid supabaseUrl: Provided URL is malformed"
 * ketika pengguna memasukkan placeholder dengan karakter tanda kurung siku [...]
 */
function sanitizeSupabaseUrl(url: string): string {
  if (!url) return 'https://placeholder.supabase.co';
  // Hapus kurung siku jika pengguna menyalin langsung format [MASUKKAN_URL_SUPABASE_ANDA_DI_SINI]
  const cleaned = url.replace(/[[\]]/g, '').trim();
  if (
    !cleaned ||
    cleaned.includes('MASUKKAN_URL_SUPABASE') ||
    cleaned.includes('YOUR_PROJECT_REF') ||
    cleaned.includes('placeholder')
  ) {
    return 'https://placeholder.supabase.co';
  }
  try {
    const formatted = cleaned.startsWith('http') ? cleaned : `https://${cleaned}`;
    const parsed = new URL(formatted);
    return parsed.origin;
  } catch {
    return 'https://placeholder.supabase.co';
  }
}

/**
 * Pengecekan apakah URL dan Anon Key sudah diisi oleh pengembang dengan nilai asli.
 */
export const isSupabaseConfigured: boolean = Boolean(
  rawUrl &&
    rawKey &&
    !rawUrl.includes('MASUKKAN_URL_SUPABASE') &&
    !rawUrl.includes('YOUR_PROJECT_REF') &&
    !rawUrl.includes('placeholder') &&
    !rawKey.includes('MASUKKAN_KEY_SUPABASE') &&
    !rawKey.includes('placeholder') &&
    rawKey !== 'placeholder-anon-key'
);

export const supabaseConfigurationError =
  'Supabase belum dikonfigurasi. Isi EXPO_PUBLIC_SUPABASE_URL dan EXPO_PUBLIC_SUPABASE_ANON_KEY pada file .env.';

/**
 * Adapter penyimpanan sesi aman (Hardware Keystore / Keychain)
 * menggunakan expo-secure-store untuk iOS & Android,
 * serta fallback ke localStorage di web browser dan aman saat SSR (Node).
 */
const ExpoSecureStoreAdapter = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
        return null;
      }
      return window.localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
        window.localStorage.setItem(key, value);
      }
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

const resolvedUrl = sanitizeSupabaseUrl(rawUrl);
const resolvedKey = rawKey.trim() || 'placeholder-anon-key';

export const supabase = createClient(resolvedUrl, resolvedKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web' && typeof window !== 'undefined',
  },
});

export function requireSupabaseConfiguration(): void {
  if (!isSupabaseConfigured) {
    throw new Error(supabaseConfigurationError);
  }
}
