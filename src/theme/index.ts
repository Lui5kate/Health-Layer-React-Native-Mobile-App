import { Platform } from 'react-native';

export const Colors = {
  light: {
    // Backgrounds
    bg: '#FAF7F0',
    surface: '#FFFFFF',
    surfaceAlt: '#F5F1E8',
    card: '#FFFFFF',
    // Brand
    primary: '#87A878',
    primaryLight: '#A8C499',
    primaryDark: '#6B8E5E',
    accent: '#C8B89A',
    accentLight: '#DDD0BC',
    // Semantic
    success: '#5BAD6F',
    warning: '#E8A838',
    error: '#E05C5C',
    info: '#6BA8D4',
    // Text
    text: '#2D2D2D',
    textSecondary: '#6B6B6B',
    textTertiary: '#A0A0A0',
    textInverse: '#FFFFFF',
    // Borders
    border: '#E8E2D6',
    borderLight: '#F0EBE0',
    // Tab bar
    tabBar: '#FFFFFF',
    tabBarBorder: '#E8E2D6',
    tabActive: '#87A878',
    tabInactive: '#C0B8A8',
  },
  dark: {
    bg: '#121212',
    surface: '#1E1E1E',
    surfaceAlt: '#252525',
    card: '#2A2A2A',
    primary: '#87A878',
    primaryLight: '#9DBE8E',
    primaryDark: '#6B8E5E',
    accent: '#C8B89A',
    accentLight: '#D4C4A6',
    success: '#5BAD6F',
    warning: '#E8A838',
    error: '#E05C5C',
    info: '#6BA8D4',
    text: '#F0EBE0',
    textSecondary: '#A8A098',
    textTertiary: '#6B6560',
    textInverse: '#2D2D2D',
    border: '#3A3530',
    borderLight: '#302B26',
    tabBar: '#1A1A1A',
    tabBarBorder: '#2E2E2E',
    tabActive: '#87A878',
    tabInactive: '#5A5550',
  },
};

export const Typography = {
  // Font families
  fontFamily: {
    regular: 'Poppins_400Regular',
    medium: 'Poppins_500Medium',
    semiBold: 'Poppins_600SemiBold',
    bold: 'Poppins_700Bold',
    light: 'Poppins_300Light',
  },
  // Font sizes
  size: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    '2xl': 28,
    '3xl': 34,
    '4xl': 42,
  },
  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};

export const Shadow = {
  sm: Platform.select({
    ios: {
      shadowColor: '#87A878',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },
    android: { elevation: 2 },
  }),
  md: Platform.select({
    ios: {
      shadowColor: '#87A878',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
    },
    android: { elevation: 4 },
  }),
  lg: Platform.select({
    ios: {
      shadowColor: '#2D2D2D',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.10,
      shadowRadius: 16,
    },
    android: { elevation: 8 },
  }),
};

// Meal type colors
export const MealColors = {
  breakfast: { bg: '#FFF8EC', accent: '#F5A623', icon: '🌅' },
  lunch: { bg: '#F0F9ED', accent: '#87A878', icon: '☀️' },
  dinner: { bg: '#F0F0FF', accent: '#8B85C1', icon: '🌙' },
};

// Workout type colors
export const WorkoutColors = {
  gym: { bg: '#FFF0F0', accent: '#E05C5C', icon: '🏋️' },
  pilates: { bg: '#F0F9F0', accent: '#87A878', icon: '🧘' },
  home: { bg: '#FFF8EC', accent: '#E8A838', icon: '🏠' },
  cardio: { bg: '#FFF0F0', accent: '#E05C5C', icon: '🏃' },
  walk: { bg: '#F0F9F0', accent: '#87A878', icon: '🚶' },
};
