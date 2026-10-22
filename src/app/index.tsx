import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AddHabitModal } from '../components/AddHabitModal';
import { EmptyState } from '../components/EmptyState';
import { HabitCard } from '../components/HabitCard';
import { HeaderOverview } from '../components/HeaderOverview';
import { ProgressCard } from '../components/ProgressCard';
import { COLORS } from '../constants/colors';
import { useHabits } from '../hooks/useHabits';


export default function HomeScreen() {
  const {
    habits,
    isLoading,
    error,
    todayStr,
    progress,
    isDemo,
    toggleHabit,
    addHabit,
    deleteHabit,
    refreshHabits,
  } = useHabits();

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {isLoading ? (
        <View
          style={styles.loadingContainer}
          accessible={true}
          accessibilityRole="alert"
          accessibilityLabel="Memuat kebiasaan..."
        >
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Memuat kebiasaanmu...</Text>
        </View>
      ) : (
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header Tanggal & Salam Dinamis */}
            <HeaderOverview />

            {/* Banner Mode Demo */}
            {isDemo ? (
              <View
                style={styles.demoBanner}
                accessible={true}
                accessibilityRole="summary"
                accessibilityLabel="Mode Demo Aktif: Data tersimpan di penyimpanan lokal"
              >
                <Text style={styles.demoBannerText}>
                  ✨ <Text style={styles.demoBannerBold}>Mode Demo Aktif:</Text> Data kebiasaan disimpan secara lokal.
                </Text>
              </View>
            ) : null}

            {error ? (
              <View
                style={styles.errorState}
                accessible={true}
                accessibilityRole="alert"
              >
                <Text style={styles.errorText}>{error}</Text>
                <Pressable
                  onPress={() => void refreshHabits()}
                  style={styles.retryButton}
                  accessibilityRole="button"
                  accessibilityLabel="Coba muat ulang kebiasaan"
                >
                  <Text style={styles.retryButtonText}>Coba lagi</Text>
                </Pressable>
              </View>
            ) : null}

            {/* Kartu Kemajuan Harian */}
            <ProgressCard progress={progress} />

            {/* Judul Bagian Daftar */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>DAFTAR KEBIASAAN HARI INI</Text>
              <Text
                style={styles.sectionSubtitle}
                accessibilityLabel={`${habits.length} kebiasaan aktif`}
              >
                {habits.length} aktif
              </Text>
            </View>

            {/* Daftar Kebiasaan / Empty State */}
            {habits.length === 0 ? (
              <EmptyState />
            ) : (
              habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  todayStr={todayStr}
                  onToggle={toggleHabit}
                  onDelete={deleteHabit}
                />
              ))
            )}

            {/* Padding bawah agar item paling bawah tidak tertutup FAB */}
            <View style={styles.bottomSpacer} />
          </ScrollView>

          {/* Floating Action Button (FAB) Tambah Kebiasaan (Ukuran 60x60px > min 44x44px) */}
          <Pressable
            style={({ pressed }) => [
              styles.fab,
              pressed && styles.fabPressed,
            ]}
            onPress={() => setIsModalOpen(true)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Tambah kebiasaan baru"
            accessibilityHint="Membuka formulir pop-up untuk menambahkan kebiasaan baru"
          >
            <Text style={styles.fabIcon}>+</Text>
          </Pressable>

          {/* Modal Input Kebiasaan Baru */}
          <AddHabitModal
            visible={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={addHabit}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    position: 'relative',
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  demoBanner: {
    marginHorizontal: 20,
    marginBottom: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#EEF2FF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  demoBannerText: {
    fontSize: 13,
    color: COLORS.primaryDark,
    lineHeight: 18,
  },
  demoBannerBold: {
    fontWeight: '700',
    color: COLORS.primary,
  },
  errorState: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    backgroundColor: COLORS.dangerLight,
    borderRadius: 16,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
  },
  retryButton: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: COLORS.danger,
    borderRadius: 10,
  },
  retryButtonText: {
    color: COLORS.textOnPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  bottomSpacer: {
    height: 80,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  fabPressed: {
    backgroundColor: COLORS.primaryDark,
    transform: [{ scale: 0.96 }],
  },
  fabIcon: {
    fontSize: 32,
    color: COLORS.textOnPrimary,
    fontWeight: '400',
    lineHeight: 36,
  },
});
