import * as Haptics from 'expo-haptics';
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
import type { Habit } from '../constants/types';

type HabitCardProps = {
  habit: Habit;
  todayStr: string;
  onToggle: (habitId: string) => void;
  onDelete: (habitId: string) => void;
};

/**
 * HabitCard - Item Kebiasaan (Stitch Design Specification)
 * Desain kartu Soft-UI rounded 24px, ikon kategori dengan wadah lembut,
 * streak badge api amber (🔥 X hari), dan tombol centang 44x44px ramah WCAG.
 */
export function HabitCard({ habit, todayStr: _todayStr, onToggle, onDelete }: HabitCardProps) {
  const isDone = habit.is_completed;
  const streakCount = Math.max(habit.streak ?? (isDone ? 1 : 0), 0);

  const handleToggle = () => {
    // Getaran taktil (Haptics)
    if (Platform.OS !== 'web') {
      try {
        if (!isDone) {
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      } catch {
        // Abaikan jika simulator tidak mendukung haptics
      }
    }
    onToggle(habit.id);
  };

  const confirmDelete = () => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm(`Hapus kebiasaan "${habit.title}"?`)) {
        onDelete(habit.id);
      }
    } else {
      Alert.alert(
        'Hapus Kebiasaan',
        `Apakah Anda yakin ingin menghapus "${habit.title}"?`,
        [
          { text: 'Batal', style: 'cancel' },
          { text: 'Hapus', style: 'destructive', onPress: () => onDelete(habit.id) },
        ]
      );
    }
  };

  return (
    <View style={styles.cardWrapper}>
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onLongPress={confirmDelete}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isDone }}
        accessibilityLabel={`${habit.title}, streak ${streakCount} hari`}
        accessibilityHint="Tekan tombol centang untuk mengubah status, tekan lama untuk menghapus"
      >
        <View style={styles.leftRow}>
          {/* Wadah Ikon Kategori Lembut (48x48px) */}
          <View style={[styles.iconBox, isDone && styles.iconBoxDone]}>
            <Text style={styles.iconEmoji}>{habit.emoji || '🎯'}</Text>
          </View>

          {/* Info Judul & Streak */}
          <View style={styles.infoCol}>
            <Text
              style={[styles.title, isDone && styles.titleDone]}
              numberOfLines={1}
            >
              {habit.title}
            </Text>

            <View style={styles.metaRow}>
              {/* Badge Streak Api Amber 🔥 */}
              <View style={styles.streakBadge}>
                <Text style={styles.streakFlame}>🔥</Text>
                <Text style={styles.streakText}>{streakCount} hari</Text>
              </View>

              <Text style={styles.categoryLabel}>Target harian</Text>
            </View>
          </View>
        </View>

        {/* Tombol Centang 44x44px (Standar Aksesibilitas WCAG) */}
        <Pressable
          style={({ pressed }) => [
            styles.checkbox,
            isDone ? styles.checkboxDone : styles.checkboxPending,
            pressed && styles.checkboxPressed,
          ]}
          onPress={handleToggle}
          hitSlop={6}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={isDone ? 'Tandai belum selesai' : 'Tandai selesai'}
        >
          {isDone ? (
            <Text style={styles.checkIcon}>✓</Text>
          ) : (
            <View style={styles.emptyCheckDot} />
          )}
        </Pressable>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#F1F5F9', // Slate 100
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
  },
  cardPressed: {
    transform: [{ scale: 0.99 }],
    backgroundColor: '#F8FAFC',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 12,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: '#EEF2FF', // Indigo 50
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconBoxDone: {
    backgroundColor: '#F1F5F9',
  },
  iconEmoji: {
    fontSize: 22,
  },
  infoCol: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B', // Slate 800
    letterSpacing: -0.2,
  },
  titleDone: {
    color: '#94A3B8', // Slate 400
    textDecorationLine: 'line-through',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 8,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7', // Amber 100
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 12,
    gap: 3,
  },
  streakFlame: {
    fontSize: 11,
  },
  streakText: {
    color: '#D97706', // Amber 600
    fontSize: 11,
    fontWeight: '800',
  },
  categoryLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '500',
  },
  // Tombol Centang WCAG 44x44
  checkbox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxPending: {
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#CBD5E1', // Slate 300
  },
  checkboxDone: {
    backgroundColor: COLORS.primary, // #4F46E5
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  checkboxPressed: {
    transform: [{ scale: 0.92 }],
  },
  checkIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  emptyCheckDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
});
