import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface StepsState {
  log: { [dateKey: string]: number };
  goal: number;

  setSteps: (dateKey: string, steps: number) => void;
  addSteps: (dateKey: string, steps: number) => void;
  setGoal: (steps: number) => void;

  getSteps: (dateKey: string) => number;
  getProgress: (dateKey: string) => number; // 0 to 1
  getWeeklyData: () => { date: string; steps: number }[];
  getWeeklyAverage: () => number;
}

export const useStepsStore = create<StepsState>()(
  persist(
    (set, get) => ({
      log: {},
      goal: 8000,

      setSteps: (dateKey, steps) =>
        set({ log: { ...get().log, [dateKey]: Math.max(0, steps) } }),

      addSteps: (dateKey, steps) => {
        const current = get().log[dateKey] ?? 0;
        set({ log: { ...get().log, [dateKey]: Math.max(0, current + steps) } });
      },

      setGoal: (steps) => set({ goal: steps }),

      getSteps: (dateKey) => get().log[dateKey] ?? 0,

      getProgress: (dateKey) => {
        const steps = get().log[dateKey] ?? 0;
        return Math.min(steps / get().goal, 1);
      },

      getWeeklyData: () => {
        const today = new Date();
        const result = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          const key = d.toISOString().split('T')[0];
          result.push({ date: key, steps: get().log[key] ?? 0 });
        }
        return result;
      },

      getWeeklyAverage: () => {
        const data = get().getWeeklyData();
        const withData = data.filter((d) => d.steps > 0);
        if (withData.length === 0) return 0;
        return Math.round(withData.reduce((sum, d) => sum + d.steps, 0) / withData.length);
      },
    }),
    { name: 'health-layer-steps', storage: createJSONStorage(() => AsyncStorage) }
  )
);
