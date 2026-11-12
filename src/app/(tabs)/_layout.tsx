import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../constants/colors';

/**
 * Tab Icon Component dengan micro-interaction dan visual badge TaskFlow Stitch
 */
function TabIcon({
  emoji,
  label,
  focused,
}: {
  emoji: string;
  label: string;
  focused: boolean;
}) {
  return (
    <View style={styles.tabItem}>
      <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
        <Text style={[styles.tabEmoji, focused && styles.tabEmojiFocused]}>
          {emoji}
        </Text>
      </View>
      <Text
        style={[
          styles.tabLabel,
          focused ? styles.tabLabelFocused : styles.tabLabelInactive,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

/**
 * Layout Navigasi Tab Bawah (Floating Pill-Shaped Soft-UI Nav Bar)
 * Mengikuti spesifikasi desain TaskFlow Kinetic di stitch_habittracker_mobile_app_ui
 */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" label="Beranda" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Statistik',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📊" label="Statistik" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="👤" label="Profil" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 20,
    right: 20,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 10,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    minWidth: 64,
  },
  iconContainer: {
    width: 34,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  iconContainerFocused: {
    backgroundColor: COLORS.primarySoft,
  },
  tabEmoji: {
    fontSize: 18,
    opacity: 0.75,
  },
  tabEmojiFocused: {
    fontSize: 19,
    opacity: 1,
    transform: [{ scale: 1.08 }],
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  tabLabelFocused: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  tabLabelInactive: {
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});
