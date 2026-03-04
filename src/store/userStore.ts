import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Gender = 'female' | 'male' | 'prefer_not_to_say';

export interface UserProfile {
  id: string;
  name: string;
  nickname: string;
  gender?: Gender;
  weightKg?: number;
  heightCm?: number;
  waterGoalMl: number;
  dailyStepsGoal: number;
  onboardingCompleted: boolean;
  createdAt: string;
  avatarUri?: string;
  notificationsEnabled?: boolean;
}

interface UserState {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (partial: Partial<UserProfile>) => void;
  completeOnboarding: () => void;
  reset: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),
      updateProfile: (partial) => {
        const current = get().profile;
        if (!current) return;
        set({ profile: { ...current, ...partial } });
      },
      completeOnboarding: () => {
        const current = get().profile;
        if (!current) return;
        set({ profile: { ...current, onboardingCompleted: true } });
      },
      reset: () => set({ profile: null }),
    }),
    { name: 'health-layer-user', storage: createJSONStorage(() => AsyncStorage) }
  )
);
