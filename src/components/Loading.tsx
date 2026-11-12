import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../constants/colors';

export interface LoadingProps {
  /** Pesan teks yang ditampilkan di bawah indikator pemuatan */
  message?: string;
  /** Ukuran ActivityIndicator ('small' | 'large') */
  size?: 'small' | 'large';
}

/**
 * Komponen Reusable Loading untuk operasi Asynchronous (Modul 3).
 * Menampilkan ActivityIndicator berwarna Indigo primer (#4F46E5) dan teks deskriptif.
 */
export function Loading({
  message = 'Memuat inspirasi harian...',
  size = 'small',
}: LoadingProps) {
  return (
    <View
      style={styles.container}
      accessibilityRole="progressbar"
      accessibilityLabel={message}
    >
      <ActivityIndicator size={size} color={COLORS.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    letterSpacing: 0.1,
  },
});

export default Loading;

