import { useEffect, useState } from 'react';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
const authModule = require('@react-native-firebase/auth');
const auth: any = authModule.default ?? authModule;

export function useAuthState() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(
    auth().currentUser,
  );
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsub = auth().onAuthStateChanged((u) => {
      setUser(u);
      if (initializing) setInitializing(false);
    });
    return unsub;
  }, [initializing]);

  return { user, initializing };
}
