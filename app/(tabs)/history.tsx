import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  useHistory,
  useRelationships,
  useUser,
} from '@/firebase/firestore';
import { useCurrentUid } from '@/hooks/useCurrentUid';
import { Avatar } from '@/components/Avatar';
import { MiniNav, NavIconButton } from '@/components/MiniNav';
import { colors, radius, shadow } from '@/theme';
import { DEFAULT_FAVORITES, getEmoji } from '@/data/emojis';
import {
  formatDateHeading,
  formatTime,
  timeAgo,
} from '@/utils/time';
import type { PokeDoc } from '@/firebase/types';

interface BubbleEntry {
  kind: 'bubble';
  poke: PokeDoc;
  from: 'me' | 'them';
  partner: string;
  hue: number;
  partnerRelId: string | null;
}
interface DayEntry {
  kind: 'day';
  heading: string;
}
type TimelineItem = BubbleEntry | DayEntry;

export default function History() {
  const uid = useCurrentUid();
  const router = useRouter();
  const { user } = useUser(uid);
  const { items: relationships } = useRelationships(uid);
  const sent = useHistory(uid, 'sent');
  const received = useHistory(uid, 'received');

  // Build a partner lookup: relId → { nickname, hue }
  const partnerByRel = useMemo(() => {
    const map = new Map<string, { name: string; hue: number; otherUid: string }>();
    relationships.forEach((rel, i) => {
      const otherUid = rel.members.find((m) => m !== uid) ?? '';
      const name = rel.nicknames?.[uid ?? ''] ?? '친구';
      // Stable per-rel hue: cycle through warm hues
      const hue = [350, 30, 200, 280, 110, 50][i % 6];
      map.set(rel.id, { name, hue, otherUid });
    });
    return map;
  }, [relationships, uid]);

  const focal = relationships[0] ?? null;
  const focalPartner = focal ? partnerByRel.get(focal.id) : null;

  const todayCount = useMemo(() => {
    const all = [...sent, ...received];
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const t = startOfToday.getTime();
    return all.filter((p) => p.createdAt && p.createdAt.toMillis() >= t)
      .length;
  }, [sent, received]);

  const timeline: TimelineItem[] = useMemo(() => {
    const merged: { from: 'me' | 'them'; poke: PokeDoc }[] = [
      ...sent.map((p) => ({ from: 'me' as const, poke: p })),
      ...received.map((p) => ({ from: 'them' as const, poke: p })),
    ]
      .filter((x) => x.poke.createdAt)
      .sort(
        (a, b) =>
          (b.poke.createdAt?.toMillis() ?? 0) -
          (a.poke.createdAt?.toMillis() ?? 0),
      );

    const out: TimelineItem[] = [];
    let lastHeading: string | null = null;
    for (const m of merged) {
      const heading = m.poke.createdAt
        ? formatDateHeading(m.poke.createdAt)
        : '';
      if (heading !== lastHeading) {
        out.push({ kind: 'day', heading });
        lastHeading = heading;
      }
      const partner = partnerByRel.get(m.poke.relId);
      out.push({
        kind: 'bubble',
        poke: m.poke,
        from: m.from,
        partner: partner?.name ?? '친구',
        hue: partner?.hue ?? 18,
        partnerRelId: m.poke.relId,
      });
    }
    return out;
  }, [sent, received, partnerByRel]);

  const favorites = (
    user?.favoriteEmojis?.length ? user.favoriteEmojis : DEFAULT_FAVORITES
  ).slice(0, 6);

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <MiniNav
          left={<View style={{ width: 40 }} />}
          right={
            <NavIconButton onPress={() => router.push('/invite')}>
              <Text style={{ fontSize: 20, color: colors.ink }}>+</Text>
            </NavIconButton>
          }
        />

        <View
          style={{
            paddingHorizontal: 24,
            paddingTop: 4,
            paddingBottom: 12,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Avatar
            name={focalPartner?.name ?? '콕'}
            size={42}
            hue={focalPartner?.hue ?? 18}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '800',
                color: colors.ink,
                letterSpacing: -0.4,
              }}
            >
              {focalPartner?.name ?? '콕 히스토리'}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                marginTop: 2,
              }}
            >
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: focalPartner ? colors.online : colors.inkMuted,
                }}
              />
              <Text style={{ fontSize: 12, color: colors.inkSoft }}>
                {focalPartner ? '지금 접속 중' : '연결된 콕 친구가 없어요'}
              </Text>
            </View>
          </View>
          {todayCount > 0 && (
            <View
              style={{
                backgroundColor: colors.redSoft,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 999,
              }}
            >
              <Text style={{ fontSize: 12, color: colors.red, fontWeight: '700' }}>
                오늘 {todayCount}번
              </Text>
            </View>
          )}
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 18,
            paddingTop: 8,
            paddingBottom: 18,
            gap: 14,
          }}
          showsVerticalScrollIndicator={false}
        >
          {timeline.length === 0 && (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 80,
                gap: 12,
              }}
            >
              <Text style={{ fontSize: 48 }}>📭</Text>
              <Text style={{ color: colors.inkSoft }}>
                아직 콕 히스토리가 없어요
              </Text>
            </View>
          )}
          {timeline.map((item, i) =>
            item.kind === 'day' ? (
              <View
                key={`day-${i}`}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  paddingVertical: 4,
                }}
              >
                <View style={{ flex: 1, height: 1, backgroundColor: colors.hairline }} />
                <Text
                  style={{
                    fontSize: 11,
                    color: colors.inkSoft,
                    fontWeight: '600',
                    letterSpacing: 0.4,
                  }}
                >
                  {item.heading}
                </Text>
                <View style={{ flex: 1, height: 1, backgroundColor: colors.hairline }} />
              </View>
            ) : (
              <Bubble
                key={`b-${item.poke.id}`}
                entry={item}
                onReply={() =>
                  item.partnerRelId &&
                  router.push({
                    pathname: '/poke/[relId]',
                    params: { relId: item.partnerRelId },
                  })
                }
              />
            ),
          )}
        </ScrollView>

        {/* footer dock */}
        {focal && (
          <View
            style={{
              paddingHorizontal: 18,
              paddingTop: 10,
              paddingBottom: 18,
              borderTopWidth: 1,
              borderTopColor: colors.hairline,
              backgroundColor: colors.surface,
            }}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {favorites.map((id) => (
                <Pressable
                  key={id}
                  onPress={() =>
                    router.push({
                      pathname: '/poke/[relId]',
                      params: { relId: focal.id },
                    })
                  }
                  style={({ pressed }) => ({
                    width: 56,
                    height: 56,
                    borderRadius: 18,
                    backgroundColor: colors.cream,
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: pressed ? 0.7 : 1,
                  })}
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
                    {getEmoji(id)?.fallback ?? '❓'}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

function Bubble({
  entry,
  onReply,
}: {
  entry: BubbleEntry;
  onReply: () => void;
}) {
  const { from, poke, partner, hue } = entry;
  const me = from === 'me';
  const ent = getEmoji(poke.emojiId);
  const time = poke.createdAt ? formatTime(poke.createdAt) : timeAgo(poke.createdAt);

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: me ? 'flex-end' : 'flex-start',
        alignItems: 'flex-end',
        gap: 6,
      }}
    >
      {!me && <Avatar name={partner} size={28} hue={hue} />}
      <View
        style={{
          maxWidth: 240,
          alignItems: me ? 'flex-end' : 'flex-start',
        }}
      >
        <View
          style={[
            {
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              paddingVertical: 10,
              paddingHorizontal: 14,
              borderRadius: 22,
              borderBottomRightRadius: me ? 6 : 22,
              borderBottomLeftRadius: me ? 22 : 6,
              backgroundColor: me ? colors.red : colors.surface,
            },
            me ? shadow.redGlow : shadow.cardSoft,
          ]}
        >
          <Text
            style={{
              fontSize: 28,
              lineHeight: 30,
              textShadowColor: 'rgba(0,0,0,0.2)',
              textShadowOffset: { width: 0, height: 3 },
              textShadowRadius: 4,
            }}
          >
            {ent?.fallback ?? '❓'}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              letterSpacing: -0.2,
              color: me ? '#fff' : colors.ink,
            }}
          >
            {ent?.name ?? '콕'}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            marginTop: 4,
            paddingHorizontal: 6,
          }}
        >
          <Text style={{ fontSize: 11, color: colors.inkMuted }}>{time}</Text>
          {!me && (
            <Pressable
              onPress={onReply}
              style={({ pressed }) => ({
                opacity: pressed ? 0.6 : 1,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 3,
              })}
            >
              <Text style={{ fontSize: 11, color: colors.red }}>↩</Text>
              <Text
                style={{
                  fontSize: 11,
                  color: colors.red,
                  fontWeight: '700',
                }}
              >
                되돌려보내기
              </Text>
            </Pressable>
          )}
          {poke.replyToPokeId && (
            <Text
              style={{
                fontSize: 11,
                color: colors.inkMuted,
                fontStyle: 'italic',
              }}
            >
              · 답장
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
