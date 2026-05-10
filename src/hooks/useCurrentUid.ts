import { useDemoMode } from '@/demo/demoMode';
import { DEMO_UID } from '@/demo/demoData';

const authModule = require('@react-native-firebase/auth');
const auth: any = authModule.default ?? authModule;

export function useCurrentUid(): string | null {
  const isDemo = useDemoMode();
  if (isDemo) return DEMO_UID;
  return auth().currentUser?.uid ?? null;
}
