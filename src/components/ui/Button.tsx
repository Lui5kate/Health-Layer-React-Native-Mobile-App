import React from 'react';
import { Pressable, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { Text } from './Text';
import { Radius, Spacing } from '@/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  leftIcon?: React.ReactNode;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  leftIcon,
}: ButtonProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const sizeStyles: Record<Size, object> = {
    sm: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, borderRadius: Radius.md },
    md: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, borderRadius: Radius.lg },
    lg: { paddingVertical: Spacing.base, paddingHorizontal: Spacing['2xl'], borderRadius: Radius.xl },
  };

  const bgColors: Record<Variant, string> = {
    primary: colors.primary,
    secondary: colors.surfaceAlt,
    ghost: 'transparent',
    danger: colors.error,
  };

  const textColors: Record<Variant, 'inverse' | 'primary' | 'error'> = {
    primary: 'inverse',
    secondary: 'primary',
    ghost: 'primary',
    danger: 'inverse',
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.96); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      disabled={disabled || loading}
      style={[
        styles.base,
        sizeStyles[size],
        { backgroundColor: bgColors[variant], width: fullWidth ? '100%' : undefined },
        variant === 'ghost' && { borderWidth: 1.5, borderColor: colors.border },
        disabled && { opacity: 0.5 },
        animatedStyle,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#FFF' : colors.primary} size="small" />
      ) : (
        <>
          {leftIcon}
          <Text variant="label" weight="semiBold" color={textColors[variant]}>
            {label}
          </Text>
        </>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
