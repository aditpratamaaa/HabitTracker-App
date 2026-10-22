import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Alert,
} from 'react-native';
import { HabitFormData } from '../types/habit';
import { COLORS, PRESET_EMOJIS } from '../constants/theme';

interface AddHabitModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: HabitFormData) => void;
}

export function AddHabitModal({ visible, onClose, onSave }: AddHabitModalProps) {
  const [title, setTitle] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(PRESET_EMOJIS[0]);

  const handleClose = () => {
    setTitle('');
    setSelectedIcon(PRESET_EMOJIS[0]);
    onClose();
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Perhatian', 'Judul kebiasaan tidak boleh kosong');
      return;
    }

    onSave({
      title: title.trim(),
      icon: selectedIcon,
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
            <View style={styles.sheet}>
              {/* Drag Handle */}
              <View style={styles.dragHandle} />

              <Text style={styles.sheetTitle}>Tambah Kebiasaan Baru</Text>
              <Text style={styles.sheetSubtitle}>
                Tentukan target positif yang ingin kamu bangun setiap hari.
              </Text>

              {/* Input Nama Kebiasaan */}
              <Text style={styles.inputLabel}>NAMA KEBIASAAN</Text>
              <TextInput
                style={styles.input}
                placeholder="Contoh: Meditasi 10 Menit"
                placeholderTextColor={COLORS.textMuted}
                value={title}
                onChangeText={setTitle}
                autoFocus
                maxLength={45}
              />

              {/* Pilihan Ikon Emoji */}
              <Text style={styles.inputLabel}>PILIH IKON VISUAL</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.emojiList}
              >
                {PRESET_EMOJIS.map((emoji) => {
                  const isSelected = emoji === selectedIcon;
                  return (
                    <TouchableOpacity
                      key={emoji}
                      style={[
                        styles.emojiButton,
                        isSelected && styles.emojiButtonSelected,
                      ]}
                      onPress={() => setSelectedIcon(emoji)}
                    >
                      <Text style={styles.emojiText}>{emoji}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Tombol Aksi */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleClose}
                >
                  <Text style={styles.cancelButtonText}>Batal</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}
                >
                  <Text style={styles.saveButtonText}>Simpan Kebiasaan</Text>
                </TouchableOpacity>
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
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
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
    backgroundColor: '#E2E8F0',
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
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 20,
  },
  emojiList: {
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 24,
  },
  emojiButton: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
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
    marginTop: 4,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  saveButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
