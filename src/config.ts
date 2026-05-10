import Constants from 'expo-constants';

// Firebase Console > 프로젝트 설정 > 일반 > 웹 SDK 구성에서 webClientId 복사
// app.json 의 extra 또는 EAS Secret 으로 주입.
export const GOOGLE_WEB_CLIENT_ID =
  (Constants.expoConfig?.extra?.googleWebClientId as string) ??
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ??
  '';
