import { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
const firestoreModule = require('@react-native-firebase/firestore');
const firestore: any = firestoreModule.default ?? firestoreModule;
import {
  useUser,
  usePokesForRelationship,
} from '@/firebase/firestore';
import { useSendPoke } from '@/hooks/useSendPoke';
import { useCurrentUid } from '@/hooks/useCurrentUid';
import { useDemoMode } from '@/demo/demoMode';
import { DEMO_RELATIONSHIPS, DEMO_USER, useDemoVersion } from '@/demo/demoData';
import { KokCard } from '@/components/KokCard';
import { KokWord } from '@/components/KokWord';
import { KokToast } from '@/components/KokToast';
import { RecipientPill } from '@/components/RecipientPill';
import { MiniNav, NavIconButton, NavGlyph } from '@/components/MiniNav';
import { colors, radius, shadow } from '@/theme';
import { DEFAULT_FAVORITES, getEmoji } from '@/data/emojis';
import { toneFor } from '@/data/emojiTones';
import { timeAgo } from '@/utils/time';
import type { RelationshipDoc } from '@/firebase/types';

export default function PokeScreen() {
  const { relId } = useLocalSearchParams<{ relId: string }>();
  const router = useRouter();
  const isDemo = useDemoMode();
  const uid = useCurrentUid();
  const { user } = useUser(uid);
  // 데모 모드: DEMO_USER 의 mutable favoriteEmojis 를 매 bump 마다 직접 읽음
  // (useUser useEffect 타이밍에 의존하지 않게).
  useDemoVersion();
  const { send, pending } = useSendPoke();
  const [rel, setRel] = useState<RelationshipDoc | null>(null);
  const sentPokes = usePokesForRelationship(relId ?? null, 'sent', uid);
  const [toast, setToast] = useState<{ id: number; emojiId: string; msg: string } | null>(
    null,
  );

  useEffect(() => {
    if (!relId) return;
    if (isDemo) {
      const found = DEMO_RELATIONSHIPS.find((r) => r.id === relId) ?? null;
      setRel(found);
      return;
    }
    const unsub = firestore()
      .collection('relationships')
      .doc(relId)
      .onSnapshot((snap: any) => {
        if (snap.exists) {
          setRel({ id: snap.id, ...(snap.data() as any) });
        }
      });
    return unsub;
  }, [relId, isDemo]);

  const otherUid = rel?.members.find((m) => m !== uid) ?? '';
  const nickname = rel?.nicknames?.[uid ?? ''] ?? '친구';
  const lastSent = sentPokes[0] ?? null;
  // 데모 모드면 DEMO_USER 직접 참조 (useUser state 가 stale 할 가능성 회피).
  const favoriteSource = isDemo
    ? DEMO_USER.favoriteEmojis
    : user?.favoriteEmojis;
  const favorites = (
    favoriteSource?.length ? favoriteSource : DEFAULT_FAVORITES
  ).slice(0, 6);

  async function onSend(emojiId: string) {
    if (!uid || !relId || !otherUid) return;
    try {
      await send({ fromUid: uid, toUid: otherUid, relId, emojiId });
      const id = Date.now();
      setToast({
        id,
        emojiId,
        msg: `${nickname}님에게 콕!`,
      });
      setTimeout(
        () => setToast((t) => (t?.id === id ? null : t)),
        2200,
      );
    } catch (e: any) {
      Alert.alert('보내기 실패', e?.message ?? String(e));
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <SafeAreaView style={{ flex: 1 }}>
        <MiniNav
          left={
            <NavIconButton onPress={() => router.back()}>
              {NavGlyph.back(colors.ink)}
            </NavIconButton>
          }
          right={
            <NavIconButton>
              <Text style={{ fontSize: 16, color: colors.ink }}>🔔</Text>
            </NavIconButton>
          }
        />

        <View style={{ paddingHorizontal: 24, paddingTop: 6, paddingBottom: 12 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
            }}
          >
            <Text
              style={{
                fontSize: 28,
                fontWeight: '800',
                color: colors.ink,
                letterSpacing: -0.7,
                lineHeight: 36,
              }}
            >
              지금{' '}
            </Text>
            <KokWord size={28} />
            <Text
              style={{
                fontSize: 28,
                fontWeight: '800',
                color: colors.ink,
                letterSpacing: -0.7,
                lineHeight: 36,
              }}
            >
              {' '}찔러보세요
            </Text>
          </View>
          <Text
            style={{
              fontSize: 14,
              color: colors.inkSoft,
              marginTop: 8,
              letterSpacing: -0.2,
              lineHeight: 22,
            }}
          >
            상대방에게 내 마음을 전달해보세요
          </Text>
        </View>

        {/* recipient switcher */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 18, gap: 8, paddingVertical: 4 }}
        >
          <RecipientPill name={nickname} label="콕 친구" active />
          <Pressable
            onPress={() => router.push('/invite')}
            style={({ pressed }) => ({
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: colors.surface,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.7 : 1,
              ...shadow.cardSoft,
            })}
          >
            <Text style={{ fontSize: 22, color: colors.ink, lineHeight: 22 }}>+</Text>
          </Pressable>
        </ScrollView>

        {/* recent kok preview */}
        <View style={{ paddingHorizontal: 20, paddingTop: 14 }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '700',
              color: colors.inkMuted,
              letterSpacing: 0.5,
              marginBottom: 8,
              paddingLeft: 4,
            }}
          >
            최근 보낸 콕
          </Text>
          <View
            style={[
              {
                backgroundColor: colors.surface,
                borderRadius: radius.lg,
                padding: 14,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                minHeight: 76,
              },
              shadow.cardSoft,
            ]}
          >
            {lastSent ? (
              <>
                <View
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    backgroundColor: colors.surfaceAlt,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 30,
                      lineHeight: 32,
                      textShadowColor: 'rgba(0,0,0,0.18)',
                      textShadowOffset: { width: 0, height: 3 },
                      textShadowRadius: 4,
                    }}
                  >
                    {getEmoji(lastSent.emojiId)?.fallback ?? '❓'}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '700',
                      color: colors.ink,
                      letterSpacing: -0.2,
                    }}
                  >
                    {nickname}님에게 "{getEmoji(lastSent.emojiId)?.name ?? ''}"
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.inkSoft,
                      marginTop: 3,
                    }}
                  >
                    {lastSent.createdAt ? timeAgo(lastSent.createdAt) : '방금'}
                  </Text>
                </View>
                <Pressable
                  onPress={() => onSend(lastSent.emojiId)}
                  disabled={pending}
                  style={({ pressed }) => ({
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 999,
                    backgroundColor: colors.surfaceAlt,
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '700',
                      color: colors.ink,
                    }}
                  >
                    한 번 더
                  </Text>
                </Pressable>
              </>
            ) : (
              <Text
                style={{
                  flex: 1,
                  textAlign: 'center',
                  fontSize: 13,
                  color: colors.inkMuted,
                  paddingVertical: 8,
                }}
              >
                보낸 콕 찌르기가 없어요
              </Text>
            )}
          </View>
        </View>

        {/* 3x2 kok grid */}
        <View
          style={{
            flex: 1,
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 16,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              rowGap: 16,
              columnGap: 12,
              justifyContent: 'space-between',
            }}
          >
            {favorites.map((id, idx) => (
              <View key={`${id}-${idx}`} style={{ width: '31%', alignItems: 'center' }}>
                <KokCard
                  emojiId={id}
                  tone={toneFor(id)}
                  size="md"
                  onPress={() => onSend(id)}
                  onLongPress={() =>
                    router.push({
                      pathname: '/poke/[relId]/picker',
                      params: { relId: relId! },
                    })
                  }
                  disabled={pending}
                  style={{ width: '100%' }}
                />
              </View>
            ))}
          </View>
          <Pressable
            onPress={() =>
              router.push({
                pathname: '/poke/[relId]/picker',
                params: { relId: relId! },
              })
            }
            style={({ pressed }) => ({
              alignSelf: 'center',
              marginTop: 'auto',
              paddingTop: 16,
              paddingBottom: 4,
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <Text
              style={{
                color: colors.red,
                fontWeight: '700',
                fontSize: 14,
                letterSpacing: -0.2,
              }}
            >
              + 다른 이모지 / 즐겨찾기 편집
            </Text>
          </Pressable>
        </View>

        {toast && (
          <KokToast
            key={toast.id}
            message={toast.msg}
            emojiId={toast.emojiId}
            top={64}
          />
        )}
      </SafeAreaView>
    </View>
  );
}
