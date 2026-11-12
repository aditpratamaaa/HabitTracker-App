import React, { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from '../../constants/colors';
import { useAuth } from '../../hooks/AuthContext';

export default function ProfileScreen() {
  const { user, signOut, freezeTickets, addFreezeTicket } = useAuth();
  const [isReminderActive, setIsReminderActive] = useState<boolean>(true);
  const [isAddingTicket, setIsAddingTicket] = useState<boolean>(false);

  const displayName =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    (user?.email ? user.email.split('@')[0] : 'User Pratama');

  const email = user?.email || 'user@example.com';

  const handleGetFreezeTicket = async () => {
    setIsAddingTicket(true);
    try {
      await addFreezeTicket();
      const current = freezeTickets ?? 0;
      if (Platform.OS === 'web') {
        alert(`Berhasil! 1 Tiket Freeze telah ditambahkan ke database Supabase ❄️ (Total: ${current + 1})`);
      } else {
        Alert.alert(
          'Tiket Freeze Berhasil Ditambah! ❄️',
          `1 Tiket Freeze telah disimpan ke profil database. Total tiket kamu sekarang: ${current + 1}`
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menambahkan tiket';
      if (Platform.OS === 'web') {
        alert(`Gagal: ${msg}`);
      } else {
        Alert.alert('Gagal', msg);
      }
    } finally {
      setIsAddingTicket(false);
    }
  };

  const handleLogout = () => {
    const performLogout = () => {
      void signOut();
    };

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm('Yakin ingin keluar dari akun?')) {
        performLogout();
      }
    } else {
      Alert.alert('Keluar Akun', 'Apakah Anda yakin ingin keluar dari akun?', [
        { text: 'Batal', style: 'cancel' },
        { text: 'Keluar', style: 'destructive', onPress: performLogout },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Profil */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerTitle}>Profil Saya</Text>
            <Text style={styles.headerEmoji}>👤</Text>
          </View>

          <Pressable
            style={({ pressed }) => [styles.editButton, pressed && styles.btnPressed]}
            onPress={() => {
              if (Platform.OS === 'web') {
                alert('Fitur edit profil siap dihubungkan!');
              } else {
                Alert.alert('Edit Profil', 'Fitur pembaruan profil pengguna.');
              }
            }}
          >
            <Text style={styles.editIcon}>✏️</Text>
            <Text style={styles.editText}>Edit</Text>
          </Pressable>
        </View>

        {/* User Card Utama (Soft Layering & Ambient Tint) */}
        <View style={styles.userCard}>
          <View style={styles.ambientGlowIndigo} />
          <View style={styles.ambientGlowAmber} />

          <View style={styles.userCardContent}>
            {/* Avatar dengan Ring & Verified Badge */}
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitial}>
                  {displayName.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedIcon}>✓</Text>
              </View>
            </View>

            {/* Nama & Email */}
            <Text style={styles.userName}>{displayName}</Text>
            <Text style={styles.userEmail}>{email}</Text>

            {/* Membership Badge */}
            <View style={styles.membershipBadge}>
              <Text style={styles.membershipText}>Pro Habit Builder</Text>
              <Text style={styles.starEmoji}>🌟</Text>
            </View>
          </View>
        </View>

        {/* Achievement Metrics Row (3-Column Soft UI Bento) */}
        <View style={styles.metricsRow}>
          {/* Metrik 1: Dibangun */}
          <View style={styles.metricCard}>
            <View style={styles.metricIconCircleIndigo}>
              <Text style={styles.metricIconText}>🛡️</Text>
            </View>
            <Text style={styles.metricNumber}>18</Text>
            <Text style={styles.metricLabel}>Dibangun</Text>
          </View>

          {/* Metrik 2: Rata-rata */}
          <View style={styles.metricCard}>
            <View style={styles.metricIconCircleAmber}>
              <Text style={styles.metricIconText}>📈</Text>
            </View>
            <Text style={styles.metricNumber}>85%</Text>
            <Text style={styles.metricLabel}>Rata-rata</Text>
          </View>

          {/* Metrik 3: Level */}
          <View style={styles.metricCard}>
            <View style={styles.metricIconCircleViolet}>
              <Text style={styles.metricIconText}>🎖️</Text>
            </View>
            <Text style={styles.metricNumber}>Lv. 4</Text>
            <Text style={styles.metricLabel}>Explorer</Text>
          </View>
        </View>

        {/* Bento Card: Tiket Freeze Tersedia (Gamifikasi Proteksi Streak) */}
        <View style={styles.freezeBentoCard}>
          <View style={styles.freezeBentoTop}>
            <View style={styles.freezeIconCircle}>
              <Text style={styles.freezeBentoIcon}>❄️</Text>
            </View>
            <View style={styles.freezeBentoInfo}>
              <Text style={styles.freezeBentoTitle}>Tiket Freeze Tersedia</Text>
              <Text style={styles.freezeBentoDesc}>
                Melindungi runtutan streak (🔥) agar tidak reset saat bolos 1 hari.
              </Text>
            </View>
            <View style={styles.freezeCountBadge}>
              <Text style={styles.freezeCountNumber}>{freezeTickets ?? 0}</Text>
              <Text style={styles.freezeCountLabel}>Tiket</Text>
            </View>
          </View>

          {/* Tombol Dapatkan Tiket (Demo) */}
          <Pressable
            style={({ pressed }) => [
              styles.getTicketButton,
              pressed && styles.getTicketPressed,
              isAddingTicket && styles.getTicketDisabled,
            ]}
            onPress={handleGetFreezeTicket}
            disabled={isAddingTicket}
            accessibilityRole="button"
            accessibilityLabel="Dapatkan Tiket Demo"
          >
            <Text style={styles.getTicketStar}>✨</Text>
            <Text style={styles.getTicketText}>
              {isAddingTicket ? 'Menyimpan ke Supabase...' : 'Dapatkan Tiket (Demo)'}
            </Text>
          </Pressable>
        </View>

        {/* Section: Pengaturan & Preferensi */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>PENGATURAN & PREFERENSI</Text>
        </View>

        <View style={styles.settingsGroup}>
          {/* Setting 1: Pengingat Notifikasi (Switch) */}
          <View style={styles.settingItem}>
            <View style={styles.settingIconCircle}>
              <Text style={styles.settingEmoji}>🔔</Text>
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Pengingat & Notifikasi Harian</Text>
              <Text style={styles.settingDesc}>Aktif pukul 07:00 & 20:30</Text>
            </View>
            <Switch
              value={isReminderActive}
              onValueChange={setIsReminderActive}
              trackColor={{ false: '#CBD5E1', true: COLORS.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.itemDivider} />

          {/* Setting 2: Target & Kategori */}
          <Pressable
            style={({ pressed }) => [styles.settingItemBtn, pressed && styles.itemPressed]}
            onPress={() => {
              Alert.alert('Kategori Kebiasaan', '5 kategori kebiasaan saat ini aktif.');
            }}
          >
            <View style={styles.settingIconCircle}>
              <Text style={styles.settingEmoji}>🗂️</Text>
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Target & Kategori Kebiasaan</Text>
              <Text style={styles.settingDesc}>5 kategori aktif disesuaikan</Text>
            </View>
            <Text style={styles.chevronIcon}>›</Text>
          </Pressable>

          <View style={styles.itemDivider} />

          {/* Setting 3: Koneksi Kesehatan */}
          <Pressable
            style={({ pressed }) => [styles.settingItemBtn, pressed && styles.itemPressed]}
            onPress={() => {
              Alert.alert('Koneksi Kesehatan', 'Tersinkronisasi dengan sensor kebugaran lokal.');
            }}
          >
            <View style={styles.settingIconCircle}>
              <Text style={styles.settingEmoji}>❤️</Text>
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Koneksi Aplikasi Kesehatan</Text>
              <Text style={styles.settingDesc}>Google Fit / Apple Health tersambung</Text>
            </View>
            <Text style={styles.chevronIcon}>›</Text>
          </Pressable>

          <View style={styles.itemDivider} />

          {/* Setting 4: Mode Tema */}
          <Pressable
            style={({ pressed }) => [styles.settingItemBtn, pressed && styles.itemPressed]}
            onPress={() => {
              Alert.alert('Tema', 'Tema saat ini: Soft-UI Modern Light Slate.');
            }}
          >
            <View style={styles.settingIconCircle}>
              <Text style={styles.settingEmoji}>🎨</Text>
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Mode Tampilan & Tema</Text>
              <Text style={styles.settingDesc}>Cahaya lembut (Sistem bawaan)</Text>
            </View>
            <Text style={styles.chevronIcon}>›</Text>
          </Pressable>

          <View style={styles.itemDivider} />

          {/* Setting 5: Pusat Bantuan */}
          <Pressable
            style={({ pressed }) => [styles.settingItemBtn, pressed && styles.itemPressed]}
            onPress={() => {
              Alert.alert('Bantuan', 'HabitTracker App v1.0.0 - Pemrograman Mobile 2026.');
            }}
          >
            <View style={styles.settingIconCircle}>
              <Text style={styles.settingEmoji}>❓</Text>
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Pusat Bantuan & Kebijakan Privasi</Text>
              <Text style={styles.settingDesc}>Panduan pengguna & keamanan data JWT</Text>
            </View>
            <Text style={styles.chevronIcon}>›</Text>
          </Pressable>
        </View>

        {/* Secondary Delight Card / Motivation */}
        <View style={styles.streakDelightCard}>
          <View style={styles.streakDelightIconWrap}>
            <Text style={styles.streakDelightIcon}>🔥</Text>
          </View>
          <View style={styles.streakDelightTextWrap}>
            <Text style={styles.streakDelightTitle}>Rentetan 24 Hari!</Text>
            <Text style={styles.streakDelightDesc}>
              Pertahankan momentum untuk meraih lencana Gold Builder.
            </Text>
          </View>
        </View>

        {/* Tombol Logout (Pill Shape with Red Accent) */}
        <Pressable
          style={({ pressed }) => [styles.logoutButton, pressed && styles.logoutPressed]}
          onPress={handleLogout}
          accessibilityRole="button"
          accessibilityLabel="Keluar dari akun"
        >
          <Text style={styles.logoutDoorIcon}>🚪</Text>
          <Text style={styles.logoutText}>Logout / Keluar Akun</Text>
        </Pressable>

        {/* Spacer untuk Floating TabBar */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background, // #F8FAFC
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  headerEmoji: {
    fontSize: 20,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  btnPressed: {
    transform: [{ scale: 0.95 }],
  },
  editIcon: {
    fontSize: 12,
  },
  editText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  // User Card Utama
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 3,
  },
  ambientGlowIndigo: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
  },
  ambientGlowAmber: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
  },
  userCardContent: {
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 5,
  },
  avatarInitial: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981', // Emerald 500
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedIcon: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.4,
  },
  userEmail: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  membershipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    marginTop: 12,
    gap: 4,
  },
  membershipText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.4,
  },
  starEmoji: {
    fontSize: 11,
  },
  // Achievement Metrics Row
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  metricIconCircleIndigo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  metricIconCircleAmber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  metricIconCircleViolet: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  metricIconText: {
    fontSize: 15,
  },
  metricNumber: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E293B',
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  // Bento Card: Tiket Freeze (Soft-UI)
  freezeBentoCard: {
    backgroundColor: '#F0F9FF', // Sky 50
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD', // Sky 200
    marginBottom: 20,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  freezeBentoTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  freezeIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0F2FE', // Ice Blue
    borderWidth: 1,
    borderColor: '#BAE6FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  freezeBentoIcon: {
    fontSize: 20,
  },
  freezeBentoInfo: {
    flex: 1,
  },
  freezeBentoTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0369A1', // Deep Sky 700
    letterSpacing: -0.2,
  },
  freezeBentoDesc: {
    fontSize: 11,
    color: '#0284C7', // Sky 600
    marginTop: 2,
    lineHeight: 15,
  },
  freezeCountBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },
  freezeCountNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0284C7',
  },
  freezeCountLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0369A1',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  getTicketButton: {
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.primary, // #4F46E5
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  getTicketPressed: {
    backgroundColor: COLORS.primaryDark,
    transform: [{ scale: 0.98 }],
  },
  getTicketDisabled: {
    opacity: 0.6,
  },
  getTicketStar: {
    fontSize: 14,
  },
  getTicketText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  // Pengaturan List
  sectionHeader: {
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  settingsGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  settingItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  itemPressed: {
    opacity: 0.7,
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 46,
  },
  settingIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingEmoji: {
    fontSize: 17,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  settingDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  chevronIcon: {
    fontSize: 20,
    color: '#94A3B8',
    fontWeight: '600',
  },
  // Delight Card
  streakDelightCard: {
    backgroundColor: '#FEF3C7', // Amber 100
    borderRadius: 20,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  streakDelightIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FEA619',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakDelightIcon: {
    fontSize: 20,
  },
  streakDelightTextWrap: {
    flex: 1,
  },
  streakDelightTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
  },
  streakDelightDesc: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 2,
  },
  // Tombol Logout
  logoutButton: {
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: COLORS.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  logoutPressed: {
    backgroundColor: '#FEF2F2',
    transform: [{ scale: 0.98 }],
  },
  logoutDoorIcon: {
    fontSize: 16,
  },
  logoutText: {
    color: COLORS.danger,
    fontSize: 14,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 100, // Ruang agar konten tidak tertutup floating bottom bar
  },
});
