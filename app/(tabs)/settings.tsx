import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Switch, Alert, Image } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

import { useTheme } from '@/hooks/useTheme';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useUserStore } from '@/store/userStore';
import { useThemeStore, type ThemeMode } from '@/store/themeStore';
import { useWaterStore } from '@/store/waterStore';
import { useStepsStore } from '@/store/stepsStore';
import { Spacing, Radius } from '@/theme';
import {
  requestNotificationPermissions,
  scheduleWaterReminders,
  scheduleMealReminders,
  cancelAllNotifications,
} from '@/utils/notifications';

function SettingRow({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.settingRow, { borderBottomColor: colors.borderLight }]}>
      <View style={{ flex: 1 }}>
        <Text variant="body" weight="medium">{label}</Text>
        {hint && <Text variant="caption" color="secondary">{hint}</Text>}
      </View>
      {children}
    </View>
  );
}

export default function SettingsScreen() {
  const { colors, isDark } = useTheme();
  const { mode, setMode } = useThemeStore();
  const profile = useUserStore((s) => s.profile);
  const updateProfile = useUserStore((s) => s.updateProfile);
  const resetUser = useUserStore((s) => s.reset);
  const waterStore = useWaterStore();
  const stepsStore = useStepsStore();

  const [nickname, setNickname] = useState(profile?.nickname ?? '');
  const [heightCm, setHeightCm] = useState(String(profile?.heightCm ?? ''));
  const [waterGoal, setWaterGoal] = useState(String(waterStore.goalMl / 1000));
  const [stepsGoal, setStepsGoal] = useState(String(stepsStore.goal));
  const [saved, setSaved] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(profile?.notificationsEnabled ?? false);

  const handleSave = () => {
    if (nickname.trim()) updateProfile({ nickname: nickname.trim() });
    const h = parseFloat(heightCm.replace(',', '.'));
    if (!isNaN(h) && h > 0) updateProfile({ heightCm: h });
    const wl = parseFloat(waterGoal.replace(',', '.'));
    if (!isNaN(wl) && wl > 0) waterStore.setGoal(Math.round(wl * 1000));
    const sl = parseInt(stepsGoal);
    if (!isNaN(sl) && sl > 0) {
      stepsStore.setGoal(sl);
      updateProfile({ dailyStepsGoal: sl });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    Alert.alert(
      'Borrar datos',
      '¿Estás seguro? Esto borrará tu perfil y tendrás que hacer el onboarding de nuevo.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar', style: 'destructive',
          onPress: () => { resetUser(); router.replace('/(onboarding)/welcome'); },
        },
      ]
    );
  };

  const handlePickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería para cambiar la foto.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      updateProfile({ avatarUri: result.assets[0].uri });
    }
  };

  const handleToggleNotifications = async (value: boolean) => {
    if (value) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        Alert.alert('Permisos denegados', 'Activa las notificaciones desde la configuración del sistema.');
        return;
      }
      await scheduleWaterReminders();
      await scheduleMealReminders();
    } else {
      await cancelAllNotifications();
    }
    setNotifEnabled(value);
    updateProfile({ notificationsEnabled: value });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <Animated.View entering={FadeInDown.delay(50).duration(500)}>
          <Text variant="h3" weight="bold">Ajustes</Text>
        </Animated.View>

        {/* Perfil */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <Card shadow="md" padding={Spacing.base}>
            {/* Avatar */}
            <View style={styles.profileTop}>
              <Pressable onPress={handlePickAvatar} style={styles.avatarWrapper}>
                {profile?.avatarUri ? (
                  <Image source={{ uri: profile.avatarUri }} style={styles.avatarImage} />
                ) : (
                  <View style={[styles.avatar, { backgroundColor: colors.primary + '25' }]}>
                    <Text style={{ fontSize: 36 }}>
                      {profile?.gender === 'female' ? '👩' : profile?.gender === 'male' ? '👨' : '🙂'}
                    </Text>
                  </View>
                )}
                <View style={[styles.avatarOverlay, { backgroundColor: 'rgba(0,0,0,0.35)' }]}>
                  <Text style={{ fontSize: 14 }}>📷</Text>
                </View>
              </Pressable>
              <View>
                <Text variant="h4" weight="bold">{profile?.name}</Text>
                <Text variant="bodySmall" color="secondary">
                  Miembro desde {profile?.createdAt?.split('T')[0] ?? 'hoy'}
                </Text>
                <Pressable onPress={handlePickAvatar}>
                  <Text variant="caption" style={{ color: colors.primary, marginTop: 2 }}>
                    Cambiar foto
                  </Text>
                </Pressable>
              </View>
            </View>

            <Text variant="label" weight="semiBold" color="secondary"
              style={{ marginTop: Spacing.base, marginBottom: Spacing.md, letterSpacing: 0.5 }}>
              PERFIL
            </Text>

            <View style={{ gap: Spacing.md }}>
              <Input label="Tu apodo" value={nickname} onChangeText={setNickname}
                placeholder="Como quieres que te llamemos" autoCapitalize="words" />
              <Input label="Altura (cm)" value={heightCm} onChangeText={setHeightCm}
                keyboardType="decimal-pad" placeholder="Ej. 165"
                rightIcon={<Text variant="caption" color="tertiary">cm</Text>} />
            </View>
          </Card>
        </Animated.View>

        {/* Metas */}
        <Animated.View entering={FadeInDown.delay(150).duration(500)}>
          <Card shadow="md" padding={Spacing.base}>
            <Text variant="label" weight="semiBold" color="secondary"
              style={{ marginBottom: Spacing.md, letterSpacing: 0.5 }}>
              METAS DIARIAS
            </Text>
            <View style={{ gap: Spacing.md }}>
              <Input label="Meta de agua (litros)" value={waterGoal} onChangeText={setWaterGoal}
                keyboardType="decimal-pad" placeholder="Ej. 2.0"
                rightIcon={<Text variant="caption" color="tertiary">L</Text>} />
              <Input label="Meta de pasos" value={stepsGoal} onChangeText={setStepsGoal}
                keyboardType="number-pad" placeholder="Ej. 8000"
                rightIcon={<Text variant="caption" color="tertiary">pasos</Text>} />
            </View>
          </Card>
        </Animated.View>

        {/* Notificaciones */}
        <Animated.View entering={FadeInDown.delay(175).duration(500)}>
          <Card shadow="md" padding={Spacing.base}>
            <Text variant="label" weight="semiBold" color="secondary"
              style={{ marginBottom: Spacing.md, letterSpacing: 0.5 }}>
              NOTIFICACIONES
            </Text>
            <SettingRow
              label="Recordatorios"
              hint="Agua cada 2h · Comidas (8am, 2pm, 8pm)">
              <Switch
                value={notifEnabled}
                onValueChange={handleToggleNotifications}
                trackColor={{ false: colors.border, true: colors.primary + '80' }}
                thumbColor={notifEnabled ? colors.primary : colors.textTertiary}
              />
            </SettingRow>
          </Card>
        </Animated.View>

        {/* Apariencia */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <Card shadow="md" padding={Spacing.base}>
            <Text variant="label" weight="semiBold" color="secondary"
              style={{ marginBottom: Spacing.md, letterSpacing: 0.5 }}>
              APARIENCIA
            </Text>

            {[
              { value: 'light' as ThemeMode, label: 'Claro', icon: '☀️', desc: 'Tema predeterminado' },
              { value: 'dark' as ThemeMode, label: 'Oscuro', icon: '🌙', desc: 'Para usar de noche' },
              { value: 'system' as ThemeMode, label: 'Sistema', icon: '📱', desc: 'Sigue tu teléfono' },
            ].map((opt) => (
              <Pressable key={opt.value} onPress={() => setMode(opt.value)}
                style={[styles.themeOption, {
                  backgroundColor: mode === opt.value ? colors.primary + '15' : colors.surface,
                  borderColor: mode === opt.value ? colors.primary : colors.border,
                  borderWidth: mode === opt.value ? 1.5 : 1,
                }]}>
                <Text style={{ fontSize: 20 }}>{opt.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text variant="body" weight={mode === opt.value ? 'semiBold' : 'regular'}>{opt.label}</Text>
                  <Text variant="caption" color="secondary">{opt.desc}</Text>
                </View>
                {mode === opt.value && (
                  <View style={[styles.selectedDot, { backgroundColor: colors.primary }]} />
                )}
              </Pressable>
            ))}
          </Card>
        </Animated.View>

        {/* Guardar */}
        <Animated.View entering={FadeInDown.delay(250).duration(500)}>
          <Button
            label={saved ? '✓ Guardado' : 'Guardar cambios'}
            onPress={handleSave}
            size="lg"
            fullWidth
          />
        </Animated.View>

        {/* Zona peligrosa */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <Card shadow="none" padding={Spacing.base}
            style={[{ borderColor: colors.error + '30', borderWidth: 1, backgroundColor: colors.error + '08' }]}>
            <Text variant="label" weight="semiBold" style={{ color: colors.error, marginBottom: Spacing.sm }}>
              Zona de peligro
            </Text>
            <Text variant="caption" color="secondary" style={{ marginBottom: Spacing.md }}>
              Esto borrará todos tus datos y tendrás que configurar la app de nuevo.
            </Text>
            <Button label="Resetear app" variant="danger" onPress={handleReset} size="sm" />
          </Card>
        </Animated.View>

        {/* Version */}
        <Text variant="caption" color="tertiary" style={{ textAlign: 'center' }}>
          Health Layer v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: Spacing.base, paddingTop: Spacing.base, paddingBottom: 120, gap: Spacing.base },
  profileTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.base, marginBottom: Spacing.base },
  avatarWrapper: { width: 72, height: 72, borderRadius: 36, overflow: 'hidden', position: 'relative' },
  avatarImage: { width: 72, height: 72, borderRadius: 36 },
  avatar: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  avatarOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 24,
    alignItems: 'center', justifyContent: 'center',
  },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, borderBottomWidth: 1 },
  themeOption: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.md, borderRadius: Radius.lg, marginBottom: Spacing.sm },
  selectedDot: { width: 10, height: 10, borderRadius: 5 },
});
