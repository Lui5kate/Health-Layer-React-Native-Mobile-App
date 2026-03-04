import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView, Pressable,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/useTheme';
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useUserStore } from '@/store/userStore';
import type { Gender } from '@/store/userStore';
import { Spacing, Radius } from '@/theme';

const WATER_GOALS = [
  { ml: 1500, label: '1.5 L', desc: 'Recomendación mínima general' },
  { ml: 2000, label: '2 L', desc: 'Meta saludable recomendada' },
  { ml: 2500, label: '2.5 L', desc: 'Para mayor actividad física' },
];

const STEPS_GOALS = [
  { steps: 6000, label: '6,000 pasos', desc: 'Inicio gradual' },
  { steps: 8000, label: '8,000 pasos', desc: 'Recomendado para salud general' },
  { steps: 10000, label: '10,000 pasos', desc: 'Meta activa' },
];

export default function GoalsScreen() {
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ name: string; nickname: string; gender: string }>();
  const setProfile = useUserStore((s) => s.setProfile);

  const [weightKg, setWeightKg] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [waterGoal, setWaterGoal] = useState(2000);
  const [stepsGoal, setStepsGoal] = useState(8000);

  const handleFinish = () => {
    setProfile({
      id: `user-${Date.now()}`,
      name: params.name ?? '',
      nickname: params.nickname ?? params.name ?? '',
      gender: (params.gender as Gender) ?? 'prefer_not_to_say',
      weightKg: weightKg ? parseFloat(weightKg) : undefined,
      heightCm: heightCm ? parseFloat(heightCm) : undefined,
      waterGoalMl: waterGoal,
      dailyStepsGoal: stepsGoal,
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
    });
    router.replace('/(tabs)');
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
                  backgroundColor: step <= 2 ? colors.primary : colors.border,
                  width: step === 2 ? 24 : 8,
                }]} />
              ))}
            </View>
            <Text variant="h3" weight="bold" style={{ marginTop: Spacing.lg }}>Tus metas iniciales</Text>
            <Text variant="bodySmall" color="secondary" style={{ marginTop: Spacing.sm }}>
              Opcional — ajústalas cuando quieras desde ajustes.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.form}>

            {/* Medidas */}
            <Card padding={Spacing.base} shadow="sm">
              <Text variant="label" weight="semiBold" style={{ marginBottom: Spacing.md }}>
                📏 Medidas iniciales (opcionales)
              </Text>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Input label="Peso" placeholder="Ej. 70" value={weightKg}
                    onChangeText={setWeightKg} keyboardType="decimal-pad"
                    rightIcon={<Text variant="caption" color="tertiary">kg</Text>} />
                </View>
                <View style={{ flex: 1 }}>
                  <Input label="Estatura" placeholder="Ej. 165" value={heightCm}
                    onChangeText={setHeightCm} keyboardType="decimal-pad"
                    rightIcon={<Text variant="caption" color="tertiary">cm</Text>} />
                </View>
              </View>
            </Card>

            {/* Meta de agua */}
            <View style={{ gap: Spacing.md }}>
              <Text variant="label" weight="semiBold">💧 Meta diaria de agua</Text>
              <Text variant="caption" color="secondary">
                Se recomienda entre 1.5 y 2.5 litros al día dependiendo de tu actividad física.
              </Text>
              {WATER_GOALS.map((goal) => (
                <Pressable key={goal.ml} onPress={() => setWaterGoal(goal.ml)}
                  style={[styles.optionRow, {
                    backgroundColor: waterGoal === goal.ml ? colors.primary + '15' : colors.surface,
                    borderColor: waterGoal === goal.ml ? colors.primary : colors.border,
                  }]}>
                  <View style={[styles.radio, { borderColor: waterGoal === goal.ml ? colors.primary : colors.border }]}>
                    {waterGoal === goal.ml && <View style={[styles.radioFill, { backgroundColor: colors.primary }]} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="body" weight="semiBold">{goal.label}</Text>
                    <Text variant="caption" color="secondary">{goal.desc}</Text>
                  </View>
                </Pressable>
              ))}
            </View>

            {/* Meta de pasos */}
            <View style={{ gap: Spacing.md }}>
              <Text variant="label" weight="semiBold">🚶 Meta diaria de pasos</Text>
              <Text variant="caption" color="secondary">
                Caminar es una de las formas más efectivas de mantenerse activo.
              </Text>
              {STEPS_GOALS.map((goal) => (
                <Pressable key={goal.steps} onPress={() => setStepsGoal(goal.steps)}
                  style={[styles.optionRow, {
                    backgroundColor: stepsGoal === goal.steps ? colors.primary + '15' : colors.surface,
                    borderColor: stepsGoal === goal.steps ? colors.primary : colors.border,
                  }]}>
                  <View style={[styles.radio, { borderColor: stepsGoal === goal.steps ? colors.primary : colors.border }]}>
                    {stepsGoal === goal.steps && <View style={[styles.radioFill, { backgroundColor: colors.primary }]} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="body" weight="semiBold">{goal.label}</Text>
                    <Text variant="caption" color="secondary">{goal.desc}</Text>
                  </View>
                </Pressable>
              ))}
            </View>

            <Animated.View entering={FadeInDown.delay(500).duration(600)}
              style={[styles.motivational, { backgroundColor: colors.primary + '12', borderColor: colors.primary + '30' }]}>
              <Text style={{ fontSize: 24 }}>✨</Text>
              <Text variant="bodySmall" color="secondary" style={{ flex: 1, lineHeight: 20 }}>
                ¡Listo, {params.nickname ?? params.name}! Tu plan está configurado.
                Puedes ajustar estas metas en cualquier momento desde Ajustes.
              </Text>
            </Animated.View>
          </Animated.View>
        </ScrollView>

        <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.footer}>
          <Button label="¡Empezar! 🎉" onPress={handleFinish} size="lg" fullWidth />
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
  row: { flexDirection: 'row', gap: Spacing.md },
  optionRow: { borderWidth: 1.5, borderRadius: Radius.lg, padding: Spacing.base, flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioFill: { width: 12, height: 12, borderRadius: 6 },
  motivational: { padding: Spacing.base, borderRadius: Radius.lg, borderWidth: 1, flexDirection: 'row', gap: Spacing.md, alignItems: 'center' },
  footer: { paddingHorizontal: Spacing['2xl'], paddingBottom: Spacing['2xl'] },
});
