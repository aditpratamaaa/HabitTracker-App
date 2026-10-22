import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getFormattedHeaderDate, getGreetingText } from '../utils/dateUtils';
import { COLORS } from '../constants/theme';

export function HeaderOverview() {
  const dateFormatted = getFormattedHeaderDate();
  const { greeting, motivationalText } = getGreetingText();

  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>{dateFormatted.toUpperCase()}</Text>
      <Text style={styles.greetingText}>{greeting}</Text>
      <Text style={styles.motivationText}>{motivationalText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  greetingText: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  motivationText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
    lineHeight: 20,
  },
});
