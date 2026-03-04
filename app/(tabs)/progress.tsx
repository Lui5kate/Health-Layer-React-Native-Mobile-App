import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Alert, Image, Dimensions } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

import { useTheme } from '@/hooks/useTheme';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { WeightChart } from '@/components/ui/WeightChart';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { useProgressStore, type PhotoEntry } from '@/store/progressStore';
import { useUserStore } from '@/store/userStore';
import { useMealStore } from '@/store/mealStore';
import { useWaterStore } from '@/store/waterStore';
import { useWorkoutStore } from '@/store/workoutStore';
import { useStepsStore } from '@/store/stepsStore';
import { Spacing, Radius } from '@/theme';

const SCREEN_W = Dimensions.get('window').width;
import { todayKey } from '@/utils/date';

export default function ProgressScreen() {
  const { colors } = useTheme();
  const { weightLog, addWeight, getLatestWeight, getWeightChange, photoLog, addPhoto, deletePhoto } = useProgressStore();
  const profile = useUserStore((s) => s.profile);
  const streak = useMealStore.getState().getStreak();
  const weeklyWater = useWaterStore.getState().getWeeklyAverage();
  const weeklySessions = useWorkoutStore.getState().getTotalSessionsThisWeek();
  const stepsStore = useStepsStore();

  const [newWeight, setNewWeight] = useState('');
  const [newSteps, setNewSteps] = useState('');
  const [showWeightForm, setShowWeightForm] = useState(false);
  const [showStepsForm, setShowStepsForm] = useState(false);

  const today = todayKey();
  const latestWeight = getLatestWeight();
  const weightChange = getWeightChange();
  const todaySteps = stepsStore.getSteps(today);
  const stepsProgress = stepsStore.getProgress(today);
  const stepsGoal = profile?.dailyStepsGoal ?? stepsStore.goal;
  const weeklyAvgSteps = stepsStore.getWeeklyAverage();

  const handleSaveWeight = () => {
    const kg = parseFloat(newWeight.replace(',', '.'));
    if (isNaN(kg) || kg < 20 || kg > 300) {
      Alert.alert('Peso inválido', 'Por favor ingresa un peso válido en kg.');
      return;
    }
    addWeight({ date: today, weightKg: kg });
    setNewWeight('');
    setShowWeightForm(false);
  };

  const handleSaveSteps = () => {
    const s = parseInt(newSteps);
    if (isNaN(s) || s < 0 || s > 100000) {
      Alert.alert('Pasos inválidos', 'Ingresa un número válido de pasos.');
      return;
    }
    stepsStore.setSteps(today, s);
    setNewSteps('');
    setShowStepsForm(false);
  };

  const chartData = weightLog.slice(-12).map((e) => ({ date: e.date, value: e.weightKg }));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled">

        {/* Header */}
        <Animated.View entering={FadeInDown.delay(50).duration(500)}>
          <Text variant="h3" weight="bold">Mi progreso</Text>
          <Text variant="bodySmall" color="secondary" style={{ marginTop: 2 }}>
            Cada pequeño avance importa 🌱
          </Text>
        </Animated.View>

        {/* Stats rápidas */}
        <Animated.View entering={FadeInDown.delay(150).duration(500)} style={styles.statsGrid}>
          {[
            { icon: '🔥', value: `${streak}`, label: 'Días de racha', color: colors.warning },
            {
              icon: '💧',
              value: weeklyWater >= 1000 ? `${(weeklyWater / 1000).toFixed(1)}L` : `${weeklyWater}ml`,
              label: 'Agua prom/día', color: '#6BA8D4',
            },
            { icon: '💪', value: `${weeklySessions}`, label: 'Entrenos semana', color: colors.error },
          ].map((stat, i) => (
            <Card key={i} shadow="sm" padding={Spacing.md} style={styles.statCard}>
              <Text style={{ fontSize: 20 }}>{stat.icon}</Text>
              <Text variant="h4" weight="bold" style={{ color: stat.color }}>{stat.value}</Text>
              <Text variant="caption" color="secondary" style={{ textAlign: 'center' }}>{stat.label}</Text>
            </Card>
          ))}
        </Animated.View>

        {/* Pasos de hoy */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <Card shadow="md" padding={Spacing.base}>
            <View style={styles.sectionHeader}>
              <Text variant="h4" weight="semiBold">🚶 Pasos de hoy</Text>
              <Pressable onPress={() => setShowStepsForm(!showStepsForm)}>
                <Text variant="bodySmall" weight="semiBold" style={{ color: colors.primary }}>
                  {showStepsForm ? 'Cancelar' : '+ Registrar'}
                </Text>
              </Pressable>
            </View>

            <View style={styles.stepsRow}>
              <ProgressRing size={80} strokeWidth={8} progress={stepsProgress}
                gradientColors={['#87A878', '#A8C499']} trackColor={colors.border}>
                <Text variant="caption" weight="bold" style={{ color: colors.primary, textAlign: 'center', fontSize: 10 }}>
                  {Math.round(stepsProgress * 100)}%
                </Text>
              </ProgressRing>
              <View style={{ flex: 1, gap: 4 }}>
                <Text variant="h3" weight="bold" style={{ color: colors.primary }}>
                  {todaySteps.toLocaleString()}
                  <Text variant="bodySmall" weight="regular" color="secondary"> pasos</Text>
                </Text>
                <Text variant="caption" color="secondary">
                  Meta: {stepsGoal.toLocaleString()} pasos · {Math.max(0, stepsGoal - todaySteps).toLocaleString()} restantes
                </Text>
                {weeklyAvgSteps > 0 && (
                  <Text variant="caption" color="tertiary">
                    Promedio semanal: {weeklyAvgSteps.toLocaleString()}
                  </Text>
                )}
              </View>
            </View>

            {showStepsForm && (
              <Animated.View entering={FadeInDown.duration(300)} style={styles.formRow}>
                <View style={{ flex: 1 }}>
                  <Input label="Pasos de hoy" placeholder="Ej. 7500" value={newSteps}
                    onChangeText={setNewSteps} keyboardType="number-pad" />
                </View>
                <Button label="Guardar" onPress={handleSaveSteps} size="sm" style={{ marginTop: 24 }} />
              </Animated.View>
            )}

            {/* Acceso rápido */}
            {!showStepsForm && (
              <View style={styles.quickSteps}>
                {[1000, 2500, 5000].map((n) => (
                  <Pressable key={n} onPress={() => stepsStore.addSteps(today, n)}
                    style={[styles.quickBtn, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
                    <Text variant="caption" weight="semiBold" style={{ color: colors.primary }}>
                      +{n >= 1000 ? `${n / 1000}k` : n}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </Card>
        </Animated.View>

        {/* Gráfica de peso */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <Card shadow="md" padding={Spacing.base}>
            <View style={styles.sectionHeader}>
              <Text variant="h4" weight="semiBold">⚖️ Peso corporal</Text>
              <Pressable onPress={() => setShowWeightForm(!showWeightForm)}>
                <Text variant="bodySmall" weight="semiBold" style={{ color: colors.primary }}>
                  {showWeightForm ? 'Cancelar' : '+ Registrar'}
                </Text>
              </Pressable>
            </View>

            {latestWeight && (
              <View style={styles.weightDisplay}>
                <Text variant="h1" weight="bold" style={{ color: colors.primary }}>
                  {latestWeight.weightKg}
                  <Text variant="h4" weight="regular" color="secondary"> kg</Text>
                </Text>
                {weightChange !== null && (
                  <View style={[styles.changeBadge, {
                    backgroundColor: weightChange < 0 ? colors.success + '20' : weightChange > 0 ? colors.error + '20' : colors.border,
                  }]}>
                    <Text variant="bodySmall" weight="semiBold" style={{
                      color: weightChange < 0 ? colors.success : weightChange > 0 ? colors.error : colors.textSecondary,
                    }}>
                      {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
                    </Text>
                  </View>
                )}
              </View>
            )}

            {showWeightForm && (
              <Animated.View entering={FadeInDown.duration(300)} style={styles.formRow}>
                <View style={{ flex: 1 }}>
                  <Input label="Peso de hoy" placeholder="Ej. 65.5" value={newWeight}
                    onChangeText={setNewWeight} keyboardType="decimal-pad"
                    rightIcon={<Text variant="caption" color="tertiary">kg</Text>} />
                </View>
                <Button label="Guardar" onPress={handleSaveWeight} size="sm" style={{ marginTop: 24 }} />
              </Animated.View>
            )}

            {/* Gráfica SVG */}
            {chartData.length >= 2 ? (
              <View style={{ marginTop: Spacing.base }}>
                <WeightChart data={chartData} height={180} />
              </View>
            ) : (
              !latestWeight && (
                <Text variant="bodySmall" color="tertiary" style={{ marginTop: Spacing.md }}>
                  Registra tu peso para ver la gráfica de evolución.
                </Text>
              )
            )}

            {/* Historial */}
            {weightLog.length > 0 && (
              <View style={{ marginTop: Spacing.base }}>
                <Text variant="caption" weight="semiBold" color="secondary" style={{ marginBottom: Spacing.sm }}>
                  Últimos registros
                </Text>
                {weightLog.slice(-5).reverse().map((entry, i) => (
                  <View key={entry.date} style={[styles.historyRow, { borderBottomColor: colors.borderLight }]}>
                    <Text variant="caption" color="secondary">{entry.date}</Text>
                    <Text variant="bodySmall" weight="semiBold">{entry.weightKg} kg</Text>
                  </View>
                ))}
              </View>
            )}
          </Card>
        </Animated.View>

        {/* Fotos de progreso */}
        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <Card shadow="md" padding={Spacing.base}>
            <View style={styles.sectionHeader}>
              <Text variant="h4" weight="semiBold">📸 Fotos de progreso</Text>
              <Pressable onPress={async () => {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                  Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería.');
                  return;
                }
                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: 'images',
                  allowsEditing: true,
                  aspect: [3, 4],
                  quality: 0.7,
                });
                if (!result.canceled && result.assets[0]) {
                  addPhoto({
                    id: `photo-${Date.now()}`,
                    date: today,
                    uri: result.assets[0].uri,
                  });
                }
              }}>
                <Text variant="bodySmall" weight="semiBold" style={{ color: colors.primary }}>+ Agregar</Text>
              </Pressable>
            </View>

            {photoLog.length === 0 ? (
              <Text variant="caption" color="tertiary" style={{ marginTop: Spacing.sm }}>
                Agrega fotos para ver tu evolución visual.
              </Text>
            ) : (
              <View style={styles.photoGrid}>
                {photoLog.slice().reverse().map((photo) => (
                  <Pressable
                    key={photo.id}
                    onLongPress={() => {
                      Alert.alert('Foto', '¿Qué deseas hacer?', [
                        { text: 'Cancelar', style: 'cancel' },
                        {
                          text: 'Eliminar', style: 'destructive',
                          onPress: () => deletePhoto(photo.id),
                        },
                      ]);
                    }}
                    style={styles.photoItem}
                  >
                    <Image source={{ uri: photo.uri }} style={styles.photoThumbnail} />
                    <Text variant="caption" color="tertiary" style={styles.photoDate}>{photo.date}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </Card>
        </Animated.View>

        {/* Próxima cita */}
        <Animated.View entering={FadeInDown.delay(450).duration(500)}>
          <Card shadow="sm" style={[{ backgroundColor: colors.primaryLight + '15', borderColor: colors.primary + '30', borderWidth: 1 }]}>
            <Text style={{ fontSize: 20 }}>📅</Text>
            <Text variant="body" weight="semiBold" style={{ marginTop: Spacing.sm }}>Próxima cita con el nutriólogo</Text>
            <Text variant="bodySmall" color="secondary">31 de marzo de 2026 — 2:15 pm</Text>
            <Text variant="caption" color="tertiary" style={{ marginTop: Spacing.sm }}>
              César Alejandro Méndez Hernández{'\n'}nutriologocesarmendez@gmail.com
            </Text>
          </Card>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: Spacing.base, paddingTop: Spacing.base, paddingBottom: 120, gap: Spacing.base },
  statsGrid: { flexDirection: 'row', gap: Spacing.sm },
  statCard: { flex: 1, alignItems: 'center', gap: 4 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  stepsRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.base },
  formRow: { flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-end', marginTop: Spacing.md },
  quickSteps: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  quickBtn: { flex: 1, paddingVertical: Spacing.sm, borderRadius: Radius.md, alignItems: 'center', borderWidth: 1 },
  weightDisplay: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.sm },
  changeBadge: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.full },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.sm, borderBottomWidth: 1 },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.sm },
  photoItem: { width: (SCREEN_W - 32 - Spacing.base * 2 - Spacing.sm) / 2, alignItems: 'center', gap: 4 },
  photoThumbnail: { width: '100%', aspectRatio: 3 / 4, borderRadius: Radius.lg },
  photoDate: { textAlign: 'center' },
});
