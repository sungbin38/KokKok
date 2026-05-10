import { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { sendPoke } from '@/firebase/firestore';

interface SendPokeArgs {
  fromUid: string;
  toUid: string;
  relId: string;
  emojiId: string;
  replyToPokeId?: string | null;
}

export function useSendPoke() {
  const [pending, setPending] = useState(false);

  async function send(args: SendPokeArgs) {
    if (pending) return null;
    setPending(true);
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const id = await sendPoke(args);
      return id;
    } finally {
      setPending(false);
    }
  }

  return { send, pending };
}
