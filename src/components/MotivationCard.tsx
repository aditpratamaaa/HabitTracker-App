import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../constants/colors';
import { getDailyHabitQuote } from '../services/quoteService';
import type { Quote } from '../types/quote';
import { ErrorMessage } from './ErrorMessage';
import { Loading } from './Loading';

/**
 * MotivationCard - Kartu Kutipan Inspirasi Harian (Modul 3: Asynchronous & API Call)
 * Mengambil kutipan motivasi dari External Public REST API (DummyJSON Quotes)
 * dengan state asynchronous (isLoading, error, quote) dan gaya TaskFlow Soft-UI Bento Grid.
 */
export function MotivationCard() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadQuote = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getDailyHabitQuote();
      setQuote(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Gagal mengambil kutipan inspirasi dari server.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function initialFetch() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getDailyHabitQuote();
        if (isMounted) {
          setQuote(data);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const message =
            err instanceof Error
              ? err.message
              : 'Gagal mengambil kutipan inspirasi dari server.';
          setError(message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void initialFetch();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRefreshQuote = () => {
    if (Platform.OS !== 'web') {
      try {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // Abaikan jika perangkat tidak mendukung haptics
      }
    }
    void loadQuote();
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        {/* Header Bar: Badge Inspirasi & Tombol Refresh */}
        <View style={styles.headerRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>💡 Inspirasi Hari Ini</Text>
          </View>

          <Pressable
            onPress={handleRefreshQuote}
            disabled={isLoading}
            style={({ pressed }) => [
              styles.refreshButton,
              pressed && styles.refreshButtonPressed,
              isLoading && styles.refreshButtonDisabled,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Muat kutipan inspirasi baru"
          >
            <Text style={styles.refreshIcon}>🔄</Text>
          </Pressable>
        </View>

        {/* State 1: Asynchronous Loading */}
        {isLoading ? (
          <Loading message="Memuat inspirasi harian..." />
        ) : /* State 2: Asynchronous Error */
        error ? (
          <ErrorMessage message={error} onRetry={handleRefreshQuote} />
        ) : /* State 3: Asynchronous Success */
        quote ? (
          <View style={styles.quoteContent}>
            <Text style={styles.quoteText}>{`"${quote.quote}"`}</Text>
            <View style={styles.authorRow}>
              <View style={styles.authorAccentDot} />
              <Text style={styles.authorText}>{`— ${quote.author}`}</Text>
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  badge: {
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.2,
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  refreshButtonPressed: {
    backgroundColor: COLORS.primaryLight,
    transform: [{ scale: 0.94 }],
  },
  refreshButtonDisabled: {
    opacity: 0.5,
  },
  refreshIcon: {
    fontSize: 16,
  },
  quoteContent: {
    marginTop: 4,
    gap: 10,
  },
  quoteText: {
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'italic',
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
  },
  authorAccentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.streak,
  },
  authorText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
});

export default MotivationCard;

