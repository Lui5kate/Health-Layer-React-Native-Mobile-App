import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

async function setupAndroidChannels() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync('water', {
    name: 'Recordatorios de agua',
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 250],
  });
  await Notifications.setNotificationChannelAsync('meals', {
    name: 'Recordatorios de comidas',
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 250],
  });
}

export async function scheduleWaterReminders() {
  await setupAndroidChannels();
  // Cada 2h de 8am a 10pm = horas 8,10,12,14,16,18,20,22
  const hours = [8, 10, 12, 14, 16, 18, 20, 22];
  for (const hour of hours) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '💧 ¡Hora de hidratarte!',
        body: 'Recuerda tomar agua para cumplir tu meta diaria.',
        ...(Platform.OS === 'android' ? { channelId: 'water' } : {}),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute: 0,
      },
    });
  }
}

export async function scheduleMealReminders() {
  await setupAndroidChannels();
  const meals = [
    { hour: 8, minute: 0, title: '🌅 ¡Buenos días!', body: 'Hora del desayuno. No olvides registrarlo.' },
    { hour: 14, minute: 0, title: '☀️ Hora de comer', body: 'Registra tu comida del día.' },
    { hour: 20, minute: 0, title: '🌙 Hora de cenar', body: 'No olvides tu cena y marcarla en la app.' },
  ];
  for (const meal of meals) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: meal.title,
        body: meal.body,
        ...(Platform.OS === 'android' ? { channelId: 'meals' } : {}),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: meal.hour,
        minute: meal.minute,
      },
    });
  }
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
