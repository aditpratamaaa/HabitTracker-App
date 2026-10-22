import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DayOverviewStats } from '../types/habit';
import { getMotivationalProgressMessage } from '../utils/streakUtils';
import { COLORS } from '../constants/theme';

interface ProgressCardProps {
  stats: DayOverviewStats;
}

export function ProgressCard({ stats }: ProgressCardProps) {
  const { totalHabits, completedTodayCount, percentage } = stats;
  const message = getMotivationalProgressMessage(percentage);

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.cardLabel}>KEMAJUAN HARI INI</Text>
          <Text style={styles.ratioText}>
            {completedTodayCount} dari {totalHabits} selesai
          </Text>
        </View>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{percentage}%</Text>
        </View>
      </View>

      {/* Linear Progress Bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${percentage}%` }]} />
      </View>

      <Text style={styles.feedbackText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 20,
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.8,
  },
  ratioText: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  badgeContainer: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: COLORS.primaryDark,
    fontSize: 15,
    fontWeight: '800',
  },
  progressTrack: {
    height: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  feedbackText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
});
