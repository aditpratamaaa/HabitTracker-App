import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { COLORS, PRESET_EMOJIS } from '../constants/colors';


interface AddHabitModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: { title: string; emoji: string }) => void;
}

export function AddHabitModal({
  visible,
  onClose,
  onSave,
}: AddHabitModalProps) {
  const [title, setTitle] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<string>(PRESET_EMOJIS[0]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleClose = () => {
    setTitle('');
    setSelectedEmoji(PRESET_EMOJIS[0]);
    setErrorMessage('');
    onClose();
  };

  const handleSave = () => {
    const trimmed = title.trim();
    if (!trimmed) {
      setErrorMessage('Nama kebiasaan tidak boleh kosong.');
      return;
    }

    onSave({
      title: trimmed,
      emoji: selectedEmoji,
    });

    handleClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.backdrop}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.sheetContainer}
          >
            <View style={styles.sheet} accessibilityViewIsModal={true}>
              {/* Drag Handle */}
              <View style={styles.dragHandle} />

              <Text style={styles.sheetTitle}>Tambah Kebiasaan Baru</Text>
              <Text style={styles.sheetSubtitle}>
                Tentukan target positif yang ingin kamu bangun setiap hari.
              </Text>

              {/* Input Nama Kebiasaan */}
              <Text style={styles.inputLabel}>
                NAMA KEBIASAAN
              </Text>
              <TextInput
                style={[styles.input, errorMessage ? styles.inputError : null]}
                placeholder="Contoh: Minum 2 Liter Air"
                placeholderTextColor={COLORS.textMuted}
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  if (errorMessage) setErrorMessage('');
                }}
                autoFocus
                maxLength={45}
                accessible={true}
                accessibilityLabel="Nama kebiasaan baru"
                accessibilityHint="Masukkan nama kebiasaan yang ingin dibangun"
              />

              {errorMessage ? (
                <Text style={styles.errorText} accessibilityRole="alert">
                  {errorMessage}
                </Text>
              ) : null}

              {/* Pilihan Ikon Emoji */}
              <Text style={styles.inputLabel}>PILIH IKON VISUAL</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.emojiList}
              >
                {PRESET_EMOJIS.map((emoji) => {
                  const isSelected = emoji === selectedEmoji;
                  return (
                    <Pressable
                      key={emoji}
                      style={({ pressed }) => [
                        styles.emojiButton,
                        isSelected && styles.emojiButtonSelected,
                        pressed && styles.emojiButtonPressed,
                      ]}
                      onPress={() => setSelectedEmoji(emoji)}
                      accessible={true}
                      accessibilityRole="button"
                      accessibilityLabel={`Pilih ikon ${emoji}`}
                      accessibilityState={{ selected: isSelected }}
                    >
                      <Text style={styles.emojiText}>{emoji}</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              {/* Tombol Aksi (Minimal Touch Target >= 44x44px) */}
              <View style={styles.actionRow}>
                <Pressable
                  style={({ pressed }) => [
                    styles.cancelButton,
                    pressed && styles.cancelButtonPressed,
                  ]}
                  onPress={handleClose}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Batalkan penambahan kebiasaan"
                >
                  <Text style={styles.cancelButtonText}>Batal</Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.saveButton,
                    pressed && styles.saveButtonPressed,
                  ]}
                  onPress={handleSave}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Simpan kebiasaan baru"
                >
                  <Text style={styles.saveButtonText}>Simpan Kebiasaan</Text>
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: COLORS.backdrop,
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  dragHandle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  sheetSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.textPrimary,
    minHeight: 48,
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.danger,
    marginTop: 6,
    marginBottom: 12,
    fontWeight: '600',
  },
  emojiList: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 8,
    marginBottom: 16,
  },
  emojiButton: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emojiButtonPressed: {
    opacity: 0.75,
  },
  emojiButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  emojiText: {
    fontSize: 24,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    minHeight: 48,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonPressed: {
    opacity: 0.8,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  saveButton: {
    flex: 2,
    minHeight: 48,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonPressed: {
    backgroundColor: COLORS.primaryDark,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textOnPrimary,
  },
});
