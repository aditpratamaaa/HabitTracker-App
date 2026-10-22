import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DUMMY_CREDENTIALS } from '../constants/auth';
import { COLORS } from '../constants/colors';
import { useAuth } from '../hooks/AuthContext';

/**
 * Layar Masuk (Login Screen) - Desain TaskFlow Modern Soft-UI
 * Memenuhi standar Aksesibilitas WCAG 2.1 & Inclusive Design.
 */
export default function LoginScreen() {
  const { signIn, signInDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Validasi lokal sebelum memanggil AuthContext
  const handleLogin = async () => {
    setErrorMessage('');

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail && !trimmedPassword) {
      setErrorMessage('Email dan kata sandi wajib diisi.');
      return;
    }

    if (!trimmedEmail) {
      setErrorMessage('Alamat email tidak boleh kosong.');
      return;
    }

    if (!trimmedPassword) {
      setErrorMessage('Kata sandi tidak boleh kosong.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signIn(trimmedEmail, trimmedPassword);
      // Pengalihan ke dasbor dilakukan oleh AuthSessionRedirect.
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : 'Terjadi kesalahan saat masuk.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoQuickLogin = async () => {
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      await signInDemo();
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : 'Gagal masuk akun demo.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setEmail(DUMMY_CREDENTIALS.email);
    setPassword(DUMMY_CREDENTIALS.password);
    setErrorMessage('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            {/* Header Bagian Atas: Badge & Teks TaskFlow */}
            <View style={styles.header}>
              <View style={styles.logoBadge} accessible={false}>
                <Text style={styles.logoIcon}>✨</Text>
              </View>
              <Text
                style={styles.title}
                accessible={true}
                accessibilityRole="header"
              >
                Welcome back!
              </Text>
              <Text style={styles.subtitle}>
                Login to continue
              </Text>
            </View>

            {/* Kartu Informasi & Akses Cepat Akun Demo */}
            <View
              style={styles.demoCard}
              accessible={true}
              accessibilityRole="summary"
              accessibilityLabel="Bagian Akun Demo Pengujian"
            >
              <View style={styles.demoCardHeader}>
                <Text style={styles.demoBadge}>⚡ AKUN DEMO TERSEDIA</Text>
              </View>
              <Text style={styles.demoDescription}>
                Ingin langsung mencoba fitur aplikasi tanpa setup database? Gunakan akun demo di bawah:
              </Text>

              <View style={styles.demoCredBox}>
                <View style={styles.demoCredRow}>
                  <Text style={styles.demoCredLabel}>Email:</Text>
                  <Text style={styles.demoCredValue}>{DUMMY_CREDENTIALS.email}</Text>
                </View>
                <View style={styles.demoCredRow}>
                  <Text style={styles.demoCredLabel}>Sandi:</Text>
                  <Text style={styles.demoCredValue}>{DUMMY_CREDENTIALS.password}</Text>
                </View>
              </View>

              <View style={styles.demoActionRow}>
                <Pressable
                  style={({ pressed }) => [
                    styles.demoQuickLoginButton,
                    pressed && styles.demoButtonPressed,
                    isSubmitting && styles.buttonDisabled,
                  ]}
                  onPress={handleDemoQuickLogin}
                  disabled={isSubmitting}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Masuk instan dengan akun demo"
                >
                  <Text style={styles.demoQuickLoginText}>🚀 Masuk Cepat (1-Klik)</Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.demoFillButton,
                    pressed && styles.demoButtonPressed,
                  ]}
                  onPress={handleFillDemo}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Isi otomatis form dengan akun demo"
                >
                  <Text style={styles.demoFillText}>📝 Isi Form</Text>
                </Pressable>
              </View>
            </View>

            {/* Pesan Validasi Error (Jelas & Ramah Aksesibilitas) */}
            {errorMessage ? (
              <View
                style={styles.errorBanner}
                accessible={true}
                accessibilityRole="alert"
                accessibilityLabel={`Peringatan: ${errorMessage}`}
              >
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Input Email - Border Abu-Abu Tipis, Radius 14px, Padding 16px */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel} nativeID="emailLabel">
                EMAIL
              </Text>
              <TextInput
                style={[
                  styles.roundedInput,
                  Boolean(errorMessage && !email.trim()) && styles.inputError,
                ]}
                placeholder="nama@email.com"
                placeholderTextColor={COLORS.textMuted}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errorMessage) setErrorMessage('');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                accessible={true}
                accessibilityLabel="Alamat Email"
                accessibilityHint="Masukkan alamat email akun Anda"
                aria-labelledby="emailLabel"
              />
            </View>

            {/* Input Password - Border Abu-Abu Tipis, Radius 14px, Padding 16px & Toggle Mata */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel} nativeID="passwordLabel">
                KATA SANDI
              </Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[
                    styles.roundedInput,
                    styles.passwordInput,
                    Boolean(errorMessage && !password.trim()) && styles.inputError,
                  ]}
                  placeholder="Masukkan kata sandi..."
                  placeholderTextColor={COLORS.textMuted}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errorMessage) setErrorMessage('');
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  accessible={true}
                  accessibilityLabel="Kata Sandi"
                  accessibilityHint="Masukkan kata sandi rahasia Anda"
                  aria-labelledby="passwordLabel"
                />
                <Pressable
                  style={styles.eyeButton}
                  onPress={() => setShowPassword((prev) => !prev)}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={
                    showPassword
                      ? 'Sembunyikan kata sandi'
                      : 'Tampilkan kata sandi'
                  }
                  accessibilityHint="Beralih untuk melihat atau menyembunyikan teks kata sandi"
                  hitSlop={8}
                >
                  <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '🙈'}</Text>
                </Pressable>
              </View>
            </View>

            {/* Tombol Login: Pill Shape (borderRadius: 30), Warna Primary Indigo, Teks Putih Tebal & Bayangan */}
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed,
                isSubmitting && styles.buttonDisabled,
              ]}
              onPress={handleLogin}
              disabled={isSubmitting}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Masuk ke aplikasi"
              accessibilityHint="Menekan tombol ini akan memvalidasi akun dan masuk ke dasbor kebiasaan"
            >
              {isSubmitting ? (
                <ActivityIndicator color={COLORS.textOnPrimary} size="small" />
              ) : (
                <Text style={styles.primaryButtonText}>Masuk</Text>
              )}
            </Pressable>

            <Text style={styles.registerPrompt}>
              Belum punya akun?{' '}
              <Link href={'/register' as never} style={styles.registerLink}>
                Daftar sekarang
              </Link>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface, // Putih murni (#FFFFFF)
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 420,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  logoIcon: {
    fontSize: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginTop: 6,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  // Kartu Demo Modern Soft-UI
  demoCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 20,
  },
  demoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  demoBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.8,
  },
  demoDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 10,
  },
  demoCredBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  demoCredRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  demoCredLabel: {
    width: 54,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  demoCredValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primaryDark,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  demoActionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  demoQuickLoginButton: {
    flex: 1.4,
    height: 40,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoQuickLoginText: {
    color: COLORS.textOnPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  demoFillButton: {
    flex: 1,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoFillText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  demoButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.dangerLight,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  errorText: {
    flex: 1,
    color: COLORS.danger,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  // Input: Border abu-abu tipis (1px), radius besar (14px), padding 16px, background lembut
  roundedInput: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    fontSize: 15,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.background, // Slate 50
  },
  inputError: {
    borderColor: COLORS.danger,
    backgroundColor: COLORS.dangerLight,
  },
  passwordWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  passwordInput: {
    paddingRight: 52,
  },
  eyeButton: {
    position: 'absolute',
    right: 4,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  eyeIcon: {
    fontSize: 18,
  },
  // Tombol Login: Pill Shape (borderRadius: 30), Warna Primary Indigo, Teks Putih Tebal & Bayangan
  primaryButton: {
    width: '100%',
    height: 54,
    backgroundColor: COLORS.primary, // Indigo (#4F46E5)
    borderRadius: 30, // Pill Shape melengkung
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryButtonPressed: {
    backgroundColor: COLORS.primaryDark,
    transform: [{ scale: 0.985 }],
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textOnPrimary,
    letterSpacing: 0.3,
  },
  registerPrompt: {
    marginTop: 24,
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  registerLink: {
    color: COLORS.primary,
    fontWeight: '800',
  },
});


