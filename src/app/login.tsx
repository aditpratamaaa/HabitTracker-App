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

export default function LoginScreen() {
  const { signIn, signInDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    setErrorMessage('');
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setErrorMessage('Alamat email dan kata sandi wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signIn(trimmedEmail, trimmedPassword);
    } catch (error) {
      const rawMsg =
        error instanceof Error ? error.message : 'Terjadi kesalahan saat masuk.';
      const msg =
        rawMsg.toLowerCase().includes('invalid login credentials') ||
        rawMsg.toLowerCase().includes('invalid credentials')
          ? 'Email atau kata sandi salah. Silakan periksa kembali.'
          : rawMsg;
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
      setErrorMessage(
        error instanceof Error ? error.message : 'Gagal masuk akun demo.'
      );
    } finally {
      setIsSubmitting(false);
    }
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
            {/* Brand Mascot / Header Icon Badge dengan Streak Chip 7d */}
            <View style={styles.brandHeader}>
              <View style={styles.iconBadgeWrapper}>
                <View style={styles.ambientGlow} />
                <View style={styles.iconBadgeBox}>
                  <Text style={styles.checklistIcon}>✓</Text>
                </View>
                {/* Playful Micro Streak Chip (Stitch Feature) */}
                <View style={styles.streakChip}>
                  <Text style={styles.streakChipFlame}>🔥</Text>
                  <Text style={styles.streakChipText}>7d</Text>
                </View>
              </View>

              <Text style={styles.title}>Selamat Datang Kembali! 👋</Text>
              <Text style={styles.subtitle}>
                Lanjutkan konsistensi membangun kebiasaan baik setiap hari.
              </Text>
            </View>

            {/* Main Login Card */}
            <View style={styles.loginCard}>
              {/* Quick Demo Access Card */}
              <View style={styles.demoCard}>
                <View style={styles.demoHeader}>
                  <Text style={styles.demoBadge}>⚡ AKUN DEMO PENGUJIAN</Text>
                </View>
                <Text style={styles.demoDesc}>
                  Email: <Text style={styles.bold}>{DUMMY_CREDENTIALS.email}</Text> | Sandi: <Text style={styles.bold}>{DUMMY_CREDENTIALS.password}</Text>
                </Text>
                <Pressable
                  style={({ pressed }) => [
                    styles.demoQuickBtn,
                    pressed && styles.btnPressed,
                    isSubmitting && styles.btnDisabled,
                  ]}
                  onPress={handleDemoQuickLogin}
                  disabled={isSubmitting}
                >
                  <Text style={styles.demoQuickText}>🚀 Masuk Cepat (Akun Demo)</Text>
                </Pressable>
              </View>

              {/* Error Banner jika ada kesalahan */}
              {errorMessage ? (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorIcon}>⚠️</Text>
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              ) : null}

              {/* Form Input Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Alamat Email</Text>
                <View style={styles.inputBoxWrapper}>
                  <Text style={styles.inputLeftIcon}>✉️</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="nama@email.com"
                    placeholderTextColor={COLORS.textMuted}
                    value={email}
                    onChangeText={(t) => {
                      setEmail(t);
                      if (errorMessage) setErrorMessage('');
                    }}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Form Input Kata Sandi */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Kata Sandi</Text>
                <View style={styles.inputBoxWrapper}>
                  <Text style={styles.inputLeftIcon}>🔒</Text>
                  <TextInput
                    style={[styles.textInput, styles.passwordTextInput]}
                    placeholder="••••••••"
                    placeholderTextColor={COLORS.textMuted}
                    value={password}
                    onChangeText={(t) => {
                      setPassword(t);
                      if (errorMessage) setErrorMessage('');
                    }}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <Pressable
                    style={styles.eyeBtn}
                    onPress={() => setShowPassword((prev) => !prev)}
                    hitSlop={8}
                  >
                    <Text style={styles.eyeEmoji}>
                      {showPassword ? '👁️' : '🙈'}
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Remember Me & Forgot Password Row */}
              <View style={styles.optionsRow}>
                <Pressable
                  style={styles.rememberMeRow}
                  onPress={() => setRememberMe(!rememberMe)}
                >
                  <View
                    style={[
                      styles.checkboxBox,
                      rememberMe && styles.checkboxBoxChecked,
                    ]}
                  >
                    {rememberMe ? (
                      <Text style={styles.checkboxCheckIcon}>✓</Text>
                    ) : null}
                  </View>
                  <Text style={styles.rememberMeText}>Ingat Saya</Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    alert('Gunakan email Anda untuk reset sandi melalui Supabase Auth.');
                  }}
                >
                  <Text style={styles.forgotText}>Lupa Kata Sandi?</Text>
                </Pressable>
              </View>

              {/* Primary Submit Pill Button */}
              <Pressable
                style={({ pressed }) => [
                  styles.submitBtn,
                  pressed && styles.btnPressed,
                  isSubmitting && styles.btnDisabled,
                ]}
                onPress={handleLogin}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <View style={styles.btnContentRow}>
                    <Text style={styles.submitBtnText}>Masuk ke Akun</Text>
                    <Text style={styles.arrowIcon}>→</Text>
                  </View>
                )}
              </Pressable>

              {/* Divider atau masuk dengan */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>atau masuk dengan</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Login Grid (Google & Apple) */}
              <View style={styles.socialGrid}>
                <Pressable
                  style={styles.socialBtn}
                  onPress={() => alert('Integrasi OAuth Google siap dihubungkan di Supabase.')}
                >
                  <Text style={styles.socialIconText}>🌐</Text>
                  <Text style={styles.socialBtnText}>Google</Text>
                </Pressable>

                <Pressable
                  style={styles.socialBtn}
                  onPress={() => alert('Integrasi Apple Sign In siap dihubungkan di Supabase.')}
                >
                  <Text style={styles.socialIconText}>🍎</Text>
                  <Text style={styles.socialBtnText}>Apple</Text>
                </Pressable>
              </View>
            </View>

            {/* Prompt Daftar Akun Baru */}
            <View style={styles.registerPromptRow}>
              <Text style={styles.promptText}>Belum punya akun?</Text>
              <Link href={'/register' as never} style={styles.registerLink}>
                Daftar Sekarang
              </Link>
            </View>

            {/* Ambient Habit Encouragement Toast (Stitch Specification) */}
            <View style={styles.toastCard}>
              <View style={styles.toastIconBox}>
                <Text style={styles.toastIcon}>✨</Text>
              </View>
              <Text style={styles.toastText}>
                <Text style={styles.bold}>87% pengguna</Text> mempertahankan kebiasaan sehat saat login secara teratur setiap pagi.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background, // #F8FAFC
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingVertical: 28,
    alignItems: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 420,
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconBadgeWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  ambientGlow: {
    position: 'absolute',
    inset: -6,
    borderRadius: 35,
    backgroundColor: 'rgba(79, 70, 229, 0.25)',
  },
  iconBadgeBox: {
    width: 60,
    height: 60,
    borderRadius: 22,
    backgroundColor: COLORS.primary, // #4F46E5
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  checklistIcon: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
  },
  streakChip: {
    position: 'absolute',
    bottom: -6,
    right: -8,
    backgroundColor: '#FEA619',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  streakChipFlame: {
    fontSize: 10,
  },
  streakChipText: {
    color: '#684000',
    fontSize: 10,
    fontWeight: '800',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 290,
  },
  // Kartu Kontainer Form
  loginCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  demoCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  demoHeader: {
    marginBottom: 4,
  },
  demoBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.6,
  },
  demoDesc: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 8,
  },
  bold: {
    fontWeight: '700',
    color: '#1E293B',
  },
  demoQuickBtn: {
    backgroundColor: '#EEF2FF',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  demoQuickText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.dangerLight,
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
    gap: 8,
  },
  errorIcon: {
    fontSize: 14,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  inputBoxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F3FF', // surfaceContainerLow
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
  },
  inputLeftIcon: {
    fontSize: 16,
    marginRight: 10,
    opacity: 0.6,
  },
  textInput: {
    flex: 1,
    color: '#1E293B',
    fontSize: 14,
    height: '100%',
  },
  passwordTextInput: {
    paddingRight: 32,
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
  },
  eyeEmoji: {
    fontSize: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 18,
  },
  rememberMeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxBoxChecked: {
    backgroundColor: COLORS.primary,
  },
  checkboxCheckIcon: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  rememberMeText: {
    fontSize: 12,
    color: '#64748B',
  },
  forgotText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  submitBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary, // #4F46E5
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 4,
  },
  btnContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  arrowIcon: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  btnPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  btnDisabled: {
    opacity: 0.65,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  socialGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  socialBtn: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  socialIconText: {
    fontSize: 16,
  },
  socialBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  registerPromptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 6,
  },
  promptText: {
    fontSize: 13,
    color: '#64748B',
  },
  registerLink: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
  },
  toastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 12,
    marginTop: 20,
    gap: 10,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  toastIconBox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastIcon: {
    fontSize: 14,
  },
  toastText: {
    fontSize: 11,
    color: '#3730A3',
    flex: 1,
    lineHeight: 16,
  },
});
