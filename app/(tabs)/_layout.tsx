import { Tabs } from 'expo-router';
import { Text } from 'react-native';
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
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 22 }}>🏠</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: '히스토리',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 22 }}>💬</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: '나',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 22 }}>🙂</Text>
          ),
        }}
      />
    </Tabs>
  );
}
