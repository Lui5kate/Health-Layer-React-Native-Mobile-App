import { useColorScheme } from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/theme';
import { useThemeStore } from '@/store/themeStore';

export function useTheme() {
  const systemScheme = useColorScheme();
  const { mode } = useThemeStore();

  const isDark =
    mode === 'dark' ? true :
    mode === 'light' ? false :
    systemScheme === 'dark';

  const colors = isDark ? Colors.dark : Colors.light;

  return { colors, typography: Typography, spacing: Spacing, radius: Radius, shadow: Shadow, isDark };
}
