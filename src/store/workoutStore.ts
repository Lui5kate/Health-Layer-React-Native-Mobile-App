import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutType } from '@/data/workouts';

export interface ExerciseLog {
  exerciseId: string;
  sets: Array<{ reps: number | string; weight?: number; durationSeconds?: number }>;
}

export interface WorkoutSession {
  id: string;
  date: string; // 'YYYY-MM-DD'
  templateId: string;
  type: WorkoutType;
  startTime: string; // ISO
  endTime?: string; // ISO
  durationMinutes?: number;
  exerciseLogs: ExerciseLog[];
  // Para pilates
  instructor?: string;
  intensity?: 1 | 2 | 3 | 4 | 5; // subjetivo
  notes?: string;
}

// Agenda: { [dateKey]: templateId }
type WorkoutSchedule = { [dateKey: string]: string };

interface WorkoutState {
  sessions: WorkoutSession[];
  activeSession: WorkoutSession | null;
  schedule: WorkoutSchedule;

  scheduleWorkout: (dateKey: string, templateId: string) => void;
  removeScheduled: (dateKey: string) => void;
  getScheduled: (dateKey: string) => string | undefined;
  getWeekSchedule: () => { date: string; templateId: string }[];

  startSession: (templateId: string, type: WorkoutType) => void;
  logExercise: (exerciseLog: ExerciseLog) => void;
  finishSession: (opts?: { notes?: string; instructor?: string; intensity?: 1 | 2 | 3 | 4 | 5 }) => void;
  cancelSession: () => void;

  getSessionsByDate: (dateKey: string) => WorkoutSession[];
  getTotalSessionsThisWeek: () => number;
  getLastSession: (templateId: string) => WorkoutSession | undefined;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeSession: null,
      schedule: {},

      scheduleWorkout: (dateKey, templateId) =>
        set({ schedule: { ...get().schedule, [dateKey]: templateId } }),

      removeScheduled: (dateKey) => {
        const s = { ...get().schedule };
        delete s[dateKey];
        set({ schedule: s });
      },

      getScheduled: (dateKey) => get().schedule[dateKey],

      getWeekSchedule: () => {
        const today = new Date();
        const monday = new Date(today);
        monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
        return Array.from({ length: 7 }, (_, i) => {
          const d = new Date(monday);
          d.setDate(monday.getDate() + i);
          const key = d.toISOString().split('T')[0];
          return { date: key, templateId: get().schedule[key] ?? '' };
        }).filter((d) => d.templateId);
      },

      startSession: (templateId, type) => {
        const now = new Date();
        const session: WorkoutSession = {
          id: `session-${Date.now()}`,
          date: now.toISOString().split('T')[0],
          templateId,
          type,
          startTime: now.toISOString(),
          exerciseLogs: [],
        };
        set({ activeSession: session });
      },

      logExercise: (exerciseLog) => {
        const active = get().activeSession;
        if (!active) return;
        const existing = active.exerciseLogs.findIndex(
          (e) => e.exerciseId === exerciseLog.exerciseId
        );
        const newLogs = [...active.exerciseLogs];
        if (existing >= 0) {
          newLogs[existing] = exerciseLog;
        } else {
          newLogs.push(exerciseLog);
        }
        set({ activeSession: { ...active, exerciseLogs: newLogs } });
      },

      finishSession: (opts) => {
        const active = get().activeSession;
        if (!active) return;
        const now = new Date();
        const start = new Date(active.startTime);
        const duration = Math.round((now.getTime() - start.getTime()) / 60000);
        const finished: WorkoutSession = {
          ...active,
          endTime: now.toISOString(),
          durationMinutes: duration,
          notes: opts?.notes,
          instructor: opts?.instructor,
          intensity: opts?.intensity,
        };
        set({
          sessions: [...get().sessions, finished],
          activeSession: null,
        });
      },

      cancelSession: () => set({ activeSession: null }),

      getSessionsByDate: (dateKey) => {
        return get().sessions.filter((s) => s.date === dateKey);
      },

      getTotalSessionsThisWeek: () => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        return get().sessions.filter((s) => new Date(s.date) >= startOfWeek).length;
      },

      getLastSession: (templateId) => {
        const sessions = get().sessions.filter((s) => s.templateId === templateId);
        return sessions[sessions.length - 1];
      },
    }),
    {
      name: 'health-layer-workouts',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
