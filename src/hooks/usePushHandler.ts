import { useEffect } from 'react';
import { router } from 'expo-router';
const messagingModule = require('@react-native-firebase/messaging');
const messaging: any = messagingModule.default ?? messagingModule;
import {
  registerDeviceToken,
  onTokenRefresh,
  requestPushPermission,
} from '@/firebase/push';

export function usePushHandler(uid: string | null) {
  useEffect(() => {
    if (!uid) return;
    let unsubRefresh: (() => void) | undefined;
    let unsubMessage: (() => void) | undefined;
    let unsubOpen: (() => void) | undefined;

    (async () => {
      const granted = await requestPushPermission();
      if (!granted) return;
      await registerDeviceToken(uid);
      unsubRefresh = onTokenRefresh(uid);

      // Foreground
      unsubMessage = messaging().onMessage(async (msg) => {
        const pokeId = msg.data?.pokeId;
        if (typeof pokeId === 'string') {
          // Foreground 토스트는 화면별로 표시. 자동 라우팅은 안 함.
        }
      });

      // Background → tap to open
      unsubOpen = messaging().onNotificationOpenedApp((msg) => {
        const pokeId = msg.data?.pokeId;
        if (typeof pokeId === 'string') {
          router.push({
            pathname: '/poke-received/[pokeId]',
            params: { pokeId },
          });
        }
      });

      // Cold start
      const initial = await messaging().getInitialNotification();
      const pokeId = initial?.data?.pokeId;
      if (typeof pokeId === 'string') {
        router.push({
          pathname: '/poke-received/[pokeId]',
          params: { pokeId },
        });
      }
    })();

    return () => {
      unsubRefresh?.();
      unsubMessage?.();
      unsubOpen?.();
    };
  }, [uid]);
}
