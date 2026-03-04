import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Meal } from '@/data/meals';

interface DailyMealLog {
  [dateKey: string]: {
    completedMealIds: string[];
    selectedMealIds: {
      breakfast?: string;
      lunch?: string;
      dinner?: string;
    };
    notes?: string;
  };
}

// Plan semanal: qué recetas quiero hacer esta semana (para lista de compras)
// { [week]: string[] } array de mealIds seleccionados para comprar
interface WeeklyPlan {
  [week: number]: string[];
}

interface MealState {
  activeWeek: number;
  log: DailyMealLog;
  weeklyPlan: WeeklyPlan;
  customMeals: Meal[];

  setActiveWeek: (week: number) => void;
  selectMeal: (dateKey: string, type: 'breakfast' | 'lunch' | 'dinner', mealId: string) => void;
  toggleMealComplete: (dateKey: string, mealId: string) => void;

  // Plan semanal para lista de compras
  toggleWeeklyMeal: (week: number, mealId: string) => void;
  isInWeeklyPlan: (week: number, mealId: string) => boolean;
  getWeeklyPlanMeals: (week: number) => string[];

  addCustomMeal: (meal: Meal) => void;
  deleteCustomMeal: (id: string) => void;

  isMealCompleted: (dateKey: string, mealId: string) => boolean;
  getSelectedMeals: (dateKey: string) => DailyMealLog[string]['selectedMealIds'];
  getCompletedCount: (dateKey: string) => number;
  getStreak: () => number;
}

export const useMealStore = create<MealState>()(
  persist(
    (set, get) => ({
      activeWeek: 1,
      log: {},
      weeklyPlan: {},
      customMeals: [],

      setActiveWeek: (week) => set({ activeWeek: week }),

      selectMeal: (dateKey, type, mealId) => {
        const log = get().log;
        set({
          log: {
            ...log,
            [dateKey]: {
              ...log[dateKey],
              selectedMealIds: {
                ...log[dateKey]?.selectedMealIds,
                [type]: mealId,
              },
              completedMealIds: log[dateKey]?.completedMealIds ?? [],
            },
          },
        });
      },

      toggleMealComplete: (dateKey, mealId) => {
        const log = get().log;
        const dayLog = log[dateKey] ?? { completedMealIds: [], selectedMealIds: {} };
        const isCompleted = dayLog.completedMealIds.includes(mealId);
        const newCompleted = isCompleted
          ? dayLog.completedMealIds.filter((id) => id !== mealId)
          : [...dayLog.completedMealIds, mealId];
        set({ log: { ...log, [dateKey]: { ...dayLog, completedMealIds: newCompleted } } });
      },

      toggleWeeklyMeal: (week, mealId) => {
        const plan = get().weeklyPlan;
        const weekMeals = plan[week] ?? [];
        const isIn = weekMeals.includes(mealId);
        set({
          weeklyPlan: {
            ...plan,
            [week]: isIn
              ? weekMeals.filter((id) => id !== mealId)
              : [...weekMeals, mealId],
          },
        });
      },

      isInWeeklyPlan: (week, mealId) => {
        return get().weeklyPlan[week]?.includes(mealId) ?? false;
      },

      getWeeklyPlanMeals: (week) => {
        return get().weeklyPlan[week] ?? [];
      },

      addCustomMeal: (meal) => set({ customMeals: [...get().customMeals, meal] }),

      deleteCustomMeal: (id) => set({ customMeals: get().customMeals.filter((m) => m.id !== id) }),

      isMealCompleted: (dateKey, mealId) =>
        get().log[dateKey]?.completedMealIds?.includes(mealId) ?? false,

      getSelectedMeals: (dateKey) =>
        get().log[dateKey]?.selectedMealIds ?? {},

      getCompletedCount: (dateKey) =>
        get().log[dateKey]?.completedMealIds?.length ?? 0,

      getStreak: () => {
        const log = get().log;
        let streak = 0;
        const today = new Date();
        for (let i = 0; i < 365; i++) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          const key = d.toISOString().split('T')[0];
          const completed = log[key]?.completedMealIds?.length ?? 0;
          if (completed >= 2) streak++;
          else if (i > 0) break;
        }
        return streak;
      },
    }),
    {
      name: 'health-layer-meals',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
