import React from 'react';
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { COLORS } from '../constants/colors';
import { useAuth } from '../hooks/AuthContext';
import { getFormattedHeaderDate } from '../utils/dateUtils';

/**
 * HeaderOverview - Desain TaskFlow Modern (Screen 5)
 * Tata letak sejajar (row):
 * Kiri  : "Hi, Warga 👋" (teks besar tebal) & tanggal di bawahnya (teks kecil abu-abu)
 * Kanan : Tombol Logout berbentuk lingkaran bundar rapi (touch target >= 44px)
 */
export function HeaderOverview() {
  const { user, signOut } = useAuth();
  let dateFormatted = '';

  try {
    dateFormatted = getFormattedHeaderDate();
  } catch (err) {
    console.warn('Gagal memformat tanggal header:', err);
  }

  const displayName =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    (user?.email ? user.email.split('@')[0] : 'Warga');

  const handleLogout = () => {
    const performLogout = () => {
      void signOut();
    };

    if (Platform.OS === 'web') {
      if (
        typeof window !== 'undefined' &&
        window.confirm('Yakin ingin keluar dari akun?')
      ) {
        performLogout();
      }
    } else {
      Alert.alert('Keluar Akun', 'Apakah Anda yakin ingin keluar?', [
        { text: 'Batal', style: 'cancel' },
        { text: 'Keluar', style: 'destructive', onPress: performLogout },
      ]);
    }
  };

  return (
    <View style={styles.container} accessible={true} accessibilityRole="header">
      {/* Sisi Kiri: Salam & Tanggal */}
      <View style={styles.leftContent}>
        <Text style={styles.greetingText}>Hi, {displayName} 👋</Text>
        <Text style={styles.dateText}>{dateFormatted}</Text>
      </View>

      {/* Sisi Kanan: Tombol Logout Bundar Rapi (Touch Target >= 44x44px) */}
      <Pressable
        style={({ pressed }) => [
          styles.logoutCircleButton,
          pressed && styles.logoutButtonPressed,
        ]}
        onPress={handleLogout}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Keluar dari akun"
        accessibilityHint="Menghapus sesi login dan kembali ke layar masuk"
        hitSlop={6}
      >
        <Text style={styles.logoutIcon}>🚪</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
  },
  leftContent: {
    flex: 1,
    marginRight: 12,
  },
  greetingText: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.6,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textMuted,
    marginTop: 3,
    textTransform: 'capitalize',
  },
  logoutCircleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    // Soft shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  logoutButtonPressed: {
    backgroundColor: COLORS.surfaceMuted,
    transform: [{ scale: 0.96 }],
  },
  logoutIcon: {
    fontSize: 18,
  },
});
