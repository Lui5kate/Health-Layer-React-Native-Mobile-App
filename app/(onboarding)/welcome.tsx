import React from 'react';
import { View, StyleSheet, Dimensions, Pressable } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  FadeInDown,
  FadeIn,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Spacing } from '@/theme';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const { colors, isDark } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Decoración visual - círculos orgánicos */}
      <Animated.View
        entering={FadeIn.duration(800)}
        style={[
          styles.circle1,
          { backgroundColor: colors.primaryLight + '30' },
        ]}
      />
      <Animated.View
        entering={FadeIn.delay(200).duration(800)}
        style={[
          styles.circle2,
          { backgroundColor: colors.accent + '25' },
        ]}
      />

      <View style={styles.content}>
        {/* Logo / icono */}
        <Animated.View entering={FadeInDown.delay(100).duration(700)} style={styles.logoContainer}>
          <View style={[styles.logoCircle, { backgroundColor: colors.primary }]}>
            <Text style={styles.logoEmoji}>🌿</Text>
          </View>
        </Animated.View>

        {/* Título */}
        <Animated.View entering={FadeInDown.delay(250).duration(700)} style={styles.textContainer}>
          <Text variant="h1" weight="bold" style={[styles.title, { color: colors.text }]}>
            Health Layer
          </Text>
          <Text
            variant="body"
            color="secondary"
            style={styles.subtitle}
          >
            Tu compañera de bienestar personal.{'\n'}
            Seguimiento de nutrición, ejercicio y hábitos saludables.
          </Text>
        </Animated.View>

        {/* Features preview */}
        <Animated.View entering={FadeInDown.delay(400).duration(700)} style={styles.features}>
          {[
            { icon: '🥗', text: 'Plan nutricional personalizado' },
            { icon: '💪', text: 'Seguimiento de entrenamiento' },
            { icon: '💧', text: 'Control de hidratación' },
            { icon: '📊', text: 'Progreso visual y motivador' },
          ].map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={[styles.featureIcon, { backgroundColor: colors.primaryLight + '20' }]}>
                <Text style={{ fontSize: 18 }}>{f.icon}</Text>
              </View>
              <Text variant="bodySmall" color="secondary" style={{ flex: 1 }}>
                {f.text}
              </Text>
            </View>
          ))}
        </Animated.View>
      </View>

      {/* CTA */}
      <Animated.View entering={FadeInDown.delay(600).duration(700)} style={styles.footer}>
        <Button
          label="Comenzar mi viaje 🌱"
          onPress={() => router.push('/(onboarding)/setup')}
          size="lg"
          fullWidth
        />
        <Text variant="caption" color="tertiary" style={styles.disclaimer}>
          Solo tú verás tu información. Todo es privado.
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  circle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    top: -80,
    right: -60,
  },
  circle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    bottom: 100,
    left: -60,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing['4xl'],
    gap: Spacing['2xl'],
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: {
    fontSize: 40,
  },
  textContainer: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  title: {
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 24,
  },
  features: {
    gap: Spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing['2xl'],
    gap: Spacing.md,
    alignItems: 'center',
  },
  disclaimer: {
    textAlign: 'center',
  },
});
