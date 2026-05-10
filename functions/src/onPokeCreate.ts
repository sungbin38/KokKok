import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';
import { logger } from 'firebase-functions/v2';
import { getCopy } from './emojiCopy';

const PRUNE_INVALID_TOKEN_ERRORS = new Set([
  'messaging/invalid-registration-token',
  'messaging/registration-token-not-registered',
]);

export const onPokeCreate = onDocumentCreated('pokes/{pokeId}', async (event) => {
  const snap = event.data;
  if (!snap) return;
  const poke = snap.data() as {
    fromUid: string;
    toUid: string;
    relId: string;
    emojiId: string;
    replyToPokeId: string | null;
  };

  const db = admin.firestore();
  const [fromSnap, toSnap] = await Promise.all([
    db.collection('users').doc(poke.fromUid).get(),
    db.collection('users').doc(poke.toUid).get(),
  ]);
  const fromUser = fromSnap.data();
  const toUser = toSnap.data();
  if (!fromUser || !toUser) {
    logger.warn('user docs missing', { poke });
    return;
  }
  const tokens: string[] = Array.isArray(toUser.fcmTokens)
    ? toUser.fcmTokens
    : [];
  if (tokens.length === 0) {
    logger.info('no fcm tokens for recipient', { toUid: poke.toUid });
    return;
  }

  const fromName = fromUser.displayName ?? '누군가';
  const copy = getCopy(poke.emojiId);
  const title = `${copy.emoji} ${fromName}님이 콕!`;

  const messaging = admin.messaging();
  const response = await messaging.sendEachForMulticast({
    tokens,
    notification: {
      title,
      body: copy.body,
    },
    data: {
      pokeId: event.params.pokeId,
      emojiId: poke.emojiId,
      fromUid: poke.fromUid,
      relId: poke.relId,
      replyToPokeId: poke.replyToPokeId ?? '',
    },
    apns: {
      payload: {
        aps: {
          sound: 'default',
          'mutable-content': 1,
        },
      },
    },
    android: {
      priority: 'high',
      notification: {
        channelId: 'kok-default',
        sound: 'default',
      },
    },
  });

  // 만료된 토큰 정리
  const invalidTokens: string[] = [];
  response.responses.forEach((res, idx) => {
    if (!res.success && res.error) {
      const code = (res.error as any).code as string | undefined;
      if (code && PRUNE_INVALID_TOKEN_ERRORS.has(code)) {
        invalidTokens.push(tokens[idx]);
      } else {
        logger.warn('fcm send error', { code, tokenIdx: idx });
      }
    }
  });
  if (invalidTokens.length > 0) {
    await db
      .collection('users')
      .doc(poke.toUid)
      .update({
        fcmTokens: admin.firestore.FieldValue.arrayRemove(...invalidTokens),
      });
  }

  logger.info('poke push sent', {
    pokeId: event.params.pokeId,
    success: response.successCount,
    failure: response.failureCount,
  });
});
