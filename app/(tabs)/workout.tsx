import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Alert, Modal, TextInput } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/useTheme';
import { Text } from '@/components/ui/Text';
import { Card, PressableCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useWorkoutStore } from '@/store/workoutStore';
import { workoutTemplates, type WorkoutTemplate } from '@/data/workouts';
import { Spacing, Radius, WorkoutColors } from '@/theme';
import { todayKey } from '@/utils/date';

// ─── Helpers ────────────────────────────────────────────────────────────────
function getWeekDays(today: string) {
  const base = new Date(today + 'T12:00:00');
  const dayOfWeek = base.getDay(); // 0=Sun
  const monday = new Date(base);
  monday.setDate(base.getDate() - ((dayOfWeek + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const key = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('es-MX', { weekday: 'short' }).slice(0, 2);
    const dayNum = d.getDate();
    return { key, label, dayNum };
  });
}

// ─── Agenda semanal ──────────────────────────────────────────────────────────
function WeekCalendar({ today, onSelectDay }: { today: string; onSelectDay: (dateKey: string) => void }) {
  const { colors } = useTheme();
  const { getScheduled } = useWorkoutStore();
  const weekDays = getWeekDays(today);

  return (
    <Card shadow="md" padding={Spacing.base}>
      <View style={styles.calHeader}>
        <Text variant="label" weight="bold" style={{ color: colors.text, letterSpacing: 0.5 }}>
          AGENDA SEMANAL
        </Text>
        <Text variant="caption" color="secondary">Toca un día para programar</Text>
      </View>
      <View style={styles.calRow}>
        {weekDays.map(({ key, label, dayNum }) => {
          const scheduledId = getScheduled(key);
          const template = scheduledId ? workoutTemplates.find((t) => t.id === scheduledId) : null;
          const wc = template ? WorkoutColors[template.type] : null;
          const isToday = key === today;
          const isPast = key < today;
          return (
            <Pressable key={key} onPress={() => onSelectDay(key)} style={styles.calDay}>
              <Text variant="caption" weight={isToday ? 'bold' : 'regular'}
                style={{ color: isToday ? colors.primary : colors.textSecondary, textTransform: 'capitalize' }}>
                {label}
              </Text>
              <View style={[
                styles.calDayCircle,
                isToday && { backgroundColor: colors.primary },
                isPast && !isToday && { opacity: 0.5 },
              ]}>
                <Text variant="caption" weight={isToday ? 'bold' : 'medium'}
                  style={{ color: isToday ? '#FFF' : colors.text }}>
                  {dayNum}
                </Text>
              </View>
              {wc ? (
                <Text style={{ fontSize: 14 }}>{wc.icon}</Text>
              ) : (
                <View style={[styles.calDot, { backgroundColor: colors.border }]} />
              )}
            </Pressable>
          );
        })}
      </View>
    </Card>
  );
}

// ─── Modal para programar ────────────────────────────────────────────────────
function ScheduleModal({
  dateKey,
  onClose,
}: {
  dateKey: string | null;
  onClose: () => void;
}) {
  const { colors } = useTheme();
  const { getScheduled, scheduleWorkout, removeScheduled } = useWorkoutStore();
  if (!dateKey) return null;
  const scheduledId = getScheduled(dateKey);

  const dateLabel = new Date(dateKey + 'T12:00:00').toLocaleDateString('es-MX', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={[styles.modalSheet, { backgroundColor: colors.bg }]} onPress={() => {}}>
          <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
          <Text variant="h4" weight="bold" style={{ marginBottom: Spacing.xs, textTransform: 'capitalize' }}>
            {dateLabel}
          </Text>
          <Text variant="caption" color="secondary" style={{ marginBottom: Spacing.base }}>
            Selecciona el entrenamiento para este día
          </Text>

          {workoutTemplates.map((t) => {
            const wc = WorkoutColors[t.type];
            const isSelected = scheduledId === t.id;
            return (
              <Pressable
                key={t.id}
                onPress={() => { scheduleWorkout(dateKey, t.id); onClose(); }}
                style={[
                  styles.modalOption,
                  {
                    backgroundColor: isSelected ? colors.primary + '15' : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                    borderWidth: isSelected ? 1.5 : 1,
                  },
                ]}
              >
                <Text style={{ fontSize: 22 }}>{wc.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text variant="body" weight={isSelected ? 'semiBold' : 'regular'}>{t.name}</Text>
                  <Text variant="caption" color="secondary">
                    {t.exercises.length} ejercicios
                    {t.warmupMinutes > 0 ? ` · ${t.warmupMinutes}min calentamiento` : ''}
                  </Text>
                </View>
                {isSelected && (
                  <View style={[styles.selectedCheck, { backgroundColor: colors.primary }]}>
                    <Text variant="caption" weight="bold" style={{ color: '#FFF' }}>✓</Text>
                  </View>
                )}
              </Pressable>
            );
          })}

          {scheduledId && (
            <Button
              label="Quitar de agenda"
              variant="ghost"
              size="sm"
              onPress={() => { removeScheduled(dateKey); onClose(); }}
              style={{ marginTop: Spacing.sm }}
            />
          )}
          <Button label="Cerrar" variant="ghost" size="sm" onPress={onClose}
            style={{ marginTop: Spacing.xs }} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function WorkoutTemplateCard({
  template,
  onStart,
  lastSession,
}: {
  template: WorkoutTemplate;
  onStart: () => void;
  lastSession?: ReturnType<typeof useWorkoutStore.getState>['sessions'][number];
}) {
  const { colors } = useTheme();
  const wColors = WorkoutColors[template.type];

  return (
    <PressableCard onPress={onStart} shadow="md" style={styles.templateCard} padding={0}>
      <View style={[styles.templateHeader, { backgroundColor: wColors.bg }]}>
        <View style={styles.templateHeaderLeft}>
          <Text style={{ fontSize: 32 }}>{wColors.icon}</Text>
          <View>
            <Text variant="body" weight="bold">{template.name}</Text>
            {lastSession && (
              <Text variant="caption" color="secondary">
                Última vez: {lastSession.date}
              </Text>
            )}
          </View>
        </View>
      </View>

      <View style={[styles.templateBody, { paddingHorizontal: Spacing.base, paddingBottom: Spacing.base }]}>
        {template.exercises.length > 0 && (
          <View style={{ gap: Spacing.xs }}>
            {template.exercises.slice(0, 4).map((ex, i) => (
              <View key={ex.id} style={styles.exercisePreview}>
                <Text variant="caption" style={{ color: colors.textTertiary, width: 20 }}>
                  {i + 1}.
                </Text>
                <Text variant="caption" style={{ flex: 1 }}>{ex.name}</Text>
                <Text variant="caption" weight="medium" style={{ color: wColors.accent }}>
                  {ex.sets}×{ex.reps}
                </Text>
              </View>
            ))}
            {template.exercises.length > 4 && (
              <Text variant="caption" color="tertiary">
                +{template.exercises.length - 4} ejercicios más
              </Text>
            )}
          </View>
        )}

        <View style={styles.templateMeta}>
          {template.warmupMinutes > 0 && (
            <View style={[styles.metaChip, { backgroundColor: colors.surfaceAlt }]}>
              <Text variant="caption" color="secondary">
                🔥 {template.warmupMinutes}min calentamiento
              </Text>
            </View>
          )}
          {template.cardioMinutes > 0 && (
            <View style={[styles.metaChip, { backgroundColor: colors.surfaceAlt }]}>
              <Text variant="caption" color="secondary">
                🏃 {template.cardioMinutes}min cardio
              </Text>
            </View>
          )}
        </View>

        <Button label="Iniciar a entrenar" onPress={onStart} size="sm" style={{ marginTop: Spacing.md }} />
      </View>
    </PressableCard>
  );
}

// ─── Sesión activa ──────────────────────────────────────────────────────────
function ActiveSessionView({
  template,
  onFinish,
  onCancel,
}: {
  template: WorkoutTemplate;
  onFinish: () => void;
  onCancel: () => void;
}) {
  const { colors } = useTheme();
  const { logExercise, activeSession } = useWorkoutStore();
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setCompletedExercises((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const progress = template.exercises.length > 0
    ? completedExercises.size / template.exercises.length
    : 0;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 120, gap: Spacing.base }}
    >
      <Animated.View entering={FadeInDown.duration(400)}>
        <Card shadow="md" style={{ borderLeftWidth: 4, borderLeftColor: colors.primary }}>
          <Text variant="h4" weight="bold">{template.name}</Text>
          <Text variant="bodySmall" color="secondary">
            {Math.round(progress * 100)}% completado
          </Text>
          <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: colors.primary,
                  width: `${Math.round(progress * 100)}%`,
                },
              ]}
            />
          </View>
        </Card>
      </Animated.View>

      {template.exercises.map((ex, i) => {
        const done = completedExercises.has(ex.id);
        return (
          <Animated.View key={ex.id} entering={FadeInRight.delay(i * 60).duration(400)}>
            <Pressable onPress={() => toggle(ex.id)}>
              <Card
                shadow="sm"
                style={[
                  styles.exerciseCard,
                  done && { opacity: 0.6, borderColor: colors.success, borderWidth: 1.5 },
                ]}
              >
                <View style={styles.exerciseRow}>
                  <View
                    style={[
                      styles.exerciseNum,
                      { backgroundColor: done ? colors.success : colors.primary },
                    ]}
                  >
                    <Text
                      variant="caption"
                      weight="bold"
                      style={{ color: '#FFF' }}
                    >
                      {done ? '✓' : `${i + 1}`}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="body" weight="semiBold"
                      style={{ textDecorationLine: done ? 'line-through' : 'none' }}>
                      {ex.name}
                    </Text>
                    {ex.notes && (
                      <Text variant="caption" color="secondary">{ex.notes}</Text>
                    )}
                  </View>
                  <View style={styles.setsInfo}>
                    <Text variant="h4" weight="bold" style={{ color: colors.primary }}>
                      {ex.sets}
                    </Text>
                    <Text variant="caption" color="secondary">series</Text>
                    <Text variant="caption" weight="medium">× {ex.reps}</Text>
                  </View>
                </View>
              </Card>
            </Pressable>
          </Animated.View>
        );
      })}

      {template.notes && (
        <Card shadow="none" style={{ backgroundColor: colors.surfaceAlt }}>
          <Text variant="caption" color="secondary">
            📝 {template.notes}
          </Text>
        </Card>
      )}

      <View style={styles.sessionActions}>
        <Button label="Cancelar" variant="ghost" onPress={onCancel} style={{ flex: 1 }} />
        <Button label="Finalizar sesión ✓" onPress={onFinish} style={{ flex: 2 }} />
      </View>
    </ScrollView>
  );
}

// ─── Modal finalizar sesión ──────────────────────────────────────────────────
function FinishSessionModal({
  visible,
  isPilates,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  isPilates: boolean;
  onConfirm: (opts: { notes: string; intensity: number; instructor: string }) => void;
  onCancel: () => void;
}) {
  const { colors } = useTheme();
  const [intensity, setIntensity] = useState(3);
  const [notes, setNotes] = useState('');
  const [instructor, setInstructor] = useState('');

  const handleConfirm = () => {
    onConfirm({ notes, intensity, instructor });
    setNotes('');
    setInstructor('');
    setIntensity(3);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <Pressable style={styles.modalOverlay} onPress={onCancel}>
        <Pressable style={[styles.modalSheet, { backgroundColor: colors.bg }]} onPress={() => {}}>
          <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
          <Text variant="h4" weight="bold" style={{ marginBottom: Spacing.sm }}>
            Finalizar sesión
          </Text>
          <Text variant="caption" color="secondary" style={{ marginBottom: Spacing.base }}>
            ¿Cómo te fue hoy?
          </Text>

          {/* Intensidad */}
          <Text variant="label" weight="semiBold" style={{ marginBottom: Spacing.sm }}>
            Intensidad
          </Text>
          <View style={{ flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.base }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable key={star} onPress={() => setIntensity(star)} hitSlop={6}>
                <Text style={{ fontSize: 28 }}>{star <= intensity ? '⭐' : '☆'}</Text>
              </Pressable>
            ))}
          </View>

          {/* Notas */}
          <Text variant="label" weight="semiBold" style={{ marginBottom: Spacing.sm }}>
            Notas (opcional)
          </Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="¿Algo que destacar?"
            placeholderTextColor={colors.textTertiary}
            multiline
            style={[styles.notesInput, {
              backgroundColor: colors.surface,
              color: colors.text,
              borderColor: colors.border,
            }]}
          />

          {/* Instructor (solo pilates) */}
          {isPilates && (
            <>
              <Text variant="label" weight="semiBold" style={{ marginVertical: Spacing.sm }}>
                Instructor
              </Text>
              <TextInput
                value={instructor}
                onChangeText={setInstructor}
                placeholder="Nombre del instructor"
                placeholderTextColor={colors.textTertiary}
                style={[styles.notesInput, {
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.border,
                }]}
              />
            </>
          )}

          <View style={{ flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.base }}>
            <Button label="Cancelar" variant="ghost" onPress={onCancel} style={{ flex: 1 }} />
            <Button label="Guardar y terminar" onPress={handleConfirm} style={{ flex: 2 }} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─── Pantalla principal ─────────────────────────────────────────────────────
export default function WorkoutScreen() {
  const { colors } = useTheme();
  const { startSession, finishSession, cancelSession, activeSession, getLastSession } =
    useWorkoutStore();
  const [scheduleDay, setScheduleDay] = useState<string | null>(null);
  const [showFinishModal, setShowFinishModal] = useState(false);

  const today = todayKey();
  const activeTemplate = activeSession
    ? workoutTemplates.find((t) => t.id === activeSession.templateId)
    : null;

  const handleStart = (template: WorkoutTemplate) => {
    startSession(template.id, template.type);
  };

  const handleFinish = () => {
    setShowFinishModal(true);
  };

  const handleConfirmFinish = (opts: { notes: string; intensity: number; instructor: string }) => {
    finishSession({
      notes: opts.notes || undefined,
      intensity: opts.intensity as 1 | 2 | 3 | 4 | 5,
      instructor: opts.instructor || undefined,
    });
    setShowFinishModal(false);
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancelar sesión',
      '¿Estás segura de que quieres cancelar? No se guardará el progreso.',
      [
        { text: 'Continuar', style: 'cancel' },
        { text: 'Cancelar sesión', style: 'destructive', onPress: cancelSession },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <Animated.View entering={FadeInDown.delay(50).duration(500)} style={styles.header}>
        <Text variant="h3" weight="bold">Ejercicio</Text>
        {activeSession && (
          <View style={[styles.activeBadge, { backgroundColor: colors.error + '20' }]}>
            <View style={[styles.activeDot, { backgroundColor: colors.error }]} />
            <Text variant="caption" weight="semiBold" style={{ color: colors.error }}>
              Sesión activa
            </Text>
          </View>
        )}
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {activeTemplate ? (
          <ActiveSessionView
            template={activeTemplate}
            onFinish={handleFinish}
            onCancel={handleCancel}
          />
        ) : (
          <>
            {/* Agenda semanal */}
            <Animated.View entering={FadeInDown.delay(80).duration(500)}>
              <WeekCalendar today={today} onSelectDay={setScheduleDay} />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(100).duration(500)}>
              <Text variant="label" weight="bold" style={[styles.sectionTitle, { color: colors.text }]}>
                PLAN DEL NUTRIÓLOGO
              </Text>
            </Animated.View>
            {workoutTemplates.filter((t) => t.type === 'gym').map((t, i) => (
              <Animated.View key={t.id} entering={FadeInDown.delay(150 + i * 100).duration(500)}>
                <WorkoutTemplateCard
                  template={t}
                  onStart={() => handleStart(t)}
                  lastSession={getLastSession(t.id)}
                />
              </Animated.View>
            ))}

            <Animated.View entering={FadeInDown.delay(350).duration(500)}>
              <Text variant="label" weight="bold" style={[styles.sectionTitle, { color: colors.text }]}>
                OTROS ENTRENAMIENTOS
              </Text>
            </Animated.View>
            {workoutTemplates.filter((t) => t.type !== 'gym').map((t, i) => (
              <Animated.View key={t.id} entering={FadeInDown.delay(400 + i * 100).duration(500)}>
                <WorkoutTemplateCard
                  template={t}
                  onStart={() => handleStart(t)}
                  lastSession={getLastSession(t.id)}
                />
              </Animated.View>
            ))}
          </>
        )}
      </ScrollView>

      <ScheduleModal dateKey={scheduleDay} onClose={() => setScheduleDay(null)} />

      <FinishSessionModal
        visible={showFinishModal}
        isPilates={activeTemplate?.type === 'pilates'}
        onConfirm={handleConfirmFinish}
        onCancel={() => setShowFinishModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.md,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  scroll: {
    paddingHorizontal: Spacing.base,
    paddingBottom: 120,
    gap: Spacing.md,
  },
  sectionTitle: {
    letterSpacing: 0.8,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  templateCard: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
  },
  templateHeader: {
    padding: Spacing.base,
  },
  templateHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  templateBody: {},
  exercisePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: 3,
  },
  templateMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  metaChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginTop: Spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  exerciseCard: {
    borderRadius: Radius.lg,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  exerciseNum: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setsInfo: {
    alignItems: 'center',
  },
  sessionActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  // Calendar
  calHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  calRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calDay: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  calDayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  // Schedule modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.base,
    paddingBottom: 40,
    gap: Spacing.sm,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.lg,
  },
  selectedCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.md,
    fontSize: 14,
    minHeight: 48,
    marginBottom: Spacing.sm,
  },
});
