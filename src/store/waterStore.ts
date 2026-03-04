import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WaterLog {
  [dateKey: string]: number; // ml bebidos en ese día
}

interface WaterState {
  log: WaterLog;
  goalMl: number; // default 1500

  addWater: (dateKey: string, ml: number) => void;
  removeWater: (dateKey: string, ml: number) => void;
  setGoal: (ml: number) => void;

  getTodayMl: (dateKey: string) => number;
  getProgress: (dateKey: string) => number; // 0 to 1
  getWeeklyAverage: () => number;
}

export const useWaterStore = create<WaterState>()(
  persist(
    (set, get) => ({
      log: {},
      goalMl: 1500,

      addWater: (dateKey, ml) => {
        const current = get().log[dateKey] ?? 0;
        set({ log: { ...get().log, [dateKey]: Math.max(0, current + ml) } });
      },

      removeWater: (dateKey, ml) => {
        const current = get().log[dateKey] ?? 0;
        set({ log: { ...get().log, [dateKey]: Math.max(0, current - ml) } });
      },

      setGoal: (ml) => set({ goalMl: ml }),

      getTodayMl: (dateKey) => get().log[dateKey] ?? 0,

      getProgress: (dateKey) => {
        const ml = get().log[dateKey] ?? 0;
        return Math.min(ml / get().goalMl, 1);
      },

      getWeeklyAverage: () => {
        const today = new Date();
        let total = 0;
        let count = 0;
        for (let i = 0; i < 7; i++) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          const key = d.toISOString().split('T')[0];
          const ml = get().log[key];
          if (ml !== undefined) {
            total += ml;
            count++;
          }
        }
        return count > 0 ? Math.round(total / count) : 0;
      },
    }),
    {
      name: 'health-layer-water',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
