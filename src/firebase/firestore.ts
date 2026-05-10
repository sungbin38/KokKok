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
  await usersCol().doc(uid).update({ favoriteEmojis });
}

export function useUser(uid: string | null | undefined) {
  const [user, setUser] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
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
  }, [uid]);
  return { user, loading };
}

export function useRelationships(uid: string | null | undefined) {
  const [items, setItems] = useState<RelationshipDoc[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
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
  }, [uid]);
  return { items, loading };
}

export function usePokesForRelationship(
  relId: string | null,
  direction: 'sent' | 'received',
  uid: string | null,
) {
  const [items, setItems] = useState<PokeDoc[]>([]);
  useEffect(() => {
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
  }, [relId, direction, uid]);
  return items;
}

export function useHistory(
  uid: string | null,
  direction: 'sent' | 'received',
) {
  const [items, setItems] = useState<PokeDoc[]>([]);
  useEffect(() => {
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
  }, [uid, direction]);
  return items;
}

export async function getPoke(pokeId: string): Promise<PokeDoc | null> {
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
