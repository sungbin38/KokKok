import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';
import '../global.css';

import { useAuthState } from '@/firebase/auth-state';
import { configureGoogleSignIn } from '@/firebase/auth';
import { usePushHandler } from '@/hooks/usePushHandler';
import { GOOGLE_WEB_CLIENT_ID } from '@/config';

export default function RootLayout() {
  configureGoogleSignIn(GOOGLE_WEB_CLIENT_ID);
  const { user, initializing } = useAuthState();
  const segments = useSegments();
  const router = useRouter();
  usePushHandler(user?.uid ?? null);

  useEffect(() => {
    if (initializing) return;
    const inAuthFlow = segments[0] === '(auth)';
    if (!user && !inAuthFlow) {
      router.replace('/(auth)/onboarding');
    } else if (user && inAuthFlow) {
      router.replace('/(tabs)/home');
    }
  }, [user, initializing, segments, router]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)/onboarding" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="poke/[relId]/index" />
          <Stack.Screen name="poke/[relId]/picker" options={{ presentation: 'modal' }} />
          <Stack.Screen name="invite" options={{ presentation: 'modal' }} />
          <Stack.Screen
            name="poke-received/[pokeId]"
            options={{ presentation: 'transparentModal', animation: 'fade' }}
          />
        </Stack>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
