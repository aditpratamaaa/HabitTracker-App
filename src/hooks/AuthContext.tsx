import type { Session, User } from '@supabase/supabase-js';
import { useRouter, useSegments } from 'expo-router';
import * as Linking from 'expo-linking';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { ActivityIndicator, AppState, Platform, StyleSheet, View } from 'react-native';

import { COLORS } from '../constants/colors';
import { DUMMY_CREDENTIALS, DUMMY_SESSION_TOKEN } from '../constants/auth';
import { deleteToken, getToken, saveToken } from '../storage/secureStorage';
import {
  isSupabaseConfigured,
  requireSupabaseConfiguration,
  supabase,
} from '../utils/supabase';

function createDemoUser(): User {
  return {
    id: 'demo-user-id',
    app_metadata: { provider: 'demo' },
    user_metadata: {
      name: DUMMY_CREDENTIALS.name,
      full_name: DUMMY_CREDENTIALS.name,
    },
    aud: 'authenticated',
    confirmation_sent_at: '',
    recovery_sent_at: '',
    email_change_sent_at: '',
    new_email: '',
    invited_at: '',
    action_link: '',
    email: DUMMY_CREDENTIALS.email,
    phone: '',
    created_at: '2026-10-01T00:00:00.000Z',
    confirmed_at: '2026-10-01T00:00:00.000Z',
    email_confirmed_at: '2026-10-01T00:00:00.000Z',
    phone_confirmed_at: '',
    last_sign_in_at: new Date().toISOString(),
    role: 'authenticated',
    updated_at: new Date().toISOString(),
    identities: [],
    factors: [],
  };
}

function createDemoSession(user: User): Session {
  return {
    access_token: DUMMY_SESSION_TOKEN,
    refresh_token: 'demo-refresh-token',
    expires_in: 3600 * 24 * 30,
    expires_at: Math.floor(Date.now() / 1000) + 3600 * 24 * 30,
    token_type: 'bearer',
    user,
  };
}

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isDemoUser: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInDemo: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function initSession() {
      try {
        const storedToken = await getToken();
        if (storedToken === DUMMY_SESSION_TOKEN) {
          const demoUser = createDemoUser();
          const demoSession = createDemoSession(demoUser);
          if (mounted) {
            setSession(demoSession);
            setIsLoading(false);
          }
          return;
        }

        if (isSupabaseConfigured) {
          const { data, error } = await supabase.auth.getSession();
          if (error) console.warn('Tidak dapat memulihkan sesi Supabase:', error.message);
          if (mounted) {
            setSession(data.session);
            setIsLoading(false);
          }
        } else {
          if (mounted) {
            setSession(null);
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.warn('Gagal memulihkan sesi:', err);
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void initSession();

    if (isSupabaseConfigured) {
      const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
        if (mounted) {
          setSession((curr) => {
            if (curr?.access_token === DUMMY_SESSION_TOKEN) return curr;
            return nextSession;
          });
          setIsLoading(false);
        }
      });

      return () => {
        mounted = false;
        listener.subscription.unsubscribe();
      };
    }

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    const subscription = AppState.addEventListener('change', (state) => {
      if (isSupabaseConfigured) {
        if (state === 'active') supabase.auth.startAutoRefresh();
        else supabase.auth.stopAutoRefresh();
      }
    });

    return () => subscription.remove();
  }, []);

  const signInDemo = useCallback(async () => {
    const demoUser = createDemoUser();
    const demoSession = createDemoSession(demoUser);
    await saveToken(DUMMY_SESSION_TOKEN);
    setSession(demoSession);
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const trimmedEmail = email.trim().toLowerCase();
      // Bila kredensial cocok dengan akun demo, masuk langsung ke mode demo
      if (
        trimmedEmail === DUMMY_CREDENTIALS.email.toLowerCase() &&
        password === DUMMY_CREDENTIALS.password
      ) {
        await signInDemo();
        return;
      }

      // Bila Supabase belum dikonfigurasi dan bukan kredensial demo
      if (!isSupabaseConfigured) {
        throw new Error(
          'Supabase belum dikonfigurasi di file .env. Silakan masuk menggunakan Akun Demo (user@mail.com / password123) untuk mencoba fitur aplikasi.'
        );
      }

      requireSupabaseConfiguration();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
    },
    [signInDemo]
  );

  /** Mengembalikan true bila pengguna perlu mengonfirmasi email lebih dahulu. */
  const signUp = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      throw new Error(
        'Supabase belum dikonfigurasi di file .env. Pendaftaran akun baru memerlukan backend Supabase aktif. Silakan masuk dengan Akun Demo.'
      );
    }
    requireSupabaseConfiguration();
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        // Tambahkan URL ini pada Authentication > URL Configuration di Supabase.
        emailRedirectTo: Linking.createURL(''),
      },
    });
    if (error) throw error;
    return !data.session;
  }, []);

  const signOut = useCallback(async () => {
    const storedToken = await getToken();
    if (storedToken === DUMMY_SESSION_TOKEN || session?.user?.id === 'demo-user-id') {
      await deleteToken();
      setSession(null);
      return;
    }

    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signOut();
      if (error) console.warn('Supabase signOut error:', error.message);
    }
    await deleteToken();
    setSession(null);
  }, [session]);

  const isDemoUser =
    session?.user?.id === 'demo-user-id' || session?.access_token === DUMMY_SESSION_TOKEN;

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      isLoading,
      isDemoUser,
      signIn,
      signInDemo,
      signUp,
      signOut,
    }),
    [session, isLoading, isDemoUser, signIn, signInDemo, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth harus digunakan di dalam AuthProvider.');
  return context;
}

/** Redirect client-side berdasarkan sesi JWT dan route group Expo Router. */
export function AuthSessionRedirect() {
  const { session, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;
    // String() menjaga kompatibilitas saat typed-routes belum diregenerasi oleh Expo.
    const currentSegment = String(segments[0] ?? '');
    const isPublicRoute = currentSegment === 'login' || currentSegment === 'register';

    if (!session && !isPublicRoute) router.replace('/login');
    if (session && isPublicRoute) router.replace('/(tabs)' as never);
  }, [isLoading, router, segments, session]);

  if (!isLoading) return null;
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    backgroundColor: COLORS.background,
    flex: 1,
    justifyContent: 'center',
  },
});

