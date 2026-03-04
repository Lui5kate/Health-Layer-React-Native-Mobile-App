import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Rect, Text as SvgText, G, Line } from 'react-native-svg';
import { Dimensions } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { WeightChart } from '@/components/ui/WeightChart';
import { useWaterStore } from '@/store/waterStore';
import { useStepsStore } from '@/store/stepsStore';
import { useWorkoutStore } from '@/store/workoutStore';
import { useProgressStore } from '@/store/progressStore';
import { useMealStore } from '@/store/mealStore';
import { useUserStore } from '@/store/userStore';
import { Spacing, Radius, Typography } from '@/theme';

const SCREEN_W = Dimensions.get('window').width - 32;

// Gráfica de barras genérica
function BarChart({
  data, color, goal, unit = '',
}: {
  data: { label: string; value: number }[];
  color: string;
  goal?: number;
  unit?: string;
}) {
  const { colors } = useTheme();
  const maxVal = Math.max(...data.map((d) => d.value), goal ?? 0, 1);
  const H = 100;
  const barW = (SCREEN_W - 24) / data.length - 6;

  return (
    <Svg width={SCREEN_W} height={H + 28}>
      {/* Línea de meta */}
      {goal && (
        <Line
          x1={0} y1={H - (goal / maxVal) * H}
          x2={SCREEN_W} y2={H - (goal / maxVal) * H}
          stroke={color + '60'} strokeWidth={1.5} strokeDasharray="6,4"
        />
      )}
      {data.map((d, i) => {
        const barH = (d.value / maxVal) * H;
        const x = i * (barW + 6) + 3;
        const y = H - barH;
        const isToday = i === data.length - 1;
        return (
          <G key={i}>
            <Rect x={x} y={y} width={barW} height={Math.max(barH, 2)}
              fill={isToday ? color : color + '60'} rx={3} />
            <SvgText x={x + barW / 2} y={H + 14} fontSize={9}
              fill={colors.textSecondary} textAnchor="middle"
              fontFamily={Typography.fontFamily.regular}>
              {d.label}
            </SvgText>
            {d.value > 0 && (
              <SvgText x={x + barW / 2} y={y - 4} fontSize={8}
                fill={isToday ? color : colors.textTertiary} textAnchor="middle"
                fontFamily={Typography.fontFamily.medium}>
                {d.value >= 1000 ? `${(d.value / 1000).toFixed(1)}k` : `${d.value}${unit}`}
              </SvgText>
            )}
          </G>
        );
      })}
    </Svg>
  );
}

type Period = '7d' | '30d';

function getBmiCategory(bmi: number): string {
  if (bmi < 18.5) return 'Bajo peso';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Sobrepeso';
  return 'Obesidad';
}

export default function AnalyticsScreen() {
  const { colors } = useTheme();
  const [period] = useState<Period>('7d');
  const [showBmi, setShowBmi] = useState(false);

  const waterStore = useWaterStore();
  const stepsStore = useStepsStore();
  const workoutStore = useWorkoutStore();
  const progressStore = useProgressStore();
  const mealStore = useMealStore();
  const mealStreak = mealStore.getStreak();
  const profile = useUserStore((s) => s.profile);

  // Últimos 7 días
  const today = new Date();
  const days7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const key = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('es-MX', { weekday: 'short' }).slice(0, 2);
    return { key, label };
  });

  const waterData = days7.map((d) => ({
    label: d.label,
    value: waterStore.getTodayMl(d.key),
  }));

  const stepsData = days7.map((d) => ({
    label: d.label,
    value: stepsStore.getSteps(d.key),
  }));

  const workoutData = days7.map((d) => ({
    label: d.label,
    value: workoutStore.getSessionsByDate(d.key).length,
  }));

  const mealData = days7.map((d) => ({
    label: d.label,
    value: mealStore.getCompletedCount(d.key),
  }));

  // Historial de entrenos
  const recentSessions = workoutStore.sessions.slice(-10).reverse();

  // Stats generales
  const totalSessions = workoutStore.sessions.length;
  const avgWater = waterStore.getWeeklyAverage();
  const avgSteps = stepsStore.getWeeklyAverage();
  const weightChange = progressStore.getWeightChange();

  const heightM = profile?.heightCm ? profile.heightCm / 100 : null;

  const weightChartData = progressStore.weightLog.slice(-10).map((e) => {
    const value = showBmi && heightM
      ? parseFloat((e.weightKg / (heightM * heightM)).toFixed(1))
      : e.weightKg;
    return { date: e.date, value };
  });

  const latestBmi = heightM && progressStore.getLatestWeight()
    ? progressStore.getLatestWeight()!.weightKg / (heightM * heightM)
    : null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <Animated.View entering={FadeInDown.delay(50).duration(500)}>
          <Text variant="h3" weight="bold">Analíticos</Text>
          <Text variant="bodySmall" color="secondary">Últimos 7 días</Text>
        </Animated.View>

        {/* KPIs */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.kpiGrid}>
          {[
            { icon: '🔥', label: 'Racha comidas', value: `${mealStreak} días`, color: colors.warning },
            { icon: '💧', label: 'Agua promedio', value: avgWater >= 1000 ? `${(avgWater / 1000).toFixed(1)}L` : `${avgWater}ml`, color: '#6BA8D4' },
            { icon: '🚶', label: 'Pasos promedio', value: avgSteps >= 1000 ? `${(avgSteps / 1000).toFixed(1)}k` : `${avgSteps}`, color: colors.primary },
            { icon: '💪', label: 'Total entrenos', value: `${totalSessions}`, color: colors.error },
          ].map((kpi, i) => (
            <Card key={i} shadow="sm" padding={Spacing.md} style={styles.kpiCard}>
              <Text style={{ fontSize: 20 }}>{kpi.icon}</Text>
              <Text variant="h4" weight="bold" style={{ color: kpi.color }}>{kpi.value}</Text>
              <Text variant="caption" color="secondary" style={{ textAlign: 'center' }}>{kpi.label}</Text>
            </Card>
          ))}
        </Animated.View>

        {/* Agua */}
        <Animated.View entering={FadeInDown.delay(150).duration(500)}>
          <Card shadow="md" padding={Spacing.base}>
            <View style={styles.chartHeader}>
              <Text variant="h4" weight="semiBold">💧 Hidratación</Text>
              <Text variant="caption" style={{ color: '#6BA8D4' }}>
                Meta: {(waterStore.goalMl / 1000).toFixed(1)}L
              </Text>
            </View>
            <BarChart data={waterData} color="#6BA8D4" goal={waterStore.goalMl} unit="ml" />
          </Card>
        </Animated.View>

        {/* Pasos */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <Card shadow="md" padding={Spacing.base}>
            <View style={styles.chartHeader}>
              <Text variant="h4" weight="semiBold">🚶 Pasos diarios</Text>
              <Text variant="caption" style={{ color: colors.primary }}>
                Meta: {stepsStore.goal.toLocaleString()}
              </Text>
            </View>
            <BarChart data={stepsData} color={colors.primary} goal={stepsStore.goal} />
          </Card>
        </Animated.View>

        {/* Entrenos */}
        <Animated.View entering={FadeInDown.delay(250).duration(500)}>
          <Card shadow="md" padding={Spacing.base}>
            <View style={styles.chartHeader}>
              <Text variant="h4" weight="semiBold">💪 Entrenamientos</Text>
              <Text variant="caption" color="secondary">sesiones/día</Text>
            </View>
            <BarChart data={workoutData} color={colors.error} />

            {recentSessions.length > 0 && (
              <View style={{ marginTop: Spacing.base }}>
                <Text variant="label" weight="semiBold" style={{ marginBottom: Spacing.sm }}>
                  Historial reciente
                </Text>
                {recentSessions.slice(0, 5).map((session) => {
                  const { WorkoutColors } = require('@/theme');
                  const wc = WorkoutColors[session.type];
                  return (
                    <View key={session.id} style={[styles.sessionRow, { borderBottomColor: colors.borderLight }]}>
                      <Text style={{ fontSize: 18 }}>{wc.icon}</Text>
                      <View style={{ flex: 1 }}>
                        <Text variant="bodySmall" weight="semiBold">{session.date}</Text>
                        <Text variant="caption" color="secondary">
                          {session.durationMinutes ? `${session.durationMinutes} min` : 'Sin duración'}
                          {session.exerciseLogs.length > 0 ? ` · ${session.exerciseLogs.length} ejercicios` : ''}
                        </Text>
                      </View>
                      <View style={[styles.typeBadge, { backgroundColor: wc.accent + '20' }]}>
                        <Text variant="caption" weight="semiBold" style={{ color: wc.accent }}>
                          {session.type}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </Card>
        </Animated.View>

        {/* Comidas */}
        <Animated.View entering={FadeInDown.delay(280).duration(500)}>
          <Card shadow="md" padding={Spacing.base}>
            <View style={styles.chartHeader}>
              <Text variant="h4" weight="semiBold">🍽️ Comidas completadas</Text>
              <Text variant="caption" color="secondary">máx. 3/día</Text>
            </View>
            <BarChart data={mealData} color={colors.warning} goal={3} />
          </Card>
        </Animated.View>

        {/* Peso */}
        {weightChartData.length >= 2 && (
          <Animated.View entering={FadeInDown.delay(300).duration(500)}>
            <Card shadow="md" padding={Spacing.base}>
              <View style={styles.chartHeader}>
                <Text variant="h4" weight="semiBold">⚖️ Evolución de peso</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
                  {weightChange !== null && !showBmi && (
                    <Text variant="caption" weight="semiBold"
                      style={{ color: weightChange < 0 ? colors.success : weightChange > 0 ? colors.error : colors.textSecondary }}>
                      {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
                    </Text>
                  )}
                  {heightM && (
                    <Pressable
                      onPress={() => setShowBmi(!showBmi)}
                      style={[styles.toggleBtn, {
                        backgroundColor: showBmi ? colors.primary + '20' : colors.surfaceAlt,
                        borderColor: showBmi ? colors.primary : colors.border,
                      }]}
                    >
                      <Text variant="caption" weight="semiBold"
                        style={{ color: showBmi ? colors.primary : colors.textSecondary }}>
                        {showBmi ? 'IMC' : 'kg'}
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>
              {showBmi && latestBmi && (
                <View style={{ marginBottom: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
                  <Text variant="h3" weight="bold" style={{ color: colors.primary }}>
                    {latestBmi.toFixed(1)}
                  </Text>
                  <View style={[styles.bmiChip, {
                    backgroundColor: latestBmi < 18.5 ? '#6BA8D4' + '20'
                      : latestBmi < 25 ? colors.success + '20'
                      : latestBmi < 30 ? colors.warning + '20'
                      : colors.error + '20',
                  }]}>
                    <Text variant="caption" weight="semiBold" style={{
                      color: latestBmi < 18.5 ? '#6BA8D4'
                        : latestBmi < 25 ? colors.success
                        : latestBmi < 30 ? colors.warning
                        : colors.error,
                    }}>
                      {getBmiCategory(latestBmi)}
                    </Text>
                  </View>
                </View>
              )}
              <WeightChart data={weightChartData} height={180} />
            </Card>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: Spacing.base, paddingTop: Spacing.base, paddingBottom: 120, gap: Spacing.base },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  kpiCard: { width: (SCREEN_W - Spacing.sm) / 2 - 1, alignItems: 'center', gap: 4 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  sessionRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.sm, borderBottomWidth: 1 },
  typeBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: Radius.sm },
  toggleBtn: { paddingHorizontal: Spacing.md, paddingVertical: 4, borderRadius: Radius.full, borderWidth: 1 },
  bmiChip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.full },
});
