import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from '../../constants/colors';

type TimeRange = 'week' | 'month' | 'all';

export default function StatsScreen() {
  const [timeRange, setTimeRange] = useState<TimeRange>('week');

  // Data aktivitas 7 hari terakhir (Stitch Weekly Bar Chart)
  const weeklyData = [
    { day: 'Sen', percent: 70, label: '70%' },
    { day: 'Sel', percent: 85, label: '85%' },
    { day: 'Rab', percent: 60, label: '60%' },
    { day: 'Kam', percent: 100, label: '100%', isHighlight: true },
    { day: 'Jum', percent: 90, label: '90%' },
    { day: 'Sab', percent: 75, label: '75%' },
    { day: 'Min', percent: 80, label: '80%' },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Statistik */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Statistik & Performa 📊</Text>
            <Text style={styles.headerSubtitle}>
              Pantau momentum dan konsistensi harianmu
            </Text>
          </View>
          <View style={styles.headerIconBadge}>
            <Text style={styles.headerIconText}>📈</Text>
          </View>
        </View>

        {/* Filter Rentang Waktu (Pill Selector) */}
        <View style={styles.filterPillContainer}>
          <Pressable
            style={[
              styles.filterPill,
              timeRange === 'week' && styles.filterPillActive,
            ]}
            onPress={() => setTimeRange('week')}
          >
            <Text
              style={[
                styles.filterPillText,
                timeRange === 'week' && styles.filterPillTextActive,
              ]}
            >
              Minggu Ini
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterPill,
              timeRange === 'month' && styles.filterPillActive,
            ]}
            onPress={() => setTimeRange('month')}
          >
            <Text
              style={[
                styles.filterPillText,
                timeRange === 'month' && styles.filterPillTextActive,
              ]}
            >
              Bulan Ini
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterPill,
              timeRange === 'all' && styles.filterPillActive,
            ]}
            onPress={() => setTimeRange('all')}
          >
            <Text
              style={[
                styles.filterPillText,
                timeRange === 'all' && styles.filterPillTextActive,
              ]}
            >
              Semua
            </Text>
          </Pressable>
        </View>

        {/* Ringkasan Bento Grid 2 Kolom */}
        <View style={styles.bentoRow}>
          {/* Kartu 1: Current Streak (Warm Glow Accent 🔥) */}
          <View style={styles.bentoCard}>
            <View style={styles.cardGlowAmber} />
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>Current Streak</Text>
              <View style={styles.fireCircle}>
                <Text style={styles.fireEmoji}>🔥</Text>
              </View>
            </View>
            <Text style={styles.streakNumber}>5 Hari</Text>
            <Text style={styles.streakSub}>Berturut-turut</Text>

            <View style={styles.recordChip}>
              <Text style={styles.recordIcon}>🎖️</Text>
              <Text style={styles.recordText}>
                Rekor: <Text style={styles.recordBold}>14 hari</Text>
              </Text>
            </View>
          </View>

          {/* Kartu 2: Tingkat Keberhasilan (🎯) */}
          <View style={styles.bentoCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>Tingkat Berhasil</Text>
              <View style={styles.targetCircle}>
                <Text style={styles.targetEmoji}>🎯</Text>
              </View>
            </View>
            <View style={styles.percentRow}>
              <Text style={styles.percentNumber}>85%</Text>
              <Text style={styles.percentSub}>Selesai</Text>
            </View>

            <View style={styles.badgeHighlight}>
              <View style={styles.miniRing}>
                <Text style={styles.miniRingText}>✓</Text>
              </View>
              <Text style={styles.badgeHighlightText}>Sangat Tinggi 🔥</Text>
            </View>
          </View>
        </View>

        {/* Kartu 3: Full Width Bento Card (Habit Aktif & Waktu Fokus) */}
        <View style={styles.fullBentoCard}>
          <View style={styles.bentoHalf}>
            <View style={styles.roundIconIndigo}>
              <Text style={styles.innerIcon}>☑️</Text>
            </View>
            <View>
              <Text style={styles.statLarge}>5 Habit</Text>
              <Text style={styles.statLabel}>Aktif Setiap Hari</Text>
            </View>
          </View>

          <View style={styles.verticalDivider} />

          <View style={styles.bentoHalf}>
            <View style={styles.roundIconAmber}>
              <Text style={styles.innerIcon}>⏱️</Text>
            </View>
            <View>
              <Text style={styles.statLarge}>45 Jam</Text>
              <Text style={styles.statLabel}>Waktu Fokus</Text>
            </View>
          </View>
        </View>

        {/* Weekly Activity Bar Chart (Aktivitas 7 Hari) */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartTitle}>Aktivitas Mingguan</Text>
              <Text style={styles.chartSub}>Rata-rata 85% penyelesaian</Text>
            </View>
            <View style={styles.chartTag}>
              <Text style={styles.chartTagText}>7 Hari Terakhir</Text>
            </View>
          </View>

          {/* Batang Diagram Grafik */}
          <View style={styles.barsContainer}>
            {weeklyData.map((item, index) => {
              const isKamis = item.isHighlight;
              return (
                <View key={index} style={styles.barColumn}>
                  {isKamis ? (
                    <View style={styles.topBadgeBounce}>
                      <Text style={styles.topBadgeText}>100%</Text>
                    </View>
                  ) : null}

                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        { height: `${item.percent}%` },
                        isKamis ? styles.barHighlight : styles.barDefault,
                      ]}
                    />
                  </View>
                  <Text
                    style={[
                      styles.dayText,
                      isKamis && styles.dayTextHighlight,
                    ]}
                  >
                    {item.day}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Kartu Motivasi Momentum */}
        <View style={styles.delightCard}>
          <View style={styles.delightIconWrap}>
            <Text style={styles.delightIcon}>⚡</Text>
          </View>
          <View style={styles.delightTextWrap}>
            <Text style={styles.delightTitle}>Pertahankan Ritme!</Text>
            <Text style={styles.delightBody}>
              Kamu sudah menyelesaikan 85% kebiasaan minggu ini. Hanya butuh 2 hari lagi untuk memecahkan rekor mingguanmu!
            </Text>
          </View>
        </View>

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
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
  },
  headerIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconText: {
    fontSize: 20,
  },
  // Filter Pil Rentang Waktu
  filterPillContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0', // Slate 200
    borderRadius: 30,
    padding: 4,
    marginBottom: 20,
  },
  filterPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterPillActive: {
    backgroundColor: COLORS.primary, // #4F46E5
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 2,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  // Bento Row 2 Kolom
  bentoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  bentoCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
  },
  cardGlowAmber: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(254, 166, 25, 0.2)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  fireCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fireEmoji: {
    fontSize: 14,
  },
  targetCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetEmoji: {
    fontSize: 14,
  },
  streakNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
    lineHeight: 26,
  },
  streakSub: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D97706', // Amber 600
    marginTop: 2,
  },
  recordChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginTop: 10,
    gap: 4,
  },
  recordIcon: {
    fontSize: 12,
  },
  recordText: {
    fontSize: 10,
    color: '#64748B',
  },
  recordBold: {
    fontWeight: '800',
    color: '#1E293B',
  },
  percentRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  percentNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
  },
  percentSub: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  badgeHighlight: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4', // Emerald 50
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginTop: 10,
    gap: 5,
  },
  miniRing: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniRingText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  badgeHighlightText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  // Full Width Bento Card
  fullBentoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
  },
  bentoHalf: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  roundIconIndigo: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundIconAmber: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerIcon: {
    fontSize: 18,
  },
  statLarge: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  verticalDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 8,
  },
  // Weekly Bar Chart
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  chartSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  chartTag: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
  },
  chartTagText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '800',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 140,
    paddingTop: 18,
    paddingBottom: 4,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  topBadgeBounce: {
    position: 'absolute',
    top: -2,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  topBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  barTrack: {
    width: 22,
    height: '80%',
    backgroundColor: '#F1F5F9', // Slate 100
    borderRadius: 11,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: 11,
  },
  barDefault: {
    backgroundColor: '#CBD5E1', // Slate 300
  },
  barHighlight: {
    backgroundColor: COLORS.primary, // #4F46E5
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
  },
  dayText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 8,
  },
  dayTextHighlight: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  // Delight Card
  delightCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  delightIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEA619',
    alignItems: 'center',
    justifyContent: 'center',
  },
  delightIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  delightTextWrap: {
    flex: 1,
  },
  delightTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#312E81',
  },
  delightBody: {
    fontSize: 12,
    color: '#4338CA',
    lineHeight: 17,
    marginTop: 2,
  },
  bottomSpacer: {
    height: 100, // Ruang agar konten tidak tertutup floating bottom nav bar
  },
});
