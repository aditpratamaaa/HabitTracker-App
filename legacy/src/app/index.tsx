import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHabits } from '../hooks/useHabits';
import { HeaderOverview } from '../components/HeaderOverview';
import { ProgressCard } from '../components/ProgressCard';
import { HabitCard } from '../components/HabitCard';
import { AddHabitModal } from '../components/AddHabitModal';
import { EmptyState } from '../components/EmptyState';
import { COLORS } from '../constants/theme';

export default function HomeScreen() {
  const {
    habits,
    isLoading,
    todayStr,
    stats,
    toggleHabit,
    addHabit,
    deleteHabit,
  } = useHabits();

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
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

            {/* Kartu Kemajuan Harian */}
            <ProgressCard stats={stats} />

            {/* Judul Bagian Daftar */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>DAFTAR KEBIASAAN HARI INI</Text>
              <Text style={styles.sectionSubtitle}>
                {habits.length} kebiasaan aktif
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

          {/* Floating Action Button (FAB) Tambah Kebiasaan */}
          <TouchableOpacity
            style={styles.fab}
            onPress={() => setIsModalOpen(true)}
            activeOpacity={0.8}
            accessibilityLabel="Tambah kebiasaan baru"
          >
            <Text style={styles.fabIcon}>+</Text>
          </TouchableOpacity>

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
    height: 70,
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
  fabIcon: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '400',
    lineHeight: 36,
  },
});
