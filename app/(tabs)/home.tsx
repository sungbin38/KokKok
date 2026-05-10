import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useRelationships } from '@/firebase/firestore';
import { useCurrentUid } from '@/hooks/useCurrentUid';
import { useDemoMode } from '@/demo/demoMode';
import {
  demoLastPokeReceived,
  demoLatestUnreadReceivedPoke,
  isDemoFavorite,
  isDemoUnread,
} from '@/demo/demoData';
import { Avatar } from '@/components/Avatar';
import { KokWord } from '@/components/KokWord';
import { PressableButton } from '@/components/PressableButton';
import { colors, radius, shadow } from '@/theme';
import { getEmoji } from '@/data/emojis';
import { timeAgo } from '@/utils/time';
import type { RelationshipDoc } from '@/firebase/types';

const HUES = [350, 30, 200, 280, 110, 50];

export default function Home() {
  const uid = useCurrentUid();
  const router = useRouter();
  const isDemo = useDemoMode();
  const { items, loading } = useRelationships(uid);

  const unreadCount = isDemo
    ? items.filter((r) => isDemoUnread(r.id)).length
    : 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View
          style={{
            paddingHorizontal: 24,
            paddingTop: 12,
            paddingBottom: 8,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <View>
            <KokWord size={24} />
            {unreadCount > 0 && (
              <Pressable
                onPress={() => {
                  if (!isDemo) return;
                  const latest = demoLatestUnreadReceivedPoke();
                  if (!latest) return;
                  router.push({
                    pathname: '/poke-received/[pokeId]',
                    params: { pokeId: latest.id },
                  });
                }}
                hitSlop={6}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignSelf: 'flex-start',
                  marginTop: 8,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 999,
                  backgroundColor: colors.redSoft,
                  gap: 6,
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: colors.red,
                  }}
                />
                <Text
                  style={{
                    color: colors.red,
                    fontSize: 12,
                    fontWeight: '700',
                    letterSpacing: -0.2,
                  }}
                >
                  안 읽은 콕 {unreadCount}개
                </Text>
              </Pressable>
            )}
          </View>
          <Pressable
            onPress={() => router.push('/invite')}
            style={({ pressed }) => ({
              paddingHorizontal: 4,
              paddingVertical: 4,
              opacity: pressed ? 0.6 : 1,
            })}
            hitSlop={8}
          >
            <Text
              style={{
                color: colors.red,
                fontWeight: '700',
                fontSize: 15,
              }}
            >
              + 초대
            </Text>
          </Pressable>
        </View>

        {loading ? null : items.length === 0 ? (
          <EmptyState onInvite={() => router.push('/invite')} />
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingTop: 8,
              paddingBottom: 24,
              gap: 4,
            }}
            ListFooterComponent={
              <InviteFooter onPress={() => router.push('/invite')} />
            }
            renderItem={({ item, index }) => (
              <RelationshipRow
                item={item}
                uid={uid}
                hue={HUES[index % HUES.length]}
                isDemo={isDemo}
                onPress={() =>
                  router.push({
                    pathname: '/poke/[relId]',
                    params: { relId: item.id },
                  })
                }
              />
            )}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

function RelationshipRow({
  item,
  uid,
  hue,
  isDemo,
  onPress,
}: {
  item: RelationshipDoc;
  uid: string | null;
  hue: number;
  isDemo: boolean;
  onPress: () => void;
}) {
  const nickname = item.nicknames?.[uid ?? ''] ?? '친구';
  const lastEmoji = item.lastPokeEmojiId ? getEmoji(item.lastPokeEmojiId) : null;
  const unread = isDemo && isDemoUnread(item.id);
  const favorite = isDemo && isDemoFavorite(item.id);
  const received = isDemo
    ? demoLastPokeReceived(item.id)
    : false;
  const subtitle = item.lastPokeAt
    ? `${received ? '콕 받음' : '마지막 콕'} · ${timeAgo(item.lastPokeAt)}`
    : '아직 콕 없음';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
        opacity: pressed ? 0.65 : 1,
      })}
    >
      <View>
        <Avatar name={nickname} size={56} hue={hue} />
        {unread && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 14,
              height: 14,
              borderRadius: 7,
              backgroundColor: colors.red,
              borderWidth: 2,
              borderColor: colors.cream,
            }}
          />
        )}
      </View>
      <View style={{ flex: 1, minWidth: 0, marginLeft: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 17,
              fontWeight: '700',
              color: colors.ink,
              letterSpacing: -0.3,
            }}
          >
            {nickname}
          </Text>
          {favorite && (
            <Text style={{ fontSize: 13, color: colors.red }}>★</Text>
          )}
        </View>
        <Text
          numberOfLines={1}
          style={{ color: colors.inkSoft, marginTop: 2, fontSize: 13 }}
        >
          {subtitle}
        </Text>
      </View>
      {lastEmoji && (
        <View
          style={[
            {
              width: 56,
              height: 56,
              borderRadius: 16,
              backgroundColor: colors.surface,
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 12,
              position: 'relative',
            },
            shadow.cardSoft,
          ]}
        >
          <Text style={{ fontSize: 28, lineHeight: 32 }}>
            {lastEmoji.fallback}
          </Text>
          {unread && (
            <View
              style={{
                position: 'absolute',
                bottom: -6,
                paddingHorizontal: 7,
                paddingVertical: 2,
                borderRadius: 999,
                backgroundColor: colors.red,
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: 9,
                  fontWeight: '800',
                  letterSpacing: 0.4,
                }}
              >
                NEW
              </Text>
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
}

function InviteFooter({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 8,
        marginTop: 8,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          borderWidth: 1.5,
          borderStyle: 'dashed',
          borderColor: colors.inkMuted,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 26, color: colors.inkMuted, lineHeight: 28 }}>
          +
        </Text>
      </View>
      <View style={{ marginLeft: 14, flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '700',
            color: colors.ink,
            letterSpacing: -0.3,
          }}
        >
          새 친구 초대하기
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: colors.inkMuted,
            marginTop: 2,
          }}
        >
          링크 · 전화번호 · QR 코드
        </Text>
      </View>
    </Pressable>
  );
}

function EmptyState({ onInvite }: { onInvite: () => void }) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        gap: 16,
      }}
    >
      <KokWord size={36} />
      <Text
        style={{
          fontSize: 18,
          fontWeight: '700',
          color: colors.ink,
          textAlign: 'center',
          letterSpacing: -0.3,
          marginTop: 8,
        }}
      >
        아직 콕 보낼 사람이 없어요
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: colors.inkSoft,
          textAlign: 'center',
          lineHeight: 22,
          letterSpacing: -0.1,
        }}
      >
        가족·연인을 초대 코드로{'\n'}연결해보세요
      </Text>
      <View style={{ width: '100%', maxWidth: 320, marginTop: 8 }}>
        <PressableButton label="초대 코드 만들기" onPress={onInvite} />
      </View>
    </View>
  );
}
