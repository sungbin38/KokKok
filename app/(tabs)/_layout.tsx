import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.red,
        tabBarInactiveTintColor: colors.inkMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: -0.1,
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.hairline,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: '홈',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: '히스토리',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'time' : 'time-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: '나',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person-circle' : 'person-circle-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
