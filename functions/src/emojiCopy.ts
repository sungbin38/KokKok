// 이모지별 푸시 알림 카피 — 클라이언트 i18n이 아니라 서버 단일 소스.
// 새 이모지 추가 시 여기 한 줄만 추가하면 됨. 기본값 fallback도 있음.

export interface PokeCopy {
  emoji: string;
  body: string;
}

const COPY: Record<string, PokeCopy> = {
  heart: { emoji: '❤️', body: '하트를 보냈어요' },
  'sparkle-heart': { emoji: '💖', body: '반짝 하트를 보냈어요' },
  'fire-heart': { emoji: '❤️‍🔥', body: '뜨거운 하트를 보냈어요' },
  'broken-heart': { emoji: '💔', body: '삐졌대요' },
  'heart-eyes': { emoji: '😍', body: '보고 싶대요' },
  kiss: { emoji: '😘', body: '뽀뽀!' },
  lips: { emoji: '💋', body: '키스 마크' },
  smile: { emoji: '😊', body: '미소를 보냈어요' },
  laugh: { emoji: '😆', body: '웃겨 죽겠대요' },
  'crying-laugh': { emoji: '😂', body: '빵 터졌대요' },
  wink: { emoji: '😉', body: '윙크' },
  sleeping: { emoji: '😴', body: '잘게요, 잘 자요' },
  tired: { emoji: '😩', body: '지쳤대요' },
  crying: { emoji: '😢', body: '울고 있어요' },
  pouting: { emoji: '😡', body: '삐쳤어요' },
  shocked: { emoji: '😮', body: '놀랐대요' },
  thinking: { emoji: '🤔', body: '생각 중...' },
  'thought-cloud': { emoji: '💭', body: '생각하고 있어요' },
  'star-eyes': { emoji: '🤩', body: '반했대요' },
  pleading: { emoji: '🥺', body: '제발...' },

  pointing: { emoji: '☝️', body: '잠깐만요' },
  wave: { emoji: '👋', body: '인사!' },
  clap: { emoji: '👏', body: '짝짝짝' },
  'thumbs-up': { emoji: '👍', body: '엄지척!' },
  'ok-hand': { emoji: '👌', body: '오케이' },
  pray: { emoji: '🙏', body: '부탁해요' },
  hug: { emoji: '🤗', body: '안아주고 싶어요' },
  'high-five': { emoji: '🙌', body: '하이파이브!' },
  'come-here': { emoji: '🫴', body: '이리와요' },
  pinch: { emoji: '🤏', body: '꼬집' },
  flex: { emoji: '💪', body: '힘내요' },
  'crossed-fingers': { emoji: '🤞', body: '행운을 빌어요' },
  peace: { emoji: '✌️', body: '평화롭게' },
  'rock-on': { emoji: '🤘', body: '록온!' },
  shaka: { emoji: '🤙', body: '연락해요' },

  burger: { emoji: '🍔', body: '뭐 먹지?' },
  pizza: { emoji: '🍕', body: '피자 시킬까?' },
  ramen: { emoji: '🍜', body: '라멘 어때?' },
  rice: { emoji: '🍚', body: '밥 먹었어요?' },
  tteokbokki: { emoji: '🌶️', body: '떡볶이 땡겨요' },
  coffee: { emoji: '☕', body: '커피 한잔?' },
  beer: { emoji: '🍺', body: '한잔할까?' },
  cake: { emoji: '🍰', body: '달달한 거 먹고 싶어요' },
  icecream: { emoji: '🍦', body: '아이스크림' },
  strawberry: { emoji: '🍓', body: '딸기' },
  apple: { emoji: '🍎', body: '사과' },
  cookie: { emoji: '🍪', body: '쿠키 먹고 싶어요' },

  gift: { emoji: '🎁', body: '선물!' },
  flower: { emoji: '🌷', body: '꽃을 보냈어요' },
  rose: { emoji: '🌹', body: '장미를 보냈어요' },
  balloon: { emoji: '🎈', body: '풍선!' },
  'cake-bday': { emoji: '🎂', body: '축하해요' },
  sparkles: { emoji: '✨', body: '반짝!' },
  star: { emoji: '⭐', body: '별이 떴어요' },
  moon: { emoji: '🌙', body: '굿나잇' },
  sun: { emoji: '☀️', body: '굿모닝' },
  rainbow: { emoji: '🌈', body: '오늘 좋은 날' },
  bell: { emoji: '🔔', body: '띵동' },
  phone: { emoji: '📞', body: '전화해줘요' },

  dog: { emoji: '🐶', body: '멍멍' },
  cat: { emoji: '🐱', body: '냐옹' },
  bear: { emoji: '🐻', body: '곰' },
  rabbit: { emoji: '🐰', body: '토끼' },
  panda: { emoji: '🐼', body: '판다' },
  fox: { emoji: '🦊', body: '여우' },
  penguin: { emoji: '🐧', body: '펭귄' },
  pig: { emoji: '🐷', body: '돼지' },
  koala: { emoji: '🐨', body: '코알라' },
  monkey: { emoji: '🐵', body: '원숭이' },
  unicorn: { emoji: '🦄', body: '유니콘' },
  butterfly: { emoji: '🦋', body: '나비' },
};

export function getCopy(emojiId: string): PokeCopy {
  return COPY[emojiId] ?? { emoji: '🔔', body: '콕!' };
}
