#!/usr/bin/env node
// Firestore `emojis` 마스터 카탈로그 초기화 스크립트.
// 사전: `firebase login` + 프로젝트 ID 환경변수 (GCLOUD_PROJECT 또는 FIREBASE_PROJECT).
// 사용: node scripts/seed-emojis.mjs

import admin from 'firebase-admin';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// src/data/emojis.ts 를 그대로 읽지 못하므로 카테고리/순서만 거울로 정리.
// 실제 카탈로그는 src/data/emojis.ts 가 SSOT — 클라이언트에서 EMOJI_CATALOG 를 사용.
// Firestore에는 카테고리·이름 정도만 동기화하면 충분 (필요시).

const CATALOG = JSON.parse(
  readFileSync(join(__dirname, 'emoji-seed.json'), 'utf-8'),
);

async function main() {
  const projectId = process.env.GCLOUD_PROJECT || process.env.FIREBASE_PROJECT;
  if (!projectId) {
    console.error(
      'GCLOUD_PROJECT 또는 FIREBASE_PROJECT 환경 변수를 설정해주세요',
    );
    process.exit(1);
  }
  admin.initializeApp({ projectId });
  const db = admin.firestore();
  const batch = db.batch();
  let order = 0;
  for (const e of CATALOG) {
    batch.set(
      db.collection('emojis').doc(e.id),
      {
        id: e.id,
        name: e.name,
        category: e.category,
        order: order++,
        assetKey: `assets/emojis/${e.id}.png`,
      },
      { merge: true },
    );
  }
  await batch.commit();
  console.log(`Seeded ${CATALOG.length} emojis`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
