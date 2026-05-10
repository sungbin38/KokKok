import { useCallback, useState } from 'react';
import functions from '@react-native-firebase/functions';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { generateInviteCode } from '@/utils/inviteCode';

const TTL_HOURS = 24;

export function useCreateInviteCode() {
  const [code, setCode] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const create = useCallback(async () => {
    const user = auth().currentUser;
    if (!user) throw new Error('로그인이 필요해요');
    setCreating(true);
    try {
      // 충돌 확률 낮으니 단순 retry 3회
      for (let i = 0; i < 3; i++) {
        const candidate = generateInviteCode();
        const ref = firestore().collection('inviteCodes').doc(candidate);
        const snap = await ref.get();
        if (snap.exists) continue;
        const expiresAt = new Date(Date.now() + TTL_HOURS * 3600 * 1000);
        await ref.set({
          code: candidate,
          ownerUid: user.uid,
          expiresAt: firestore.Timestamp.fromDate(expiresAt),
          consumedBy: null,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
        setCode(candidate);
        return candidate;
      }
      throw new Error('초대 코드 생성에 실패했어요. 다시 시도해주세요');
    } finally {
      setCreating(false);
    }
  }, []);

  return { code, creating, create };
}

export function useRedeemInviteCode() {
  const [redeeming, setRedeeming] = useState(false);
  const redeem = useCallback(async (code: string) => {
    setRedeeming(true);
    try {
      const callable = functions().httpsCallable('redeemInvite');
      const result = await callable({ code });
      return result.data as { relId: string; ownerUid: string };
    } finally {
      setRedeeming(false);
    }
  }, []);
  return { redeem, redeeming };
}
