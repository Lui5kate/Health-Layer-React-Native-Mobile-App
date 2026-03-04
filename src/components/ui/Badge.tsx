import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'default';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const variantColors: Record<BadgeVariant, { bg: string; text: string }> = {
  success: { bg: '#E8F8ED', text: '#5BAD6F' },
  warning: { bg: '#FFF6E0', text: '#E8A838' },
  error: { bg: '#FFE8E8', text: '#E05C5C' },
  info: { bg: '#E8F2FB', text: '#6BA8D4' },
  default: { bg: '#F0EBE0', text: '#8A8272' },
};

export function Badge({ label, variant = 'default' }: BadgeProps) {
  const { bg, text } = variantColors[variant];
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text variant="caption" weight="semiBold" style={{ color: text }}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
});
