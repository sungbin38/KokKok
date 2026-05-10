import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export function timeAgo(
  ts: FirebaseFirestoreTypes.Timestamp | null | undefined,
): string {
  if (!ts) return '';
  const now = Date.now();
  const then = ts.toMillis();
  const diff = Math.max(0, now - then);
  const min = Math.floor(diff / 60000);
  if (min < 1) return '방금';
  if (min < 60) return `${min}분 전`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}시간 전`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}일 전`;
  const date = new Date(then);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export function formatDateHeading(
  ts: FirebaseFirestoreTypes.Timestamp,
): string {
  const date = new Date(ts.toMillis());
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const diffMs = startOfToday.getTime() - date.getTime();
  const oneDay = 86400000;
  if (date >= startOfToday) return '오늘';
  if (diffMs < oneDay) return '어제';
  if (diffMs < oneDay * 7) return '이번 주';
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
}

export function formatTime(ts: FirebaseFirestoreTypes.Timestamp): string {
  const d = new Date(ts.toMillis());
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}
