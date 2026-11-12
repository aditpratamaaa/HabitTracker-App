import { Link, useRouter } from 'expo-router';
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

import { COLORS } from '../constants/colors';
import { useAuth } from '../hooks/AuthContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Indikator kekuatan kata sandi 3 bar (Stitch specification)
  const passwordStrength =
    password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 9 ? 2 : 3;

  const handleRegister = async () => {
    if (!email.trim() || !password) {
      return setError('Alamat email dan kata sandi wajib diisi.');
    }
    if (password.length < 6) {
      return setError('Kata sandi minimal terdiri dari 6 karakter.');
    }
    if (password !== confirmation) {
      return setError('Konfirmasi kata sandi tidak sama.');
    }
    if (!agreeTerms) {
      return setError('Anda harus menyetujui Ketentuan Layanan & Kebijakan Privasi.');
    }

    setIsSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      const requiresConfirmation = await signUp(email, password);
      setMessage(
        requiresConfirmation
          ? 'Akun dibuat. Periksa email untuk mengonfirmasi akun, lalu masuk.'
          : 'Akun berhasil dibuat. Anda sedang diarahkan ke beranda.'
      );
    } catch (cause) {
      const raw = cause instanceof Error ? cause.message : 'Pendaftaran gagal.';
      const msg =
        raw.toLowerCase().includes('already registered') ||
        raw.toLowerCase().includes('user already exists')
          ? 'Email ini sudah terdaftar. Silakan langsung masuk ke akun Anda.'
          : raw;
      setError(msg);
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
            {/* Header dengan Tombol Kembali & Badge Tantangan 21 Hari */}
            <View style={styles.topBar}>
              <Pressable
                style={styles.backBtn}
                onPress={() => router.back()}
                hitSlop={8}
              >
                <Text style={styles.backIcon}>←</Text>
              </Pressable>

              <View style={styles.challengeBadge}>
                <Text style={styles.challengeFlame}>🔥</Text>
                <Text style={styles.challengeText}>Tantangan 21 Hari</Text>
              </View>
            </View>

            {/* Judul & Sapaan */}
            <View style={styles.titleSection}>
              <Text style={styles.title}>Mulai Langkah Baru ✨</Text>
              <Text style={styles.subtitle}>
                Daftar sekarang dan bentuk kebiasaan positif dalam 21 hari.
              </Text>
            </View>

            {/* Kartu Formulir Pendaftaran */}
            <View style={styles.registerCard}>
              {error ? (
                <View style={styles.errorBanner}>
                  <Text style={styles.bannerIcon}>⚠️</Text>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              {message ? (
                <View style={styles.successBanner}>
                  <Text style={styles.bannerIcon}>🎉</Text>
                  <Text style={styles.successText}>{message}</Text>
                </View>
              ) : null}

              {/* Input Nama Lengkap */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nama Lengkap</Text>
                <View style={styles.inputBox}>
                  <Text style={styles.leftInputIcon}>👤</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="contoh: Budi Pratama"
                    placeholderTextColor={COLORS.textMuted}
                    value={fullName}
                    onChangeText={setFullName}
                  />
                </View>
              </View>

              {/* Input Alamat Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Alamat Email</Text>
                <View style={styles.inputBox}>
                  <Text style={styles.leftInputIcon}>✉️</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="nama@email.com"
                    placeholderTextColor={COLORS.textMuted}
                    value={email}
                    onChangeText={(t) => {
                      setEmail(t);
                      if (error) setError(null);
                    }}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              </View>

              {/* Input Kata Sandi */}
              <View style={styles.inputGroup}>
                <View style={styles.passHeaderRow}>
                  <Text style={styles.inputLabel}>Kata Sandi</Text>
                  <Text style={styles.strengthLabelText}>
                    {passwordStrength === 0
                      ? 'Minimal 6 karakter'
                      : passwordStrength === 1
                      ? 'Lemah'
                      : passwordStrength === 2
                      ? 'Sedang'
                      : 'Kuat 🔥'}
                  </Text>
                </View>
                <View style={styles.inputBox}>
                  <Text style={styles.leftInputIcon}>🔒</Text>
                  <TextInput
                    style={[styles.textInput, styles.passwordInput]}
                    placeholder="Minimal 6 karakter"
                    placeholderTextColor={COLORS.textMuted}
                    value={password}
                    onChangeText={(t) => {
                      setPassword(t);
                      if (error) setError(null);
                    }}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <Pressable
                    style={styles.eyeBtn}
                    onPress={() => setShowPassword((p) => !p)}
                    hitSlop={8}
                  >
                    <Text>{showPassword ? '👁️' : '🙈'}</Text>
                  </Pressable>
                </View>

                {/* Indikator Kekuatan 3 Bar (Stitch Specification) */}
                <View style={styles.strengthBarsRow}>
                  <View
                    style={[
                      styles.strengthBar,
                      passwordStrength >= 1 && styles.barActiveRed,
                    ]}
                  />
                  <View
                    style={[
                      styles.strengthBar,
                      passwordStrength >= 2 && styles.barActiveAmber,
                    ]}
                  />
                  <View
                    style={[
                      styles.strengthBar,
                      passwordStrength >= 3 && styles.barActiveGreen,
                    ]}
                  />
                </View>
              </View>

              {/* Input Ulangi Kata Sandi */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Ulangi Kata Sandi</Text>
                <View style={styles.inputBox}>
                  <Text style={styles.leftInputIcon}>🔄</Text>
                  <TextInput
                    style={[styles.textInput, styles.passwordInput]}
                    placeholder="••••••••"
                    placeholderTextColor={COLORS.textMuted}
                    value={confirmation}
                    onChangeText={(t) => {
                      setConfirmation(t);
                      if (error) setError(null);
                    }}
                    secureTextEntry={!showConfirmation}
                    autoCapitalize="none"
                  />
                  <Pressable
                    style={styles.eyeBtn}
                    onPress={() => setShowConfirmation((p) => !p)}
                    hitSlop={8}
                  >
                    <Text>{showConfirmation ? '👁️' : '🙈'}</Text>
                  </Pressable>
                </View>
              </View>

              {/* Checkbox Ketentuan Layanan */}
              <Pressable
                style={styles.termsRow}
                onPress={() => setAgreeTerms(!agreeTerms)}
              >
                <View
                  style={[
                    styles.checkboxBox,
                    agreeTerms && styles.checkboxBoxChecked,
                  ]}
                >
                  {agreeTerms ? (
                    <Text style={styles.checkIcon}>✓</Text>
                  ) : null}
                </View>
                <Text style={styles.termsText}>
                  Saya menyetujui <Text style={styles.termsLink}>Ketentuan Layanan</Text> & <Text style={styles.termsLink}>Kebijakan Privasi</Text>
                </Text>
              </Pressable>

              {/* Tombol Buat Akun Saya */}
              <Pressable
                style={({ pressed }) => [
                  styles.submitBtn,
                  pressed && styles.btnPressed,
                  isSubmitting && styles.btnDisabled,
                ]}
                onPress={handleRegister}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <View style={styles.btnRow}>
                    <Text style={styles.submitBtnText}>Buat Akun Saya</Text>
                    <Text style={styles.arrowIcon}>→</Text>
                  </View>
                )}
              </Pressable>
            </View>

            {/* Divider atau daftar dengan */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>atau daftar dengan</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Sign Up Grid */}
            <View style={styles.socialGrid}>
              <Pressable
                style={styles.socialBtn}
                onPress={() => alert('Pendaftaran Google OAuth siap diaktifkan di Supabase.')}
              >
                <Text style={styles.socialIcon}>🌐</Text>
                <Text style={styles.socialBtnText}>Google</Text>
              </Pressable>

              <Pressable
                style={styles.socialBtn}
                onPress={() => alert('Pendaftaran Apple ID siap diaktifkan di Supabase.')}
              >
                <Text style={styles.socialIcon}>🍎</Text>
                <Text style={styles.socialBtnText}>Apple</Text>
              </Pressable>
            </View>

            {/* Footer Link Kembali Masuk */}
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Sudah punya akun?</Text>
              <Link href="/login" style={styles.loginLink}>
                Masuk di sini
              </Link>
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
    paddingVertical: 24,
    alignItems: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 420,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  backIcon: {
    fontSize: 18,
    color: '#1E293B',
    fontWeight: '700',
  },
  challengeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    gap: 4,
  },
  challengeFlame: {
    fontSize: 12,
  },
  challengeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
  },
  titleSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 18,
  },
  registerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
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
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
    gap: 8,
  },
  bannerIcon: {
    fontSize: 14,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  successText: {
    color: '#047857',
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
    color: '#64748B',
    marginBottom: 6,
  },
  passHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  strengthLabelText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F3FF', // surfaceContainerLow
    borderRadius: 25, // Rounded full pill
    paddingHorizontal: 16,
    height: 50,
  },
  leftInputIcon: {
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
  passwordInput: {
    paddingRight: 32,
  },
  eyeBtn: {
    position: 'absolute',
    right: 14,
  },
  strengthBarsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
    paddingHorizontal: 4,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
  },
  barActiveRed: {
    backgroundColor: '#EF4444',
  },
  barActiveAmber: {
    backgroundColor: '#F59E0B',
  },
  barActiveGreen: {
    backgroundColor: '#10B981',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    gap: 10,
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
  checkIcon: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  termsText: {
    flex: 1,
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
  },
  termsLink: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  submitBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 4,
  },
  btnRow: {
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
    marginBottom: 20,
  },
  socialBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24, // Rounded full pill
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  socialIcon: {
    fontSize: 16,
  },
  socialBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 13,
    color: '#64748B',
  },
  loginLink: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
  },
});
