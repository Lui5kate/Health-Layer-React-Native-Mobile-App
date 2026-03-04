import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import Animated, {
  FadeInDown,
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/useTheme';
import { Text } from '@/components/ui/Text';
import { Card, PressableCard } from '@/components/ui/Card';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { useUserStore } from '@/store/userStore';
import { useMealStore } from '@/store/mealStore';
import { useWaterStore } from '@/store/waterStore';
import { useWorkoutStore } from '@/store/workoutStore';
import { useStepsStore } from '@/store/stepsStore';
import { getGreeting, todayKey } from '@/utils/date';
import { getMealsByWeekAndType } from '@/data/meals';
import { Spacing, Radius, MealColors } from '@/theme';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { colors } = useTheme();
  const profile = useUserStore((s) => s.profile);
  const { activeWeek, isMealCompleted, getSelectedMeals } = useMealStore();
  const waterStore = useWaterStore();
  const workoutStore = useWorkoutStore();
  const stepsStore = useStepsStore();

  const today = todayKey();
  const greeting = getGreeting(profile?.nickname ?? 'amiga');
  const selectedMeals = getSelectedMeals(today);

  // Calcular progreso del día
  const totalMeals = 3;
  const completedMeals = [
    selectedMeals.breakfast && isMealCompleted(today, selectedMeals.breakfast),
    selectedMeals.lunch && isMealCompleted(today, selectedMeals.lunch),
    selectedMeals.dinner && isMealCompleted(today, selectedMeals.dinner),
  ].filter(Boolean).length;

  const mealProgress = totalMeals > 0 ? completedMeals / totalMeals : 0;
  const waterProgress = waterStore.getProgress(today);
  const waterMl = waterStore.getTodayMl(today);
  const workoutsThisWeek = workoutStore.getTotalSessionsThisWeek();
  const streak = useMealStore.getState().getStreak();
  const todaySteps = stepsStore.getSteps(today);
  const stepsProgress = stepsStore.getProgress(today);
  const stepsGoal = profile?.dailyStepsGoal ?? stepsStore.goal;

  // Comidas de hoy (semana activa)
  const breakfastOptions = getMealsByWeekAndType(activeWeek, 'breakfast');
  const lunchOptions = getMealsByWeekAndType(activeWeek, 'lunch');
  const dinnerOptions = getMealsByWeekAndType(activeWeek, 'dinner');

  const todayMeals = [
    { type: 'breakfast' as const, label: 'Desayuno', meal: breakfastOptions[0], ...MealColors.breakfast },
    { type: 'lunch' as const, label: 'Comida', meal: lunchOptions[0], ...MealColors.lunch },
    { type: 'dinner' as const, label: 'Cena', meal: dinnerOptions[0], ...MealColors.dinner },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(50).duration(600)} style={styles.header}>
          <View>
            <Text variant="h3" weight="bold">{greeting}</Text>
            <Text variant="bodySmall" color="secondary">
              {new Date().toLocaleDateString('es-MX', {
                weekday: 'long', day: 'numeric', month: 'long',
              })}
            </Text>
          </View>
          {streak > 0 && (
            <View style={[styles.streakBadge, { backgroundColor: colors.warning + '20' }]}>
              <Text style={{ fontSize: 16 }}>🔥</Text>
              <Text variant="label" weight="bold" style={{ color: colors.warning }}>
                {streak}
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Progress Rings */}
        <Animated.View entering={FadeInDown.delay(150).duration(600)}>
          <Card padding={Spacing.xl} shadow="md" style={styles.progressCard}>
            <Text variant="label" weight="semiBold" color="secondary" style={{ marginBottom: Spacing.lg }}>
              Resumen del día
            </Text>
            <View style={styles.ringsRow}>
              {/* Comidas */}
              <View style={styles.ringItem}>
                <ProgressRing
                  size={88}
                  strokeWidth={8}
                  progress={mealProgress}
                  gradientColors={['#87A878', '#A8C499']}
                  trackColor={colors.border}
                >
                  <Text variant="h4" weight="bold" style={{ color: colors.primary }}>
                    {completedMeals}/{totalMeals}
                  </Text>
                </ProgressRing>
                <Text variant="caption" color="secondary" style={{ marginTop: Spacing.sm, textAlign: 'center' }}>
                  Comidas
                </Text>
              </View>

              {/* Agua */}
              <View style={styles.ringItem}>
                <ProgressRing
                  size={88}
                  strokeWidth={8}
                  progress={waterProgress}
                  gradientColors={['#6BA8D4', '#4A8FBF']}
                  trackColor={colors.border}
                >
                  <Text variant="caption" weight="bold" style={{ color: '#6BA8D4', textAlign: 'center' }}>
                    {waterMl >= 1000
                      ? `${(waterMl / 1000).toFixed(1)}L`
                      : `${waterMl}ml`}
                  </Text>
                </ProgressRing>
                <Text variant="caption" color="secondary" style={{ marginTop: Spacing.sm, textAlign: 'center' }}>
                  Agua
                </Text>
              </View>

              {/* Ejercicio */}
              <View style={styles.ringItem}>
                <ProgressRing
                  size={88}
                  strokeWidth={8}
                  progress={Math.min(workoutsThisWeek / 4, 1)}
                  gradientColors={['#E05C5C', '#E88080']}
                  trackColor={colors.border}
                >
                  <Text variant="h4" weight="bold" style={{ color: colors.error }}>
                    {workoutsThisWeek}
                  </Text>
                </ProgressRing>
                <Text variant="caption" color="secondary" style={{ marginTop: Spacing.sm, textAlign: 'center' }}>
                  Sesiones
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Agua rápida */}
        <Animated.View entering={FadeInDown.delay(250).duration(600)}>
          <Card padding={0} shadow="sm" style={{ overflow: 'hidden' }}>
            <View style={[styles.waterBar, { backgroundColor: '#6BA8D4' + '15' }]}>
              <View style={{ flex: 1 }}>
                <Text variant="label" weight="semiBold">💧 Hidratación</Text>
                <Text variant="caption" color="secondary">
                  Meta: {(waterStore.goalMl / 1000).toFixed(1)}L · {Math.round(waterProgress * 100)}% completado
                </Text>
              </View>
              <View style={styles.waterButtons}>
                {[250, 500].map((ml) => (
                  <Pressable
                    key={ml}
                    onPress={() => waterStore.addWater(today, ml)}
                    style={[styles.waterBtn, { backgroundColor: '#6BA8D4' + '25', borderColor: '#6BA8D4' + '40' }]}
                  >
                    <Text variant="caption" weight="semiBold" style={{ color: '#4A8FBF' }}>
                      +{ml}ml
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Pasos */}
        <Animated.View entering={FadeInDown.delay(300).duration(600)}>
          <Card padding={0} shadow="sm" style={{ overflow: 'hidden' }}>
            <Pressable onPress={() => router.push('/(tabs)/progress')}
              style={[styles.waterBar, { backgroundColor: colors.primary + '10' }]}>
              <View style={{ flex: 1 }}>
                <Text variant="label" weight="semiBold">🚶 Pasos de hoy</Text>
                <Text variant="caption" color="secondary">
                  {todaySteps.toLocaleString()} / {stepsGoal.toLocaleString()} pasos
                </Text>
              </View>
              <View style={styles.waterButtons}>
                {[1000, 2500].map((n) => (
                  <Pressable key={n} onPress={(e) => { e.stopPropagation(); stepsStore.addSteps(today, n); }}
                    style={[styles.waterBtn, { backgroundColor: colors.primary + '20', borderColor: colors.primary + '35' }]}>
                    <Text variant="caption" weight="semiBold" style={{ color: colors.primary }}>
                      +{n >= 1000 ? `${n / 1000}k` : n}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Pressable>
            {/* Barra de progreso */}
            <View style={[styles.stepsBar, { backgroundColor: colors.border }]}>
              <View style={[styles.stepsFill, { backgroundColor: colors.primary, width: `${Math.round(stepsProgress * 100)}%` }]} />
            </View>
          </Card>
        </Animated.View>

        {/* Comidas del día */}
        <Animated.View entering={FadeInDown.delay(350).duration(600)} style={{ gap: Spacing.md }}>
          <View style={styles.sectionHeader}>
            <Text variant="h4" weight="semiBold">Comidas de hoy</Text>
            <Pressable onPress={() => router.push('/(tabs)/meals')}>
              <Text variant="bodySmall" weight="medium" style={{ color: colors.primary }}>
                Ver todas →
              </Text>
            </Pressable>
          </View>

          {todayMeals.map(({ type, label, meal, bg, accent, icon }, index) => {
            const mealId = selectedMeals[type] ?? meal?.id;
            const completed = mealId ? isMealCompleted(today, mealId) : false;

            return (
              <Animated.View
                key={type}
                entering={FadeInRight.delay(400 + index * 80).duration(500)}
              >
                <PressableCard
                  padding={Spacing.base}
                  shadow="sm"
                  onPress={() => router.push('/(tabs)/meals')}
                  style={[styles.mealCard, completed && styles.mealCardCompleted]}
                >
                  <View style={[styles.mealIcon, { backgroundColor: bg }]}>
                    <Text style={{ fontSize: 20 }}>{icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="caption" weight="medium" style={{ color: accent }}>
                      {label}
                    </Text>
                    <Text variant="bodySmall" weight="medium" numberOfLines={1}>
                      {meal?.name ?? 'Seleccionar comida'}
                    </Text>
                  </View>
                  {completed ? (
                    <View style={[styles.checkmark, { backgroundColor: colors.success }]}>
                      <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '700' }}>✓</Text>
                    </View>
                  ) : (
                    <View style={[styles.checkmark, { backgroundColor: colors.border }]} />
                  )}
                </PressableCard>
              </Animated.View>
            );
          })}
        </Animated.View>

        {/* Quick actions */}
        <Animated.View entering={FadeInDown.delay(600).duration(600)} style={{ gap: Spacing.md }}>
          <Text variant="h4" weight="semiBold">Acciones rápidas</Text>
          <View style={styles.quickActions}>
            <PressableCard
              style={[styles.quickCard, { backgroundColor: '#87A878' + '15' }]}
              shadow="none"
              padding={Spacing.base}
              onPress={() => router.push('/(tabs)/workout')}
            >
              <Text style={{ fontSize: 28 }}>🏋️</Text>
              <Text variant="caption" weight="semiBold" style={{ marginTop: Spacing.xs }}>
                Iniciar{'\n'}entreno
              </Text>
            </PressableCard>
            <PressableCard
              style={[styles.quickCard, { backgroundColor: '#87A878' + '15' }]}
              shadow="none"
              padding={Spacing.base}
              onPress={() => router.push('/(tabs)/meals')}
            >
              <Text style={{ fontSize: 28 }}>📋</Text>
              <Text variant="caption" weight="semiBold" style={{ marginTop: Spacing.xs }}>
                Plan{'\n'}semanal
              </Text>
            </PressableCard>
            <PressableCard
              style={[styles.quickCard, { backgroundColor: '#87A878' + '15' }]}
              shadow="none"
              padding={Spacing.base}
              onPress={() => router.push('/(tabs)/progress')}
            >
              <Text style={{ fontSize: 28 }}>📊</Text>
              <Text variant="caption" weight="semiBold" style={{ marginTop: Spacing.xs }}>
                Registrar{'\n'}peso
              </Text>
            </PressableCard>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: 100,
    gap: Spacing.base,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
  },
  progressCard: {
    borderRadius: Radius.xl,
  },
  ringsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  ringItem: {
    alignItems: 'center',
  },
  waterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    gap: Spacing.md,
  },
  waterButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  waterBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
  },
  mealCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  mealCardCompleted: {
    opacity: 0.7,
  },
  mealIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepsBar: { height: 4 },
  stepsFill: { height: 4, borderRadius: 2 },
  quickActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  quickCard: {
    flex: 1,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
