import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/theme';

type Variant = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'bodySmall' | 'caption' | 'label';
type Weight = 'light' | 'regular' | 'medium' | 'semiBold' | 'bold';
type Color = 'primary' | 'secondary' | 'tertiary' | 'accent' | 'inverse' | 'success' | 'warning' | 'error';

interface AppTextProps extends TextProps {
  variant?: Variant;
  weight?: Weight;
  color?: Color;
}

const variantStyles: Record<Variant, object> = {
  h1: { fontSize: Typography.size['3xl'], lineHeight: Typography.size['3xl'] * 1.2 },
  h2: { fontSize: Typography.size['2xl'], lineHeight: Typography.size['2xl'] * 1.25 },
  h3: { fontSize: Typography.size.xl, lineHeight: Typography.size.xl * 1.3 },
  h4: { fontSize: Typography.size.lg, lineHeight: Typography.size.lg * 1.35 },
  body: { fontSize: Typography.size.base, lineHeight: Typography.size.base * 1.6 },
  bodySmall: { fontSize: Typography.size.sm, lineHeight: Typography.size.sm * 1.6 },
  caption: { fontSize: Typography.size.xs, lineHeight: Typography.size.xs * 1.5 },
  label: { fontSize: Typography.size.sm, lineHeight: Typography.size.sm * 1.4 },
};

const defaultWeights: Record<Variant, Weight> = {
  h1: 'bold',
  h2: 'bold',
  h3: 'semiBold',
  h4: 'semiBold',
  body: 'regular',
  bodySmall: 'regular',
  caption: 'regular',
  label: 'medium',
};

export function Text({ variant = 'body', weight, color, style, ...props }: AppTextProps) {
  const { colors, typography } = useTheme();

  const colorMap: Record<Color, string> = {
    primary: colors.text,
    secondary: colors.textSecondary,
    tertiary: colors.textTertiary,
    accent: colors.accent,
    inverse: colors.textInverse,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
  };

  const resolvedWeight = weight ?? defaultWeights[variant];
  const fontFamily = typography.fontFamily[resolvedWeight];

  return (
    <RNText
      style={[
        variantStyles[variant],
        { fontFamily, color: colorMap[color ?? 'primary'] },
        style,
      ]}
      {...props}
    />
  );
}
