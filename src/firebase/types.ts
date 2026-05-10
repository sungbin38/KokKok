import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export type Timestamp = FirebaseFirestoreTypes.Timestamp;

export interface UserDoc {
  uid: string;
  displayName: string;
  photoURL: string | null;
  provider: 'apple' | 'google';
  fcmTokens: string[];
  favoriteEmojis: string[];
  createdAt: Timestamp;
}

export interface RelationshipDoc {
  id: string;
  members: [string, string];
  nicknames: Record<string, string>;
  lastPokeAt: Timestamp | null;
  lastPokeEmojiId: string | null;
  createdAt: Timestamp;
}

export interface InviteCodeDoc {
  code: string;
  ownerUid: string;
  expiresAt: Timestamp;
  consumedBy: string | null;
  createdAt: Timestamp;
}

export interface PokeDoc {
  id: string;
  fromUid: string;
  toUid: string;
  relId: string;
  emojiId: string;
  replyToPokeId: string | null;
  createdAt: Timestamp;
}

export interface EmojiDoc {
  id: string;
  name: string;
  category: '감정' | '음식' | '동작' | '사물' | '동물';
  assetKey: string;
  order: number;
}
