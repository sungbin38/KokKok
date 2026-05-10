import { Platform } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth, {
  FirebaseAuthTypes,
} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

let googleConfigured = false;

export function configureGoogleSignIn(webClientId: string) {
  if (googleConfigured) return;
  GoogleSignin.configure({ webClientId, offlineAccess: false });
  googleConfigured = true;
}

export async function signInWithApple(): Promise<FirebaseAuthTypes.User> {
  if (Platform.OS !== 'ios') {
    throw new Error('Apple 로그인은 iOS에서만 지원됩니다');
  }
  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });
  if (!credential.identityToken) {
    throw new Error('Apple 자격 증명을 받지 못했어요');
  }
  const appleCredential = auth.AppleAuthProvider.credential(
    credential.identityToken,
  );
  const userCredential = await auth().signInWithCredential(appleCredential);
  await ensureUserDoc(userCredential.user, 'apple', credential.fullName);
  return userCredential.user;
}

export async function signInWithGoogle(): Promise<FirebaseAuthTypes.User> {
  await GoogleSignin.hasPlayServices();
  const result = await GoogleSignin.signIn();
  // RNGoogleSignin v13: result.data.idToken
  const idToken =
    (result as any)?.data?.idToken ?? (result as any)?.idToken ?? null;
  if (!idToken) throw new Error('Google idToken을 받지 못했어요');
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  const userCredential = await auth().signInWithCredential(googleCredential);
  await ensureUserDoc(userCredential.user, 'google');
  return userCredential.user;
}

export async function signOut() {
  try {
    await GoogleSignin.signOut();
  } catch {
    // ignore
  }
  await auth().signOut();
}

async function ensureUserDoc(
  user: FirebaseAuthTypes.User,
  provider: 'apple' | 'google',
  appleName?: AppleAuthentication.AppleAuthenticationFullName | null,
) {
  const ref = firestore().collection('users').doc(user.uid);
  const snap = await ref.get();
  if (snap.exists) return;
  const displayName =
    user.displayName ||
    [appleName?.givenName, appleName?.familyName].filter(Boolean).join(' ') ||
    user.email?.split('@')[0] ||
    '익명';
  await ref.set({
    uid: user.uid,
    displayName,
    photoURL: user.photoURL ?? null,
    provider,
    fcmTokens: [],
    favoriteEmojis: [
      'heart',
      'thought-cloud',
      'lips',
      'burger',
      'sleeping',
      'pointing',
    ],
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
}
