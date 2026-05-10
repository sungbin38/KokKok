import { useEffect, useState } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

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
