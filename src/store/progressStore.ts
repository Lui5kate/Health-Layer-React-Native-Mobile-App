import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PhotoEntry {
  id: string;
  date: string; // 'YYYY-MM-DD'
  uri: string;
  note?: string;
}

export interface WeightEntry {
  date: string; // 'YYYY-MM-DD'
  weightKg: number;
  notes?: string;
}

export interface MeasurementEntry {
  date: string;
  waistCm?: number;
  hipCm?: number;
  chestCm?: number;
  armCm?: number;
  thighCm?: number;
}

interface ProgressState {
  weightLog: WeightEntry[];
  measurementLog: MeasurementEntry[];
  photoLog: PhotoEntry[];

  addWeight: (entry: WeightEntry) => void;
  addMeasurement: (entry: MeasurementEntry) => void;
  deleteWeight: (date: string) => void;

  addPhoto: (entry: PhotoEntry) => void;
  deletePhoto: (id: string) => void;

  getLatestWeight: () => WeightEntry | undefined;
  getWeightChange: () => number | null; // kg difference last 2 entries
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      weightLog: [],
      measurementLog: [],
      photoLog: [],

      addWeight: (entry) => {
        const existing = get().weightLog.findIndex((e) => e.date === entry.date);
        if (existing >= 0) {
          const updated = [...get().weightLog];
          updated[existing] = entry;
          set({ weightLog: updated });
        } else {
          set({ weightLog: [...get().weightLog, entry].sort((a, b) => a.date.localeCompare(b.date)) });
        }
      },

      addMeasurement: (entry) => {
        const existing = get().measurementLog.findIndex((e) => e.date === entry.date);
        if (existing >= 0) {
          const updated = [...get().measurementLog];
          updated[existing] = { ...updated[existing], ...entry };
          set({ measurementLog: updated });
        } else {
          set({ measurementLog: [...get().measurementLog, entry] });
        }
      },

      deleteWeight: (date) => {
        set({ weightLog: get().weightLog.filter((e) => e.date !== date) });
      },

      addPhoto: (entry) => {
        set({ photoLog: [...get().photoLog, entry] });
      },

      deletePhoto: (id) => {
        set({ photoLog: get().photoLog.filter((e) => e.id !== id) });
      },

      getLatestWeight: () => {
        const log = get().weightLog;
        return log.length > 0 ? log[log.length - 1] : undefined;
      },

      getWeightChange: () => {
        const log = get().weightLog;
        if (log.length < 2) return null;
        return log[log.length - 1].weightKg - log[log.length - 2].weightKg;
      },
    }),
    {
      name: 'health-layer-progress',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
