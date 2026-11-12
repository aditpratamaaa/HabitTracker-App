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
 * HeaderOverview - Curved Dark Navy Header (Stitch Design Specification)
 * Warna Navy (#0F172A) dengan border-bottom melengkung (36px),
 * tanggal uppercase, sapaan dinamis, tombol notifikasi, dan avatar profil.
 */
export function HeaderOverview() {
  const { user, signOut, freezeTickets } = useAuth();

  let dateFormatted = '';
  try {
    dateFormatted = getFormattedHeaderDate();
  } catch {
    dateFormatted = 'Hari ini';
  }

  const displayName =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    (user?.email ? user.email.split('@')[0] : 'User');

  const handleLogout = () => {
    const performLogout = () => {
      void signOut();
    };

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm('Yakin ingin keluar dari akun?')) {
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
    <View style={styles.curvedHeader}>
      <View style={styles.topRow}>
        {/* Sisi Kiri: Tanggal & Salam */}
        <View style={styles.textContainer}>
          <Text style={styles.dateText}>{dateFormatted.toUpperCase()}</Text>
          <Text style={styles.greetingText}>
            Hi, {displayName} <Text style={styles.waveEmoji}>👋</Text>
          </Text>
        </View>

        {/* Sisi Kanan: Tiket Freeze, Notifikasi & Avatar Profil / Logout */}
        <View style={styles.actionRow}>
          {/* Lencana Kapsul Tiket Freeze (Ice Blue Pill) */}
          <View
            style={styles.freezeBadge}
            accessibilityRole="text"
            accessibilityLabel={`Tiket Freeze: ${freezeTickets ?? 0}`}
          >
            <Text style={styles.freezeIcon}>❄️</Text>
            <Text style={styles.freezeText}>{freezeTickets ?? 0}</Text>
          </View>

          {/* Tombol Bell Notifikasi */}
          <Pressable
            style={({ pressed }) => [
              styles.iconButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => {
              if (Platform.OS === 'web') {
                alert('Semua pengingat kebiasaan hari ini sudah aktif! 🔔');
              } else {
                Alert.alert('Notifikasi', 'Semua pengingat kebiasaan hari ini sudah aktif! 🔔');
              }
            }}
            accessibilityRole="button"
            accessibilityLabel="Notifikasi"
          >
            <Text style={styles.bellIcon}>🔔</Text>
            <View style={styles.unreadDot} />
          </Pressable>

          {/* Avatar Ring dengan Aksen Indigo / Tombol Keluar Cepat */}
          <Pressable
            style={({ pressed }) => [
              styles.avatarRing,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleLogout}
            accessibilityRole="button"
            accessibilityLabel="Keluar akun"
            accessibilityHint="Tekan untuk keluar dari akun"
          >
            <View style={styles.avatarInner}>
              <Text style={styles.avatarInitial}>
                {displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  curvedHeader: {
    backgroundColor: COLORS.navyHeader, // #0F172A
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    paddingTop: 16,
    paddingBottom: 44, // Ruang bawah agar Hero ProgressCard melayang (floating overlap)
    paddingHorizontal: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    paddingRight: 12,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#94A3B8', // Slate 400
    marginBottom: 4,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  waveEmoji: {
    fontSize: 20,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  freezeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE', // Ice Blue (Sky 100)
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#BAE6FD', // Sky 200
    gap: 4,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  freezeIcon: {
    fontSize: 13,
  },
  freezeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0369A1', // Deep Sky 700
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(30, 41, 59, 0.85)', // Slate 800
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  buttonPressed: {
    transform: [{ scale: 0.94 }],
    opacity: 0.85,
  },
  bellIcon: {
    fontSize: 17,
  },
  unreadDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    borderWidth: 1.5,
    borderColor: COLORS.navyHeader,
  },
  avatarRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    padding: 2,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    backgroundColor: '#312E81', // Indigo 900
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
});
