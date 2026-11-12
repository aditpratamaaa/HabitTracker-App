import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../constants/colors';

export interface ErrorMessageProps {
  /** Pesan kesalahan yang ditampilkan kepada pengguna */
  message: string;
  /** Callback opsional untuk mengulang pemanggilan asynchronous */
  onRetry?: () => void;
}

/**
 * Komponen Reusable ErrorMessage untuk menampilkan kegagalan operasi Asynchronous (Modul 3).
 * Dilengkapi ikon peringatan (⚠️) dan tombol "Coba Lagi" ramah aksesibilitas WCAG.
 */
export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <View
      style={styles.container}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <View style={styles.contentRow}>
        <View style={styles.iconBadge}>
          <Text style={styles.iconText}>⚠️</Text>
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.title}>Gagal Memuat Data</Text>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      </View>

      {onRetry ? (
        <Pressable
          onPress={onRetry}
          style={({ pressed }) => [
            styles.retryButton,
            pressed && styles.retryButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Coba Lagi"
        >
          <Text style={styles.retryButtonText}>🔄 Coba Lagi</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: COLORS.dangerLight,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    gap: 12,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 18,
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.error,
    marginBottom: 2,
  },
  messageText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.danger,
    lineHeight: 17,
  },
  retryButton: {
    alignSelf: 'flex-start',
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.danger,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  retryButtonText: {
    color: COLORS.textOnPrimary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

export default ErrorMessage;

