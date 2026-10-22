import { Link } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from '../constants/colors';
import { useAuth } from '../hooks/AuthContext';

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!email.trim() || !password) return setError('Email dan kata sandi wajib diisi.');
    if (password.length < 6) return setError('Kata sandi minimal terdiri dari 6 karakter.');
    if (password !== confirmation) return setError('Konfirmasi kata sandi tidak sama.');

    setIsSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      const requiresConfirmation = await signUp(email, password);
      setMessage(requiresConfirmation ? 'Akun dibuat. Periksa email untuk mengonfirmasi akun, lalu masuk.' : 'Akun berhasil dibuat. Anda sedang diarahkan ke beranda.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Pendaftaran gagal. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.form}>
            <Text style={styles.title}>Buat akun baru</Text>
            <Text style={styles.subtitle}>Mulai membangun kebiasaan positif hari ini.</Text>
            {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
            {message ? <Text accessibilityRole="alert" style={styles.success}>{message}</Text> : null}
            <Text style={styles.label}>EMAIL</Text>
            <TextInput autoCapitalize="none" autoComplete="email" keyboardType="email-address" onChangeText={(value) => { setEmail(value); setError(null); }} placeholder="nama@email.com" placeholderTextColor={COLORS.textMuted} style={styles.input} value={email} />
            <Text style={styles.label}>KATA SANDI</Text>
            <TextInput autoCapitalize="none" autoComplete="new-password" onChangeText={(value) => { setPassword(value); setError(null); }} placeholder="Minimal 6 karakter" placeholderTextColor={COLORS.textMuted} secureTextEntry style={styles.input} value={password} />
            <Text style={styles.label}>KONFIRMASI KATA SANDI</Text>
            <TextInput autoCapitalize="none" autoComplete="new-password" onChangeText={(value) => { setConfirmation(value); setError(null); }} placeholder="Ulangi kata sandi" placeholderTextColor={COLORS.textMuted} secureTextEntry style={styles.input} value={confirmation} />
            <Pressable accessibilityRole="button" disabled={isSubmitting} onPress={handleRegister} style={({ pressed }) => [styles.primaryButton, (pressed || isSubmitting) && styles.primaryButtonPressed]}>
              {isSubmitting ? <ActivityIndicator color={COLORS.textOnPrimary} /> : <Text style={styles.primaryButtonText}>Daftar</Text>}
            </Pressable>
            <Text style={styles.footer}>Sudah punya akun? <Link href="/login" style={styles.link}>Masuk</Link></Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.surface },
  keyboardView: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  form: { alignSelf: 'center', maxWidth: 420, width: '100%' },
  title: { color: COLORS.textPrimary, fontSize: 28, fontWeight: '800', textAlign: 'center' },
  subtitle: { color: COLORS.textSecondary, fontSize: 14, marginBottom: 24, marginTop: 6, textAlign: 'center' },
  label: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '700', letterSpacing: 0.8, marginBottom: 8, marginTop: 14 },
  input: { backgroundColor: COLORS.background, borderColor: COLORS.border, borderRadius: 14, borderWidth: 1, color: COLORS.textPrimary, fontSize: 16, height: 52, paddingHorizontal: 16 },
  error: { backgroundColor: COLORS.dangerLight, borderRadius: 12, color: COLORS.danger, fontSize: 13, fontWeight: '600', padding: 12 },
  success: { backgroundColor: '#D1FAE5', borderRadius: 12, color: '#047857', fontSize: 13, fontWeight: '600', padding: 12 },
  primaryButton: { alignItems: 'center', backgroundColor: COLORS.primary, borderRadius: 28, height: 54, justifyContent: 'center', marginTop: 28 },
  primaryButtonPressed: { backgroundColor: COLORS.primaryDark, opacity: 0.8 },
  primaryButtonText: { color: COLORS.textOnPrimary, fontSize: 16, fontWeight: '700' },
  footer: { color: COLORS.textSecondary, fontSize: 14, marginTop: 22, textAlign: 'center' },
  link: { color: COLORS.primary, fontWeight: '800' },
});
