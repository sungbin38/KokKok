# 콕콕 (KokKok)

> 한 번의 콕으로, 마음을 전합니다.

연인, 배우자, 가족 — 가장 가까운 사람에게 긴 말 없이 **딱 한 번의 터치**로 마음을 전하는 미니멀 푸시 알림 앱.

---

## 🌱 이런 적, 있지 않으세요?

- 카톡 보내기엔 너무 사소한데, 그냥 **"생각났다"** 고 알려주고 싶을 때
- 바쁜 하루 끝에 **"잘 자"** 한 마디면 충분할 때
- 멀리 있는 가족에게 **"밥 챙겨 먹어"** 라고 잔소리 같지 않게 말하고 싶을 때
- 굳이 답장이 필요 없는 그런 마음들

콕콕은 이 모든 순간을 **단 한 번의 콕**으로 해결합니다.

---

## ✨ 콕콕이 하는 일

### 1. 콕 한 번이면 끝
원하는 사람을 고르고, 마음에 드는 이모지를 누르면 끝.
긴 메시지도, 답장 부담도 없습니다.

### 2. 50~80개 3D 이모지 + 즐겨찾기 6개
- ❤️ 하트 · 💭 생각 구름 · 💋 립스 · 🍔 버거 · 😴 잠든 얼굴 · ☝️ 손가락 (기본)
- 감정 / 동작 / 음식 / 사물 / 동물 5개 카테고리에서 6개를 골라 첫 화면에 배치
- 길게 누르면 풀 라이브러리에서 자유롭게 교체

### 3. 받는 순간이 즐겁게
콕을 받으면 화면 가득 부드러운 애니메이션과 함께 알림이 떠오릅니다.
그 자리에서 바로 **되콕(반대 방향 콕)** 으로 답장도 가능.

### 4. 우리만의 히스토리
주고받은 콕이 타임라인으로 쌓입니다.
"우리 이만큼 서로 생각했구나" 를 한눈에.

---

## 🎯 누구를 위한 앱인가요?

| 대상 | 이렇게 써요 |
|------|-------------|
| **연인** | 일상의 작은 애정 표현, 사소한 안부 |
| **부부** | 잔소리 같지 않은 챙김, 짧은 신호 |
| **부모-자녀** | "밥 먹었니?" 한 번이면 충분 |
| **장거리 가족** | 매일 길게 말 안 해도 되는 가벼운 연결 |

---

## 🌟 다른 메시징 앱과 무엇이 다른가요?

|  | 카카오톡 / iMessage | 콕콕 |
|---|---|---|
| 메시지 작성 | 타이핑 필요 | **한 번의 탭** |
| 답장 부담 | 있음 | 없음 (콕으로 답장 가능) |
| 알림 피로도 | 높음 (긴 대화) | 낮음 (가벼운 신호) |
| 용도 | 모든 대화 | **가까운 사람과의 짧은 마음** |

콕콕은 카카오톡을 **대체하지 않습니다.**
카카오톡으로 다 못 전하는, 작고 사소한 마음들의 자리입니다.

---

## 🛠️ 기술 스택

- **Framework**: React Native + Expo (managed, SDK 54) — iOS · Android
- **Routing**: Expo Router (file-based, App Router 감각)
- **Styling**: NativeWind (Tailwind for React Native) + 코랄 #FF5A5F 토큰
- **Language**: TypeScript (strict)
- **Backend**: Firebase
  - Authentication: Apple + Google + 6자리 초대 코드
  - Firestore: users / relationships / inviteCodes / pokes / emojis
  - Cloud Messaging (FCM): iOS는 APNs 위임, Android는 FCM 직결
  - Cloud Functions (Node 22, asia-northeast3): `onPokeCreate`, `redeemInvite`
- **3D 이모지**: Microsoft Fluent Emoji 3D (Apache-2.0) 50~80개 큐레이션

> Apple Sign-In과 RN Firebase는 Expo Go에서 동작하지 않으므로 development build가 필요합니다.

---

## 📂 프로젝트 구조

```
kok-kok/
├── app/                      # Expo Router 라우트
│   ├── _layout.tsx           # Auth gate + Push handler
│   ├── (auth)/onboarding.tsx
│   ├── (tabs)/{home,history,me}.tsx
│   ├── poke/[relId]/{index,picker}.tsx
│   ├── poke-received/[pokeId].tsx
│   └── invite.tsx
├── src/
│   ├── firebase/             # config, auth, firestore, push, types
│   ├── hooks/                # useSendPoke, useInvite, usePushHandler
│   ├── components/           # EmojiBadge, Avatar, PressableButton
│   ├── data/emojis.ts        # 카탈로그 SSOT
│   ├── utils/                # inviteCode, time
│   └── theme.ts
├── functions/                # Cloud Functions (TS)
│   └── src/{index,onPokeCreate,redeemInvite,emojiCopy}.ts
├── firestore.rules
├── firestore.indexes.json
├── firebase.json
└── scripts/seed-emojis.mjs
```

---

## 🚀 1회 셋업

### 1. 의존성

```bash
npm install
cd functions && npm install && cd ..
```

### 2. Firebase 프로젝트
1. https://console.firebase.google.com/ → 새 프로젝트
2. **Authentication**: Apple, Google 두 공급자 활성화
3. **Firestore Database** 생성 (asia-northeast3)
4. **Cloud Messaging** 활성화
5. **iOS / Android 앱 추가** (Bundle ID: `com.luke.kokkok`)
6. 다운로드한 파일을 프로젝트 루트에 배치
   - `GoogleService-Info.plist` (iOS)
   - `google-services.json` (Android)
   - **이 파일들은 `.gitignore`에 등록되어 있음 — 절대 커밋 금지**

### 3. Google 로그인 클라이언트
- Firebase Console → 인증 → Google → Web SDK 구성에서 `webClientId` 복사
- `app.json`의 `expo.extra.googleWebClientId`에 추가:

```jsonc
{
  "expo": {
    "extra": { "googleWebClientId": "<webClientId>.apps.googleusercontent.com" }
  }
}
```

- iOS REVERSED_CLIENT_ID는 `app.json` 의 `@react-native-google-signin/google-signin` 플러그인 `iosUrlScheme`에 채움

### 4. Apple Sign-In (iOS)
- Apple Developer Console → App ID에 Sign in with Apple capability 활성화
- Firebase Apple provider에 Service ID, Key ID, Private Key 등록

### 5. APNs 키 (iOS 푸시)
- Apple Developer → Keys → APNs 키 생성
- Firebase Console → 프로젝트 설정 → Cloud Messaging → APNs 인증 키 업로드

### 6. Cloud Functions / Firestore Rules / Indexes 배포

```bash
firebase login
firebase use <project-id>
firebase deploy --only functions,firestore:rules,firestore:indexes
```

### 7. 이모지 카탈로그 시드

```bash
GCLOUD_PROJECT=<project-id> node scripts/seed-emojis.mjs
```

### 8. 3D 이모지 에셋 (선택, 디자인 도착 후)
- https://github.com/microsoft/fluentui-emoji 에서 PNG 256px 다운로드
- `src/data/emojis.ts` 의 `id` 기준으로 `assets/emojis/<id>.png` 로 저장
- `EmojiBadge.tsx` 가 `asset` 필드를 자동 사용. 없으면 유니코드 fallback으로 동작.

---

## 🧑‍💻 개발 빌드

```bash
# iOS (Xcode + Apple Developer 계정 필요)
npx expo run:ios

# Android (Android Studio 또는 실기기)
npx expo run:android

# 또는 EAS Build (클라우드)
eas build --profile development --platform ios
eas build --profile development --platform android
```

설치 후 메트로 시작:

```bash
npm start
```

---

## 🎨 디자인 (Claude Design)

`/Users/luke/.claude/plans/fuzzy-fluttering-cocke.md` 의 6장에 8개 화면별
프롬프트가 정리되어 있어요. 별도 Claude Design 세션에 그대로 붙여넣어
Figma → 코드로 옮기면 됩니다.

화면 목록:
1. 온보딩 (`/onboarding`)
2. 홈 (`/(tabs)/home`)
3. **콕 보내기 (`/poke/[relId]`)** — 첨부 스크린샷
4. 이모지 풀 픽커 (`/poke/[relId]/picker`)
5. 히스토리 (`/(tabs)/history`)
6. 나 (`/(tabs)/me`)
7. 초대 (`/invite`)
8. 받은 콕 풀스크린 모달 (`/poke-received/[pokeId]`)

---

## ✅ 검증 체크리스트

- [ ] Apple/Google 로그인 → `users` 문서 자동 생성
- [ ] 초대 코드 발급 → 다른 디바이스에서 입력 → `relationships` 생성
- [ ] 콕 발송 → 상대 디바이스 푸시 도착 (P50 < 2초 목표)
- [ ] 백그라운드/종료 상태에서도 푸시 도착
- [ ] 푸시 탭 → `poke-received` 모달 → 되콕
- [ ] 즐겨찾기 6개 편집 → 다른 디바이스 재로그인 시 동기화
- [ ] 만료된 초대 코드 (24h+) 입력 시 명확한 에러
- [ ] Firestore 보안 규칙 — 권한 없는 사용자가 타인의 콕에 쓰기 시도 시 거부

---

## 🗺️ 로드맵

- [x] 프로젝트 초기 세팅 (Expo + RN Firebase + NativeWind + TypeScript)
- [x] Apple / Google 로그인 + 초대 코드 (6자리, 24h)
- [x] 6개 즐겨찾기 콕 발송 + 풀 이모지 픽커 (50~80개)
- [x] FCM 푸시 트리거 (Cloud Functions)
- [x] 보낸 콕 / 받은 콕 히스토리
- [x] 받은 콕 풀스크린 모달 + 되콕
- [ ] 3D 이모지 에셋 번들 (디자인 도착 후)
- [ ] 그룹 콕 (3인 이상)
- [ ] 콕 + 짧은 텍스트 (20자)
- [ ] 콕 스트릭 게이미피케이션
- [ ] 위젯 지원 (홈 화면에서 바로 콕)
- [ ] Apple Watch / Wear OS 연동

---

## 💛 만든 이유

가까울수록 말이 줄어듭니다.
하지만 마음까지 줄어드는 건 아니에요.

콕콕은 그 **줄어든 말 사이에 남아있는 마음** 을 위한 앱입니다.
긴 문장이 필요 없는 사이를 위해, 가장 가벼운 방식으로.

---

## 📄 라이선스

비공개 프로젝트 (Private)

---

> 오늘, 떠오른 사람에게 콕 한 번 어떠세요?
