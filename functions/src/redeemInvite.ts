import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';

function relIdForPair(a: string, b: string): string {
  return [a, b].sort().join('_');
}

export const redeemInvite = onCall<{ code: string }>(
  { enforceAppCheck: false },
  async (request) => {
    const uid = request.auth?.uid;
    if (!uid) throw new HttpsError('unauthenticated', '로그인이 필요해요');

    const code = (request.data?.code ?? '').toString().trim().toUpperCase();
    if (!/^[A-Z0-9]{6}$/.test(code)) {
      throw new HttpsError('invalid-argument', '코드 형식이 올바르지 않아요');
    }

    const db = admin.firestore();
    const codeRef = db.collection('inviteCodes').doc(code);

    const result = await db.runTransaction(async (tx) => {
      const codeSnap = await tx.get(codeRef);
      if (!codeSnap.exists) {
        throw new HttpsError('not-found', '존재하지 않는 코드예요');
      }
      const codeData = codeSnap.data() as {
        ownerUid: string;
        expiresAt: admin.firestore.Timestamp;
        consumedBy: string | null;
      };
      if (codeData.consumedBy) {
        throw new HttpsError('failed-precondition', '이미 사용된 코드예요');
      }
      if (codeData.expiresAt.toMillis() < Date.now()) {
        throw new HttpsError('failed-precondition', '만료된 코드예요');
      }
      if (codeData.ownerUid === uid) {
        throw new HttpsError(
          'failed-precondition',
          '본인이 만든 코드는 사용할 수 없어요',
        );
      }

      const relId = relIdForPair(uid, codeData.ownerUid);
      const relRef = db.collection('relationships').doc(relId);
      const relSnap = await tx.get(relRef);

      if (!relSnap.exists) {
        // 양쪽 displayName 가져와서 nicknames 초기화
        const [aDoc, bDoc] = await Promise.all([
          tx.get(db.collection('users').doc(uid)),
          tx.get(db.collection('users').doc(codeData.ownerUid)),
        ]);
        const aName = (aDoc.data()?.displayName as string) ?? '익명';
        const bName = (bDoc.data()?.displayName as string) ?? '익명';
        const members: [string, string] = [uid, codeData.ownerUid].sort() as [
          string,
          string,
        ];
        tx.set(relRef, {
          id: relId,
          members,
          nicknames: {
            [uid]: bName, // 내가 부를 상대 닉네임 = 상대 이름
            [codeData.ownerUid]: aName,
          },
          lastPokeAt: null,
          lastPokeEmojiId: null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      tx.update(codeRef, {
        consumedBy: uid,
      });

      return { relId, ownerUid: codeData.ownerUid };
    });

    return result;
  },
);
