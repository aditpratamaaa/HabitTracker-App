import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../constants/colors';

type ProgressData = {
  percentage: number;
  completed: number;
  total: number;
};

type ProgressCardProps = {
  progress: ProgressData;
};

/**
 * ProgressCard - Daily Progress Hero Card (Stitch Design Specification)
 * Melayang di atas Curved Navy Header dengan rounded 28px,
 * badge DAILY PROGRESS, motivasi kontekstual, dan lencana progres lingkaran.
 */
export function ProgressCard({ progress }: ProgressCardProps) {
  const { percentage, completed, total } = progress;

  // Pesan motivasi dinamis mengikuti Stitch design
  let headline = 'Mulai langkah hari ini!';
  if (percentage === 100 && total > 0) {
    headline = 'Sempurna! Semua tuntas 🎉';
  } else if (percentage >= 60) {
    headline = 'Hampir selesai! Mantap 💪';
  } else if (percentage > 0) {
    headline = 'Momentum sedang berjalan!';
  }

  return (
    <View style={styles.cardWrapper}>
      <View style={styles.card}>
        {/* Dekorasi Glow Lembut */}
        <View style={styles.glowTopLeft} />
        <View style={styles.glowBottomRight} />

        {/* Konten Kiri */}
        <View style={styles.leftContent}>
          <View style={styles.badgePill}>
            <Text style={styles.badgeText}>DAILY PROGRESS</Text>
          </View>

          <Text style={styles.headlineText} numberOfLines={1}>
            {headline}
          </Text>

          <View style={styles.statsRow}>
            <Text style={styles.checkIcon}>✓</Text>
            <Text style={styles.statsText}>
              {completed} dari {total} kebiasaan selesai
            </Text>
          </View>

          {/* Batang Progres Mini */}
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.min(100, Math.max(0, percentage))}%` },
              ]}
            />
          </View>
        </View>

        {/* Lingkaran Radial Persentase (Kanan) */}
        <View style={styles.radialContainer}>
          <View style={styles.radialCircle}>
            <Text style={styles.percentageNumber}>{percentage}%</Text>
            <Text style={styles.percentageLabel}>SELESAI</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    paddingHorizontal: 20,
    marginTop: -26, // Floating overlap melayang di atas Curved Navy Header
    zIndex: 20,
  },
  card: {
    backgroundColor: COLORS.primary, // #4F46E5
    borderRadius: 28,
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 8,
  },
  glowTopLeft: {
    position: 'absolute',
    top: -30,
    left: -30,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  glowBottomRight: {
    position: 'absolute',
    bottom: -30,
    right: -30,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(99, 102, 241, 0.45)', // Indigo 500
  },
  leftContent: {
    flex: 1,
    paddingRight: 14,
  },
  badgePill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 6,
  },
  badgeText: {
    color: '#E0E7FF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  headlineText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 4,
  },
  checkIcon: {
    color: '#C7D2FE',
    fontSize: 13,
    fontWeight: '800',
  },
  statsText: {
    color: '#E0E7FF',
    fontSize: 12,
    fontWeight: '500',
  },
  progressBarTrack: {
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: 3,
    marginTop: 10,
    overflow: 'hidden',
    maxWidth: 180,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  radialContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radialCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageNumber: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 22,
  },
  percentageLabel: {
    color: '#E0E7FF',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginTop: 1,
  },
});
