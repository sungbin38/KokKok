import type { ImageSourcePropType } from 'react-native';

export type EmojiCategory =
  | '감정'
  | '음식'
  | '동작'
  | '사물'
  | '동물';

export interface EmojiEntry {
  id: string;
  name: string;
  category: EmojiCategory;
  /** 화면에 그릴 때 fallback으로 사용할 유니코드 글리프. 3D 에셋이 도착하면 image로 대체. */
  fallback: string;
  /** Microsoft Fluent Emoji 3D PNG 256px. assets/emojis/<id>.png. */
  asset?: ImageSourcePropType;
}

// MVP 카탈로그 — 실제 PNG는 추후 assets/emojis/ 에 채워 넣음.
// id는 안정적인 슬러그. 추가/삭제 시 Firestore emojis 컬렉션도 동기화 필요.
export const EMOJI_CATALOG: EmojiEntry[] = [
  // 감정 (20)
  { id: 'heart', name: '하트', category: '감정', fallback: '❤️' },
  { id: 'heart-eyes', name: '하트 눈', category: '감정', fallback: '😍' },
  { id: 'kiss', name: '키스', category: '감정', fallback: '😘' },
  { id: 'lips', name: '립스', category: '감정', fallback: '💋' },
  { id: 'smile', name: '미소', category: '감정', fallback: '😊' },
  { id: 'laugh', name: '웃음', category: '감정', fallback: '😆' },
  { id: 'crying-laugh', name: '눈물 웃음', category: '감정', fallback: '😂' },
  { id: 'wink', name: '윙크', category: '감정', fallback: '😉' },
  { id: 'sleeping', name: '잠든 얼굴', category: '감정', fallback: '😴' },
  { id: 'tired', name: '지친 얼굴', category: '감정', fallback: '😩' },
  { id: 'crying', name: '울음', category: '감정', fallback: '😢' },
  { id: 'pouting', name: '뾰루퉁', category: '감정', fallback: '😡' },
  { id: 'shocked', name: '놀람', category: '감정', fallback: '😮' },
  { id: 'thinking', name: '생각', category: '감정', fallback: '🤔' },
  { id: 'thought-cloud', name: '생각 구름', category: '감정', fallback: '💭' },
  { id: 'sparkle-heart', name: '반짝 하트', category: '감정', fallback: '💖' },
  { id: 'broken-heart', name: '깨진 하트', category: '감정', fallback: '💔' },
  { id: 'fire-heart', name: '불꽃 하트', category: '감정', fallback: '❤️‍🔥' },
  { id: 'star-eyes', name: '별 눈', category: '감정', fallback: '🤩' },
  { id: 'pleading', name: '애원', category: '감정', fallback: '🥺' },

  // 동작 (15)
  { id: 'pointing', name: '손가락', category: '동작', fallback: '☝️' },
  { id: 'wave', name: '인사', category: '동작', fallback: '👋' },
  { id: 'clap', name: '박수', category: '동작', fallback: '👏' },
  { id: 'thumbs-up', name: '엄지척', category: '동작', fallback: '👍' },
  { id: 'ok-hand', name: '오케이', category: '동작', fallback: '👌' },
  { id: 'pray', name: '두 손 모아', category: '동작', fallback: '🙏' },
  { id: 'hug', name: '포옹', category: '동작', fallback: '🤗' },
  { id: 'high-five', name: '하이파이브', category: '동작', fallback: '🙌' },
  { id: 'come-here', name: '이리와', category: '동작', fallback: '🫴' },
  { id: 'pinch', name: '꼬집기', category: '동작', fallback: '🤏' },
  { id: 'flex', name: '근육', category: '동작', fallback: '💪' },
  { id: 'crossed-fingers', name: '행운', category: '동작', fallback: '🤞' },
  { id: 'peace', name: '평화', category: '동작', fallback: '✌️' },
  { id: 'rock-on', name: '록온', category: '동작', fallback: '🤘' },
  { id: 'shaka', name: '샤카', category: '동작', fallback: '🤙' },

  // 음식 (12)
  { id: 'burger', name: '버거', category: '음식', fallback: '🍔' },
  { id: 'pizza', name: '피자', category: '음식', fallback: '🍕' },
  { id: 'ramen', name: '라멘', category: '음식', fallback: '🍜' },
  { id: 'rice', name: '밥', category: '음식', fallback: '🍚' },
  { id: 'tteokbokki', name: '떡볶이', category: '음식', fallback: '🌶️' },
  { id: 'coffee', name: '커피', category: '음식', fallback: '☕' },
  { id: 'beer', name: '맥주', category: '음식', fallback: '🍺' },
  { id: 'cake', name: '케이크', category: '음식', fallback: '🍰' },
  { id: 'icecream', name: '아이스크림', category: '음식', fallback: '🍦' },
  { id: 'strawberry', name: '딸기', category: '음식', fallback: '🍓' },
  { id: 'apple', name: '사과', category: '음식', fallback: '🍎' },
  { id: 'cookie', name: '쿠키', category: '음식', fallback: '🍪' },

  // 사물 (12)
  { id: 'gift', name: '선물', category: '사물', fallback: '🎁' },
  { id: 'flower', name: '꽃', category: '사물', fallback: '🌷' },
  { id: 'rose', name: '장미', category: '사물', fallback: '🌹' },
  { id: 'balloon', name: '풍선', category: '사물', fallback: '🎈' },
  { id: 'cake-bday', name: '생일 케이크', category: '사물', fallback: '🎂' },
  { id: 'sparkles', name: '반짝', category: '사물', fallback: '✨' },
  { id: 'star', name: '별', category: '사물', fallback: '⭐' },
  { id: 'moon', name: '달', category: '사물', fallback: '🌙' },
  { id: 'sun', name: '태양', category: '사물', fallback: '☀️' },
  { id: 'rainbow', name: '무지개', category: '사물', fallback: '🌈' },
  { id: 'bell', name: '종', category: '사물', fallback: '🔔' },
  { id: 'phone', name: '전화', category: '사물', fallback: '📞' },

  // 동물 (12)
  { id: 'dog', name: '강아지', category: '동물', fallback: '🐶' },
  { id: 'cat', name: '고양이', category: '동물', fallback: '🐱' },
  { id: 'bear', name: '곰', category: '동물', fallback: '🐻' },
  { id: 'rabbit', name: '토끼', category: '동물', fallback: '🐰' },
  { id: 'panda', name: '판다', category: '동물', fallback: '🐼' },
  { id: 'fox', name: '여우', category: '동물', fallback: '🦊' },
  { id: 'penguin', name: '펭귄', category: '동물', fallback: '🐧' },
  { id: 'pig', name: '돼지', category: '동물', fallback: '🐷' },
  { id: 'koala', name: '코알라', category: '동물', fallback: '🐨' },
  { id: 'monkey', name: '원숭이', category: '동물', fallback: '🐵' },
  { id: 'unicorn', name: '유니콘', category: '동물', fallback: '🦄' },
  { id: 'butterfly', name: '나비', category: '동물', fallback: '🦋' },
];

export const EMOJI_BY_ID: Record<string, EmojiEntry> = Object.fromEntries(
  EMOJI_CATALOG.map((e) => [e.id, e]),
);

export const DEFAULT_FAVORITES = [
  'heart',
  'thought-cloud',
  'lips',
  'burger',
  'sleeping',
  'pointing',
];

export const CATEGORIES: EmojiCategory[] = [
  '감정',
  '동작',
  '음식',
  '사물',
  '동물',
];

export function getEmoji(id: string): EmojiEntry | undefined {
  return EMOJI_BY_ID[id];
}
