import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import type { PokeDoc, RelationshipDoc, UserDoc } from '@/firebase/types';

export const DEMO_UID = 'demo-user';

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

function ts(offsetFromNowMs: number): FirebaseFirestoreTypes.Timestamp {
  const ms = Date.now() - offsetFromNowMs;
  return {
    toMillis: () => ms,
    toDate: () => new Date(ms),
    seconds: Math.floor(ms / 1000),
    nanoseconds: (ms % 1000) * 1_000_000,
    isEqual: (other: any) => other?.toMillis?.() === ms,
    valueOf: () => `${ms}`,
  } as unknown as FirebaseFirestoreTypes.Timestamp;
}

export const DEMO_USER: UserDoc = {
  uid: DEMO_UID,
  displayName: '데모',
  photoURL: null,
  provider: 'google',
  fcmTokens: [],
  favoriteEmojis: [
    'heart',
    'thought-cloud',
    'lips',
    'burger',
    'sleeping',
    'pointing',
  ],
  createdAt: ts(7 * DAY),
};

// nicknames[localUid] = "내가 상대를 부르는 이름" (홈에서 표시되는 친구 이름).
// nicknames[remoteUid] = "상대가 나를 부르는 이름" — 데모에서는 '나' 로 통일.
// uid 가 null 일 때를 위해 '' 키도 같은 값으로 등록.
function nicks(remoteUid: string, remoteNick: string) {
  return {
    '': remoteNick,
    [DEMO_UID]: remoteNick,
    [remoteUid]: '나',
  };
}

export const DEMO_RELATIONSHIPS: RelationshipDoc[] = [
  {
    id: 'rel-mom',
    members: [DEMO_UID, 'partner-mom'],
    nicknames: nicks('partner-mom', '엄마'),
    lastPokeAt: ts(7 * MIN),
    lastPokeEmojiId: 'heart',
    createdAt: ts(60 * DAY),
  },
  {
    id: 'rel-love',
    members: [DEMO_UID, 'partner-love'],
    nicknames: nicks('partner-love', '연인'),
    lastPokeAt: ts(2 * HOUR),
    lastPokeEmojiId: 'lips',
    createdAt: ts(40 * DAY),
  },
  {
    id: 'rel-friend',
    members: [DEMO_UID, 'partner-friend'],
    nicknames: nicks('partner-friend', '단짝'),
    lastPokeAt: ts(1 * DAY),
    lastPokeEmojiId: 'thumbs-up',
    createdAt: ts(20 * DAY),
  },
  {
    id: 'rel-bro',
    members: [DEMO_UID, 'partner-bro'],
    nicknames: nicks('partner-bro', '동생'),
    lastPokeAt: ts(3 * DAY),
    lastPokeEmojiId: 'burger',
    createdAt: ts(15 * DAY),
  },
];

export const DEMO_POKES: PokeDoc[] = [
  // rel-mom — 가장 최근 = partner-mom 보냄 (콕 받음)
  {
    id: 'p-mom-1',
    fromUid: 'partner-mom',
    toUid: DEMO_UID,
    relId: 'rel-mom',
    emojiId: 'heart',
    replyToPokeId: null,
    createdAt: ts(7 * MIN),
  },
  {
    id: 'p-mom-2',
    fromUid: DEMO_UID,
    toUid: 'partner-mom',
    relId: 'rel-mom',
    emojiId: 'wave',
    replyToPokeId: null,
    createdAt: ts(40 * MIN),
  },
  {
    id: 'p-mom-3',
    fromUid: 'partner-mom',
    toUid: DEMO_UID,
    relId: 'rel-mom',
    emojiId: 'pleading',
    replyToPokeId: null,
    createdAt: ts(6 * HOUR),
  },

  // rel-love — 가장 최근 = partner-love 보냄 (콕 받음)
  {
    id: 'p-love-1',
    fromUid: 'partner-love',
    toUid: DEMO_UID,
    relId: 'rel-love',
    emojiId: 'lips',
    replyToPokeId: null,
    createdAt: ts(2 * HOUR),
  },
  {
    id: 'p-love-2',
    fromUid: DEMO_UID,
    toUid: 'partner-love',
    relId: 'rel-love',
    emojiId: 'sparkle-heart',
    replyToPokeId: null,
    createdAt: ts(3 * HOUR),
  },
  {
    id: 'p-love-3',
    fromUid: 'partner-love',
    toUid: DEMO_UID,
    relId: 'rel-love',
    emojiId: 'hug',
    replyToPokeId: null,
    createdAt: ts(20 * HOUR),
  },

  // rel-friend — 가장 최근 = 내가 보냄 (마지막 콕)
  {
    id: 'p-friend-1',
    fromUid: DEMO_UID,
    toUid: 'partner-friend',
    relId: 'rel-friend',
    emojiId: 'thumbs-up',
    replyToPokeId: null,
    createdAt: ts(1 * DAY),
  },
  {
    id: 'p-friend-2',
    fromUid: 'partner-friend',
    toUid: DEMO_UID,
    relId: 'rel-friend',
    emojiId: 'crying-laugh',
    replyToPokeId: null,
    createdAt: ts(2 * DAY),
  },

  // rel-bro — 가장 최근 = 내가 보냄 (마지막 콕)
  {
    id: 'p-bro-1',
    fromUid: DEMO_UID,
    toUid: 'partner-bro',
    relId: 'rel-bro',
    emojiId: 'burger',
    replyToPokeId: null,
    createdAt: ts(3 * DAY),
  },
];

// 데모 시연용 보조 상태.
const DEMO_UNREAD_REL_IDS = new Set<string>(['rel-mom', 'rel-love']);
const DEMO_FAVORITE_REL_IDS = new Set<string>(['rel-mom']);

export function isDemoUnread(relId: string): boolean {
  return DEMO_UNREAD_REL_IDS.has(relId);
}

export function isDemoFavorite(relId: string): boolean {
  return DEMO_FAVORITE_REL_IDS.has(relId);
}

export function demoLastPokeReceived(relId: string): boolean {
  const last = DEMO_POKES.filter((p) => p.relId === relId).sort(
    (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis(),
  )[0];
  return last ? last.toUid === DEMO_UID : false;
}

export function findDemoPoke(pokeId: string): PokeDoc | null {
  return DEMO_POKES.find((p) => p.id === pokeId) ?? null;
}

// 데모: 안 읽은 콕 중 가장 최근 받은 poke 1개. 시연용 진입점에 사용.
export function demoLatestUnreadReceivedPoke(): PokeDoc | null {
  const candidates = DEMO_POKES.filter(
    (p) => DEMO_UNREAD_REL_IDS.has(p.relId) && p.toUid === DEMO_UID,
  ).sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
  return candidates[0] ?? null;
}

export function demoPokesFor(
  relId: string,
  direction: 'sent' | 'received',
  selfUid: string,
): PokeDoc[] {
  const field = direction === 'sent' ? 'fromUid' : 'toUid';
  return DEMO_POKES.filter(
    (p) => p.relId === relId && p[field] === selfUid,
  ).sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
}

export function demoHistory(
  direction: 'sent' | 'received',
  selfUid: string,
): PokeDoc[] {
  const field = direction === 'sent' ? 'fromUid' : 'toUid';
  return DEMO_POKES.filter((p) => p[field] === selfUid).sort(
    (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis(),
  );
}
