import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Habit } from '../types/habit';
import { calculateStreak } from '../utils/streakUtils';
import { COLORS } from '../constants/theme';

interface HabitCardProps {
  habit: Habit;
  todayStr: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function HabitCard({ habit, todayStr, onToggle, onDelete }: HabitCardProps) {
  const isCompleted = habit.completedDates.includes(todayStr);
  const streak = calculateStreak(habit.completedDates);

  const handleDeletePress = () => {
    Alert.alert(
      'Hapus Kebiasaan',
      `Apakah Anda yakin ingin menghapus "${habit.title}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => onDelete(habit.id),
        },
      ]
    );
  };

  return (
    <View style={[styles.card, isCompleted && styles.cardCompleted]}>
      {/* Sisi Kiri: Ikon Visual Emoji */}
      <View style={styles.iconContainer}>
        <Text style={styles.iconText}>{habit.icon || '🎯'}</Text>
      </View>

      {/* Bagian Tengah: Judul & Streak Badge */}
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
              🔥 {streak} hari beruntun
            </Text>
          </View>

          {/* Tombol Hapus */}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeletePress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Hapus kebiasaan"
          >
            <Text style={styles.deleteButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sisi Kanan: Tombol Check-in Interaktif (Single-Tap) */}
      <TouchableOpacity
        style={[
          styles.checkButton,
          isCompleted ? styles.checkButtonCompleted : styles.checkButtonPending,
        ]}
        onPress={() => onToggle(habit.id)}
        activeOpacity={0.7}
        accessibilityLabel={isCompleted ? 'Tandai belum selesai' : 'Tandai selesai'}
      >
        <Text style={[styles.checkIcon, isCompleted && styles.checkIconCompleted]}>
          {isCompleted ? '✓' : ''}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardCompleted: {
    borderColor: COLORS.primaryLight,
    backgroundColor: '#F0FDF4', // Very subtle emerald tint
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconText: {
    fontSize: 24,
  },
  contentContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    lineHeight: 22,
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
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  streakBadgeActive: {
    backgroundColor: COLORS.streakLight,
  },
  streakBadgeInactive: {
    backgroundColor: '#F1F5F9',
  },
  streakText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.streak,
  },
  streakTextInactive: {
    color: COLORS.textMuted,
  },
  deleteButton: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  deleteButtonText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  checkButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkButtonPending: {
    borderWidth: 2,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  checkButtonCompleted: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  checkIcon: {
    fontSize: 20,
    fontWeight: '900',
    color: '#CBD5E1',
  },
  checkIconCompleted: {
    color: '#FFFFFF',
  },
});
