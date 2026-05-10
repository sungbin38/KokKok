import { Platform } from 'react-native';
import type { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
const messagingModule = require('@react-native-firebase/messaging');
const messaging: any = messagingModule.default ?? messagingModule;
const firestoreModule = require('@react-native-firebase/firestore');
const firestore: any = firestoreModule.default ?? firestoreModule;

export async function requestPushPermission(): Promise<boolean> {
  const status = await messaging().requestPermission();
  return (
    status === messaging.AuthorizationStatus.AUTHORIZED ||
    status === messaging.AuthorizationStatus.PROVISIONAL
  );
}

export async function registerDeviceToken(uid: string): Promise<void> {
  if (Platform.OS === 'ios') {
    await messaging().registerDeviceForRemoteMessages();
  }
  const token = await messaging().getToken();
  if (!token) return;
  await firestore()
    .collection('users')
    .doc(uid)
    .update({
      fcmTokens: firestore.FieldValue.arrayUnion(token),
    });
}

export async function unregisterCurrentToken(uid: string): Promise<void> {
  const token = await messaging().getToken();
  if (!token) return;
  await firestore()
    .collection('users')
    .doc(uid)
    .update({
      fcmTokens: firestore.FieldValue.arrayRemove(token),
    });
}

export function onTokenRefresh(uid: string) {
  return messaging().onTokenRefresh(async (token) => {
    await firestore()
      .collection('users')
      .doc(uid)
      .update({
        fcmTokens: firestore.FieldValue.arrayUnion(token),
      });
  });
}

export type RemoteMessage = FirebaseMessagingTypes.RemoteMessage;
