// 6자리 영숫자 초대 코드. 헷갈리는 문자(0/O/1/I/L) 제외.
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

export function generateInviteCode(): string {
  let out = '';
  for (let i = 0; i < 6; i++) {
    const idx = Math.floor(Math.random() * ALPHABET.length);
    out += ALPHABET[idx];
  }
  return out;
}

export function normalizeInviteCode(input: string): string {
  return input
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .replace(/[OIL]/g, (c) => ({ O: '0', I: '1', L: '1' })[c] ?? c)
    .slice(0, 6);
}

export function isValidInviteCode(code: string): boolean {
  return /^[A-Z0-9]{6}$/.test(code);
}

export function relationshipIdForPair(uidA: string, uidB: string): string {
  return [uidA, uidB].sort().join('_');
}
