/** Per-emoji tone color used by KokCard's wash and ripple. */
const TONES: Record<string, string> = {
  heart: '#FF3D52',
  'sparkle-heart': '#FF3D52',
  'fire-heart': '#FF3D52',
  'broken-heart': '#FF3D52',
  'heart-eyes': '#FF3D52',

  'thought-cloud': '#7A89FF',
  thinking: '#7A89FF',

  lips: '#E84B7C',
  kiss: '#E84B7C',

  burger: '#F2A33A',
  pizza: '#F2A33A',
  ramen: '#F2A33A',
  rice: '#F2A33A',
  coffee: '#A66A4A',

  sleeping: '#5DA9FF',
  tired: '#5DA9FF',
  moon: '#5DA9FF',

  pointing: '#34C285',
  wave: '#34C285',
  'thumbs-up': '#34C285',

  flower: '#FF7BAC',
  rose: '#FF3D52',
  gift: '#FF8A4A',
  sparkles: '#F2A33A',
  star: '#F2A33A',
  rainbow: '#7A89FF',

  dog: '#C68A4A',
  cat: '#A77BD8',
  bear: '#A66A4A',
  rabbit: '#FF8DA8',
  panda: '#5C504A',
};

const FALLBACK = '#FF3D52';

export function toneFor(emojiId: string): string {
  return TONES[emojiId] ?? FALLBACK;
}
