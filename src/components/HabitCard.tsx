import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';

import { COLORS } from '../constants/colors';
import type { Habit } from '../constants/types';
import { isCompletedOn } from '../utils/streakUtils';

interface HabitCardProps {
  habit: Habit;
  todayStr: string;
  onToggle: (id: string) => void;
  onDelete: (id: string, title?: string) => void;
}

/**
 * HabitCard - Desain TaskFlow Modern Soft-UI
 * - Kartu berlatar surface (Putih) di atas latar abu-abu
 * - Sudut membulat besar (borderRadius: 20) tanpa border keras
 * - Elevation / shadow yang sangat halus
 * - Tombol centang berbentuk lingkaran sempurna (touch target >= 44x44px)
 */
export function HabitCard({
  habit,
  todayStr,
  onToggle,
  onDelete,
}: HabitCardProps) {
  const isCompleted = isCompletedOn(habit, todayStr);
  const streak = habit.streak;

  const handleToggle = () => {
    // Sensasi getaran taktil haptic feedback
    if (Platform.OS !== 'web') {
      try {
        if (isCompleted) {
          // Getaran ringan saat membatalkan centang
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else {
          // Getaran sukses saat menyelesaikan kebiasaan
          void Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
          );
        }
      } catch {
        // Fallback aman untuk perangkat tanpa motor getar
      }
    }

    // Jalankan fungsi mutasi utama
    onToggle(habit.id);
  };

  return (
    <View style={[styles.card, isCompleted && styles.cardCompleted]}>
      {/* 1. KIRI: Ikon Visual Emoji */}
      <View style={styles.iconContainer} accessible={false}>
        <Text style={styles.iconText}>{habit.emoji || '🎯'}</Text>
      </View>

      {/* 2. TENGAH: Judul Kebiasaan & Badge Streak */}
      <View style={styles.contentContainer}>
        <Text
          style={[styles.title, isCompleted && styles.titleCompleted]}
          numberOfLines={2}
        >
          {habit.title}
        </Text>

        <View style={styles.metaRow}>
          {/* Lencana Api Streak */}
          <View
            style={[
              styles.streakBadge,
              streak > 0 ? styles.streakBadgeActive : styles.streakBadgeInactive,
            ]}
          >
            <Text
              style={[
                styles.streakText,
                streak === 0 && styles.streakTextInactive,
              ]}
            >
              🔥 {streak} hari
            </Text>
          </View>

          {/* Tombol Hapus Kebiasaan (Touch Target Minimal 44x44px) */}
          <Pressable
            style={({ pressed }) => [
              styles.deleteButton,
              pressed && styles.deleteButtonPressed,
            ]}
            onPress={() => onDelete(habit.id, habit.title)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`Hapus kebiasaan ${habit.title}`}
            accessibilityHint="Membuka dialog konfirmasi untuk menghapus kebiasaan ini"
            hitSlop={6}
          >
            <Text style={styles.deleteButtonText}>✕</Text>
          </Pressable>
        </View>
      </View>

      {/* 3. KANAN: Tombol Centang Lingkaran Sempurna (Touch Target >= 44x44px) */}
      <Pressable
        style={({ pressed }) => [
          styles.circleCheckButton,
          isCompleted
            ? styles.checkButtonCompleted
            : styles.checkButtonPending,
          pressed && styles.checkButtonPressed,
        ]}
        onPress={handleToggle}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={
          isCompleted
            ? `Tandai belum selesai untuk ${habit.title}`
            : `Tandai selesai untuk ${habit.title}`
        }
        accessibilityState={{ checked: isCompleted }}
      >
        <Text
          style={[
            styles.checkIcon,
            isCompleted && styles.checkIconCompleted,
          ]}
        >
          {isCompleted ? '✓' : ''}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  // Kartu Surface (Putih) di atas latar aplikasi abu-abu, Sudut 20px, Tanpa Border Keras, Shadow Sangat Halus
  card: {
    backgroundColor: COLORS.surface, // Putih bersih (#FFFFFF)
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 20, // Melengkung 20px
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.65)', // Border sangat tipis dan lembut (tanpa border keras)
    // Shadow sangat halus
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  cardCompleted: {
    backgroundColor: '#FFFFFF',
    opacity: 0.85,
  },
  // Kiri: Kotak Ikon Emoji
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconText: {
    fontSize: 24,
  },
  // Tengah: Konten Judul & Streak
  contentContainer: {
    flex: 1,
    marginRight: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    lineHeight: 21,
    letterSpacing: -0.2,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.textMuted,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  streakBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 10,
  },
  streakBadgeActive: {
    backgroundColor: COLORS.streakLight,
  },
  streakBadgeInactive: {
    backgroundColor: COLORS.surfaceMuted,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.streakDark,
  },
  streakTextInactive: {
    color: COLORS.textMuted,
  },
  deleteButton: {
    width: 44, // Touch target >= 44x44px
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonPressed: {
    backgroundColor: COLORS.dangerLight,
  },
  deleteButtonText: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  // Kanan: Tombol Centang Berbentuk Lingkaran Sempurna (44x44px >= 44px)
  circleCheckButton: {
    width: 44,
    height: 44,
    borderRadius: 22, // Lingkaran Sempurna
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkButtonPressed: {
    transform: [{ scale: 0.94 }],
  },
  // Belum selesai: border tipis abu-abu di atas latar putih
  checkButtonPending: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  // Selesai: isi warna primary (Indigo) dan ikon centang putih
  checkButtonCompleted: {
    backgroundColor: COLORS.primary, // Indigo (#4F46E5)
    borderColor: COLORS.primary,
    borderWidth: 1.5,
  },
  checkIcon: {
    fontSize: 18,
    fontWeight: '800',
    color: 'transparent',
  },
  checkIconCompleted: {
    color: '#FFFFFF', // Ikon centang putih
  },
});

