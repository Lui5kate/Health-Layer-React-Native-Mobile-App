import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography } from '@/theme';
import { useThemeStore } from '@/store/themeStore';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

function TabIcon({
  name, focused, color,
}: { name: IoniconName; focused: boolean; color: string }) {
  return <Ionicons name={focused ? name : `${name}-outline` as IoniconName} size={22} color={color} />;
}

export default function TabsLayout() {
  const systemScheme = useColorScheme();
  const { mode } = useThemeStore();
  const isDark = mode === 'dark' ? true : mode === 'light' ? false : systemScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 1,
          height: 82,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarLabelStyle: {
          fontFamily: Typography.fontFamily.medium,
          fontSize: Typography.size.xs,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen name="index" options={{
        title: 'Inicio',
        tabBarIcon: ({ color, focused }) => <TabIcon name="home" focused={focused} color={color} />,
      }} />
      <Tabs.Screen name="meals" options={{
        title: 'Comidas',
        tabBarIcon: ({ color, focused }) => <TabIcon name="restaurant" focused={focused} color={color} />,
      }} />
      <Tabs.Screen name="workout" options={{
        title: 'Ejercicio',
        tabBarIcon: ({ color, focused }) => <TabIcon name="barbell" focused={focused} color={color} />,
      }} />
      <Tabs.Screen name="analytics" options={{
        title: 'Analíticos',
        tabBarIcon: ({ color, focused }) => <TabIcon name="stats-chart" focused={focused} color={color} />,
      }} />
      <Tabs.Screen name="progress" options={{
        title: 'Progreso',
        tabBarIcon: ({ color, focused }) => <TabIcon name="trending-up" focused={focused} color={color} />,
      }} />
      <Tabs.Screen name="settings" options={{
        title: 'Ajustes',
        tabBarIcon: ({ color, focused }) => <TabIcon name="settings" focused={focused} color={color} />,
      }} />
    </Tabs>
  );
}
