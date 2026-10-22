import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../constants/colors';
import {
  type DailyProgress,
  getMotivationalProgressMessage,
} from '../utils/streakUtils';

interface ProgressCardProps {
  progress: DailyProgress;
}

/**
 * ProgressCard - Desain TaskFlow Modern Soft-UI
 * - Latar kartu warna primary (Indigo) penuh
 * - Seluruh teks di dalamnya berwarna putih kontras tinggi
 * - Bentuk kartu melengkung besar (borderRadius: 24)
 * - Drop shadow tebal tapi lembut
 */
export function ProgressCard({ progress }: ProgressCardProps) {
  const { total, completed, percentage } = progress;
  const message = getMotivationalProgressMessage(percentage);

  return (
    <View
      style={styles.card}
      accessible={true}
      accessibilityRole="summary"
      accessibilityLabel={`Kemajuan hari ini: ${completed} dari ${total} selesai, ${percentage} persen. ${message}`}
    >
      {/* Baris Atas: Label & Rasio di Kiri, Persentase Sangat Besar di Kanan */}
      <View style={styles.topRow}>
        <View style={styles.leftInfo}>
          <Text style={styles.cardLabel}>KEMAJUAN HARI INI</Text>
          <Text style={styles.ratioText}>
            {completed} dari {total} selesai
          </Text>
          <Text style={styles.feedbackText}>{message}</Text>
        </View>

        {/* Teks Persentase Sangat Besar & Menonjol */}
        <View style={styles.percentageContainer}>
          <Text style={styles.percentageText}>{percentage}%</Text>
        </View>
      </View>

      {/* Linear Progress Bar Berlatar Kontras Tinggi */}
      <View
        style={styles.progressTrack}
        accessible={true}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: 100, now: percentage }}
      >
        <View style={[styles.progressFill, { width: `${percentage}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.primary, // Indigo Modern (#4F46E5) penuh
    marginHorizontal: 20,
    marginTop: 6,
    marginBottom: 20,
    borderRadius: 24, // Melengkung besar 24px
    padding: 24,
    // Drop shadow tebal tapi lembut khas Soft-UI
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.32,
    shadowRadius: 18,
    elevation: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  leftInfo: {
    flex: 1,
    paddingRight: 16,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.78)',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  ratioText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 4,
    letterSpacing: 0.2,
  },
  feedbackText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.88)',
    marginTop: 6,
    lineHeight: 18,
  },
  percentageContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  percentageText: {
    fontSize: 40,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1.4,
  },
  progressTrack: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.24)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
  },
});

