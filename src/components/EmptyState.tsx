import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../constants/colors';


export function EmptyState() {
  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel="Belum ada kebiasaan. Setiap perubahan besar dimulai dari satu langkah kecil. Ketuk tombol tambah di bawah untuk membuat kebiasaan pertamamu."
    >
      <Text style={styles.emoji}>🌱</Text>
      <Text style={styles.title}>Belum Ada Kebiasaan</Text>
      <Text style={styles.description}>
        Setiap perubahan besar dimulai dari satu langkah kecil. Ketuk tombol plus (+) di bawah untuk membuat kebiasaan pertamamu!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    paddingVertical: 48,
  },
  emoji: {
    fontSize: 54,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
