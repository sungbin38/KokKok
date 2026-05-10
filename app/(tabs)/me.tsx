import { useState, type ReactNode } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  useRelationships,
  useUser,
} from '@/firebase/firestore';
import { signOut } from '@/firebase/auth';
import { unregisterCurrentToken } from '@/firebase/push';
import { useCurrentUid } from '@/hooks/useCurrentUid';
import { colors, radius, shadow } from '@/theme';

export default function Me() {
  const uid = useCurrentUid();
  const { user } = useUser(uid);
  const { items: relationships } = useRelationships(uid);
  const router = useRouter();

  const [vib, setVib] = useState(true);
  const [snd, setSnd] = useState(true);
  const [silent, setSilent] = useState(false);

  async function handleLogout() {
    if (!uid) return;
    Alert.alert('로그아웃', '정말 로그아웃 할까요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: async () => {
          try {
            await unregisterCurrentToken(uid);
          } catch {
            // ignore
          }
          await signOut();
        },
      },
    ]);
  }

  const handle = `kokkok.id/${user?.displayName?.toLowerCase().replace(/\s/g, '') ?? 'me'}`;
  const initial = user?.displayName?.trim().charAt(0) ?? '나';

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ paddingHorizontal: 24, paddingTop: 12, paddingBottom: 14 }}>
            <Text
              style={{
                fontSize: 30,
                fontWeight: '800',
                color: colors.ink,
                letterSpacing: -0.7,
              }}
            >
              설정
            </Text>
          </View>

          {/* Profile gradient card — flat red with overlay highlight */}
          <View style={{ paddingHorizontal: 16 }}>
            <View
              style={[
                {
                  borderRadius: radius.lg,
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  backgroundColor: colors.red,
                  overflow: 'hidden',
                },
                shadow.redGlow,
              ]}
            >
              {/* gradient highlight overlay */}
              <View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '70%',
                  backgroundColor: '#FF6B7E',
                  opacity: 0.55,
                }}
              />
              <View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  top: -30,
                  left: -30,
                  width: 140,
                  height: 140,
                  borderRadius: 70,
                  backgroundColor: '#fff',
                  opacity: 0.12,
                }}
              />
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: 'rgba(255,255,255,0.22)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 22,
                    fontWeight: '800',
                    letterSpacing: -0.5,
                  }}
                >
                  {initial}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 17,
                    fontWeight: '800',
                    letterSpacing: -0.3,
                  }}
                >
                  {user?.displayName ?? '익명'}
                </Text>
                <Text
                  style={{
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: 12,
                    marginTop: 2,
                  }}
                >
                  {handle} · {relationships.length}명과 연결됨
                </Text>
              </View>
              <Pressable
                onPress={() => router.push('/invite')}
                style={({ pressed }) => ({
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 999,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>
                  편집
                </Text>
              </Pressable>
            </View>
          </View>

          <Section title="알림">
            <Row
              icon={{ e: '🔔', bg: colors.redSoft }}
              label="알림 사운드"
              sub={snd ? '기본 · 톡톡' : '꺼짐'}
              right={<Toggle on={snd} onChange={setSnd} />}
            />
            <Row
              icon={{ e: '📳', bg: colors.blueSoft }}
              label="진동"
              right={<Toggle on={vib} onChange={setVib} />}
            />
            <Row
              icon={{ e: '🌙', bg: '#2A2540' }}
              label="방해 금지"
              sub="22:00 – 07:00"
              right={<Toggle on={silent} onChange={setSilent} />}
              last
            />
          </Section>

          <Section title="연결된 상대">
            {relationships.length === 0 ? (
              <Row
                icon={{ e: '➕', bg: colors.surfaceAlt }}
                label="새 연결 추가"
                sub="콕 친구를 만들어보세요"
                right={<Chevron />}
                onPress={() => router.push('/invite')}
                last
              />
            ) : (
              <>
                {relationships.slice(0, 3).map((rel, i) => {
                  const name = rel.nicknames?.[uid ?? ''] ?? '친구';
                  return (
                    <Row
                      key={rel.id}
                      icon={{ e: '💗', bg: colors.redSoft }}
                      label={name}
                      sub={
                        rel.lastPokeAt
                          ? '연결됨 · 최근 콕 활성'
                          : '연결됨 · 콕을 보내보세요'
                      }
                      right={<Chevron />}
                      onPress={() =>
                        router.push({
                          pathname: '/poke/[relId]',
                          params: { relId: rel.id },
                        })
                      }
                      last={
                        i === relationships.slice(0, 3).length - 1 && relationships.length <= 3
                      }
                    />
                  );
                })}
                <Row
                  icon={{ e: '➕', bg: colors.surfaceAlt }}
                  label="새 연결 추가"
                  right={<Chevron />}
                  onPress={() => router.push('/invite')}
                  last
                />
              </>
            )}
          </Section>

          <Section title="콕 라이브러리">
            <Row
              icon={{ e: '✨', bg: colors.yellowSoft }}
              label="즐겨찾기 편집"
              sub="자주 쓰는 콕 6개를 정해요"
              right={<Chevron />}
              onPress={() => {
                const first = relationships[0];
                if (!first) {
                  Alert.alert('먼저 콕 친구를 연결해주세요');
                  return;
                }
                router.push({
                  pathname: '/poke/[relId]/picker',
                  params: { relId: first.id },
                });
              }}
            />
            <Row
              icon={{ e: '🎨', bg: colors.greenSoft }}
              label="커스텀 콕 만들기"
              sub="이모지 + 라벨로 나만의 콕"
              right={<Chevron />}
              onPress={() =>
                Alert.alert('곧 만나요', '커스텀 콕은 다음 업데이트에 추가될 거예요')
              }
              last
            />
          </Section>

          <Section title="계정">
            <Row
              icon={{ e: '🚪', bg: colors.surfaceAlt }}
              label="로그아웃"
              right={<Chevron />}
              onPress={handleLogout}
              last
            />
          </Section>

          <View style={{ paddingTop: 24, paddingBottom: 28, alignItems: 'center' }}>
            <Text style={{ fontSize: 11, color: colors.inkMuted }}>
              v0.1.0 · made with{' '}
              <Text style={{ color: colors.red }}>♥</Text> in Seoul
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={{ marginTop: 18 }}>
      <Text
        style={{
          paddingHorizontal: 24,
          paddingBottom: 8,
          fontSize: 12,
          color: colors.inkSoft,
          fontWeight: '700',
          letterSpacing: 0.4,
          textTransform: 'uppercase',
        }}
      >
        {title}
      </Text>
      <View
        style={[
          {
            backgroundColor: colors.surface,
            marginHorizontal: 16,
            borderRadius: radius.lg,
            overflow: 'hidden',
          },
          shadow.cardSoft,
        ]}
      >
        {children}
      </View>
    </View>
  );
}

function Row({
  icon,
  label,
  sub,
  right,
  last,
  onPress,
}: {
  icon: { e: string; bg: string };
  label: string;
  sub?: string;
  right?: ReactNode;
  last?: boolean;
  onPress?: () => void;
}) {
  const Inner = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: last ? 0 : 0.5,
        borderBottomColor: colors.hairline,
      }}
    >
      <View
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          backgroundColor: icon.bg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 18 }}>{icon.e}</Text>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: '600',
            color: colors.ink,
            letterSpacing: -0.2,
          }}
        >
          {label}
        </Text>
        {sub && (
          <Text style={{ fontSize: 12, color: colors.inkSoft, marginTop: 2 }}>
            {sub}
          </Text>
        )}
      </View>
      {right}
    </View>
  );
  return onPress ? (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      {Inner}
    </Pressable>
  ) : (
    Inner
  );
}

function Toggle({
  on,
  onChange,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <Pressable
      onPress={() => onChange(!on)}
      style={({ pressed }) => ({
        width: 50,
        height: 30,
        borderRadius: 999,
        padding: 2,
        backgroundColor: on ? colors.red : '#E2DCD5',
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View
        style={{
          width: 26,
          height: 26,
          borderRadius: 13,
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOpacity: 0.18,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
          elevation: 2,
          transform: [{ translateX: on ? 20 : 0 }],
        }}
      />
    </Pressable>
  );
}

function Chevron() {
  return <Text style={{ fontSize: 18, color: colors.inkMuted }}>›</Text>;
}
