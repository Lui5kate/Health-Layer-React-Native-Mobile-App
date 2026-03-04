import React from 'react';
import { View, ViewProps, StyleSheet, Pressable, PressableProps } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Radius, Shadow } from '@/theme';

interface CardProps extends ViewProps {
  padding?: number;
  radius?: number;
  shadow?: 'sm' | 'md' | 'lg' | 'none';
}

interface PressableCardProps extends PressableProps {
  padding?: number;
  radius?: number;
  shadow?: 'sm' | 'md' | 'lg' | 'none';
  children?: React.ReactNode;
}

export function Card({ padding = 16, radius = Radius.lg, shadow = 'md', style, children, ...props }: CardProps) {
  const { colors } = useTheme();
  const shadowStyle = shadow !== 'none' ? Shadow[shadow] : {};

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: colors.card, borderRadius: radius, padding },
        shadowStyle,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

export function PressableCard({ padding = 16, radius = Radius.lg, shadow = 'md', style, children, ...props }: PressableCardProps) {
  const { colors } = useTheme();
  const shadowStyle = shadow !== 'none' ? Shadow[shadow] : {};

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: colors.card, borderRadius: radius, padding, opacity: pressed ? 0.95 : 1 },
        shadowStyle,
        style,
      ]}
      {...props}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 0,
  },
});
