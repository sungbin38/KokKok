// RNFB v22 + Hermes ESM/CJS default-export interop fix.
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
const firestoreModule = require('@react-native-firebase/firestore');
const firestore: any = firestoreModule.default ?? firestoreModule;
import { useEffect, useState } from 'react';
import {
  EmojiDoc,
  PokeDoc,
  RelationshipDoc,
  UserDoc,
} from './types';
import { isDemoMode } from '@/demo/demoMode';
import {
  DEMO_RELATIONSHIPS,
  DEMO_UID,
  DEMO_USER,
  addDemoPoke,
  demoHistory,
  demoPokesFor,
  findDemoPoke,
  updateDemoFavorites,
  useDemoVersion,
} from '@/demo/demoData';

const db = firestore();

const usersCol = () => db.collection('users');
const relationshipsCol = () => db.collection('relationships');
const pokesCol = () => db.collection('pokes');
const emojisCol = () => db.collection('emojis');

export function userDoc(uid: string) {
  return usersCol().doc(uid);
}

export function relationshipDoc(relId: string) {
  return relationshipsCol().doc(relId);
}

export async function sendPoke(input: {
  fromUid: string;
  toUid: string;
  relId: string;
  emojiId: string;
  replyToPokeId?: string | null;
}): Promise<string> {
  if (isDemoMode()) {
    // 데모: in-memory store 에 추가 → 구독자 re-render.
    return addDemoPoke(input);
  }
  const ref = await pokesCol().add({
    fromUid: input.fromUid,
    toUid: input.toUid,
    relId: input.relId,
    emojiId: input.emojiId,
    replyToPokeId: input.replyToPokeId ?? null,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
  await relationshipsCol().doc(input.relId).set(
    {
      lastPokeAt: firestore.FieldValue.serverTimestamp(),
      lastPokeEmojiId: input.emojiId,
    },
    { merge: true },
  );
  return ref.id;
}

export async function updateFavoriteEmojis(
  uid: string,
  favoriteEmojis: string[],
) {
  if (isDemoMode()) {
    updateDemoFavorites(favoriteEmojis);
    return;
  }
  await usersCol().doc(uid).update({ favoriteEmojis });
}

export function useUser(uid: string | null | undefined) {
  const [user, setUser] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const demoVersion = useDemoVersion();
  useEffect(() => {
    if (isDemoMode()) {
      // DEMO_USER 객체 자체는 같은 reference 지만 favoriteEmojis 가 갱신됐을 수
      // 있으므로 spread 로 새 reference 만들어 setState 트리거.
      setUser({ ...DEMO_USER });
      setLoading(false);
      return;
    }
    if (!uid) {
      setUser(null);
      setLoading(false);
      return;
    }
    const unsub = usersCol()
      .doc(uid)
      .onSnapshot((snap) => {
        setUser(snap.exists ? (snap.data() as UserDoc) : null);
        setLoading(false);
      });
    return unsub;
  }, [uid, demoVersion]);
  return { user, loading };
}

export function useRelationships(uid: string | null | undefined) {
  const [items, setItems] = useState<RelationshipDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const demoVersion = useDemoVersion();
  useEffect(() => {
    if (isDemoMode()) {
      // 최신 lastPokeAt 기준 정렬해서 새 array 로 set.
      const sorted = [...DEMO_RELATIONSHIPS].sort((a, b) => {
        const am = a.lastPokeAt?.toMillis() ?? 0;
        const bm = b.lastPokeAt?.toMillis() ?? 0;
        return bm - am;
      });
      setItems(sorted);
      setLoading(false);
      return;
    }
    if (!uid) {
      setItems([]);
      setLoading(false);
      return;
    }
    const unsub = relationshipsCol()
      .where('members', 'array-contains', uid)
      .orderBy('lastPokeAt', 'desc')
      .onSnapshot((snap) => {
        setItems(
          snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })),
        );
        setLoading(false);
      });
    return unsub;
  }, [uid, demoVersion]);
  return { items, loading };
}

export function usePokesForRelationship(
  relId: string | null,
  direction: 'sent' | 'received',
  uid: string | null,
) {
  const [items, setItems] = useState<PokeDoc[]>([]);
  const demoVersion = useDemoVersion();
  useEffect(() => {
    if (isDemoMode()) {
      if (!relId) {
        setItems([]);
        return;
      }
      setItems(demoPokesFor(relId, direction, DEMO_UID));
      return;
    }
    if (!relId || !uid) return;
    const field = direction === 'sent' ? 'fromUid' : 'toUid';
    const unsub = pokesCol()
      .where('relId', '==', relId)
      .where(field, '==', uid)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .onSnapshot((snap) => {
        setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
      });
    return unsub;
  }, [relId, direction, uid, demoVersion]);
  return items;
}

export function useHistory(
  uid: string | null,
  direction: 'sent' | 'received',
) {
  const [items, setItems] = useState<PokeDoc[]>([]);
  const demoVersion = useDemoVersion();
  useEffect(() => {
    if (isDemoMode()) {
      setItems(demoHistory(direction, DEMO_UID));
      return;
    }
    if (!uid) return;
    const field = direction === 'sent' ? 'fromUid' : 'toUid';
    const unsub = pokesCol()
      .where(field, '==', uid)
      .orderBy('createdAt', 'desc')
      .limit(100)
      .onSnapshot((snap) => {
        setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
      });
    return unsub;
  }, [uid, direction, demoVersion]);
  return items;
}

export async function getPoke(pokeId: string): Promise<PokeDoc | null> {
  if (isDemoMode()) return findDemoPoke(pokeId);
  const snap = await pokesCol().doc(pokeId).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...(snap.data() as any) } as PokeDoc;
}

export async function listEmojiCatalog(): Promise<EmojiDoc[]> {
  const snap = await emojisCol().orderBy('order').get();
  return snap.docs.map(
    (d: FirebaseFirestoreTypes.QueryDocumentSnapshot) =>
      ({ id: d.id, ...(d.data() as any) }) as EmojiDoc,
  );
}
