import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView, Pressable,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/useTheme';
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Spacing, Radius } from '@/theme';
import type { Gender } from '@/store/userStore';

const GENDER_OPTIONS: { value: Gender; label: string; icon: string }[] = [
  { value: 'female', label: 'Mujer', icon: '👩' },
  { value: 'male', label: 'Hombre', icon: '👨' },
  { value: 'prefer_not_to_say', label: 'Prefiero no decirlo', icon: '🙂' },
];

export default function SetupScreen() {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [nameError, setNameError] = useState('');

  const handleContinue = () => {
    if (!name.trim()) { setNameError('Por favor ingresa tu nombre'); return; }
    if (!gender) { setNameError('Selecciona una opción de género'); return; }
    router.push({
      pathname: '/(onboarding)/goals',
      params: { name: name.trim(), nickname: nickname.trim() || name.trim(), gender },
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          <Animated.View entering={FadeInDown.delay(100).duration(600)}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <Text variant="bodySmall" color="secondary">← Atrás</Text>
            </Pressable>
            <View style={styles.stepIndicator}>
              {[1, 2, 3].map((step) => (
                <View key={step} style={[styles.stepDot, {
                  backgroundColor: step === 1 ? colors.primary : colors.border,
                  width: step === 1 ? 24 : 8,
                }]} />
              ))}
            </View>
            <Text variant="h3" weight="bold" style={{ marginTop: Spacing.lg }}>
              Cuéntanos sobre ti
            </Text>
            <Text variant="bodySmall" color="secondary" style={{ marginTop: Spacing.sm }}>
              Personaliza tu experiencia en Health Layer 💚
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.form}>
            <Input
              label="Tu nombre"
              placeholder="Ej. María, Carlos, Alex..."
              value={name}
              onChangeText={(t) => { setName(t); setNameError(''); }}
              error={nameError && !name.trim() ? nameError : undefined}
              autoCapitalize="words"
              autoFocus
            />

            <Input
              label="¿Cómo quieres que te llamemos?"
              placeholder="Tu apodo o nombre preferido"
              value={nickname}
              onChangeText={setNickname}
              hint="Este nombre aparecerá en tu saludo diario"
              autoCapitalize="words"
            />

            {/* Preview */}
            {(nickname || name) && (
              <Animated.View entering={FadeInDown.duration(400)}
                style={[styles.preview, { backgroundColor: colors.primaryLight + '15', borderColor: colors.primaryLight }]}>
                <Text variant="caption" color="secondary">Vista previa:</Text>
                <Text variant="body" weight="semiBold">
                  "¡Buenos días, {nickname || name}! 🌅"
                </Text>
              </Animated.View>
            )}

            {/* Género */}
            <View style={{ gap: Spacing.md }}>
              <Text variant="label" weight="semiBold">¿Con qué género te identificas?</Text>
              {GENDER_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.value}
                  onPress={() => { setGender(opt.value); setNameError(''); }}
                  style={[styles.genderOption, {
                    backgroundColor: gender === opt.value ? colors.primary + '15' : colors.surface,
                    borderColor: gender === opt.value ? colors.primary : colors.border,
                    borderWidth: gender === opt.value ? 1.5 : 1,
                  }]}
                >
                  <Text style={{ fontSize: 22 }}>{opt.icon}</Text>
                  <Text variant="body" weight={gender === opt.value ? 'semiBold' : 'regular'}>
                    {opt.label}
                  </Text>
                  {gender === opt.value && (
                    <View style={[styles.selectedDot, { backgroundColor: colors.primary }]} />
                  )}
                </Pressable>
              ))}
              {nameError && gender === null && (
                <Text variant="caption" style={{ color: colors.error }}>{nameError}</Text>
              )}
            </View>
          </Animated.View>
        </ScrollView>

        <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.footer}>
          <Button
            label="Continuar"
            onPress={handleContinue}
            size="lg"
            fullWidth
            disabled={!name.trim() || !gender}
          />
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: Spacing['2xl'], paddingTop: Spacing.base, paddingBottom: Spacing['2xl'], gap: Spacing['2xl'] },
  backBtn: { paddingVertical: Spacing.sm, alignSelf: 'flex-start' },
  stepIndicator: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center', marginTop: Spacing.base },
  stepDot: { height: 8, borderRadius: Radius.full },
  form: { gap: Spacing.xl },
  preview: { padding: Spacing.base, borderRadius: Radius.lg, borderWidth: 1, gap: Spacing.xs },
  genderOption: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    padding: Spacing.base, borderRadius: Radius.lg,
  },
  selectedDot: {
    width: 10, height: 10, borderRadius: 5, marginLeft: 'auto',
  },
  footer: { paddingHorizontal: Spacing['2xl'], paddingBottom: Spacing['2xl'] },
});
