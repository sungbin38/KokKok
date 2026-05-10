import { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Share,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import auth from '@react-native-firebase/auth';
import { useCreateInviteCode, useRedeemInviteCode } from '@/hooks/useInvite';
import {
  isValidInviteCode,
  normalizeInviteCode,
} from '@/utils/inviteCode';
import { PressableButton } from '@/components/PressableButton';
import { KokWord } from '@/components/KokWord';
import { MiniNav, NavIconButton, NavGlyph } from '@/components/MiniNav';
import { colors, radius, shadow } from '@/theme';

type Mode = 'methods' | 'create' | 'redeem';

export default function InviteScreen() {
  const router = useRouter();
  const signedIn = !!auth().currentUser;
  const [mode, setMode] = useState<Mode>(signedIn ? 'methods' : 'redeem');
  const { code, creating, create } = useCreateInviteCode();
  const { redeem, redeeming } = useRedeemInviteCode();
  const [input, setInput] = useState('');

  useEffect(() => {
    if (mode === 'create' && signedIn && !code && !creating) {
      create().catch((e) => Alert.alert('코드 생성 실패', e.message));
    }
  }, [mode, signedIn, code, creating, create]);

  async function handleShareLink() {
    setMode('create');
    // After mount, useEffect creates the code; share once it's ready.
    setTimeout(async () => {
      if (!code) return;
      await Share.share({
        message: `KokKok 초대 코드: ${code}\n앱에서 이 코드를 입력하면 우리 콕 친구가 돼요. (24시간 안에)`,
      });
    }, 200);
  }

  async function handleCopy() {
    if (!code) return;
    await Clipboard.setStringAsync(code);
    Alert.alert('복사됨', '코드가 복사됐어요');
  }

  async function handleRedeem() {
    const normalized = normalizeInviteCode(input);
    if (!isValidInviteCode(normalized)) {
      Alert.alert('코드 형식이 올바르지 않아요');
      return;
    }
    try {
      const result = await redeem(normalized);
      Alert.alert('연결 완료!', '이제 콕을 보낼 수 있어요');
      router.replace({
        pathname: '/poke/[relId]',
        params: { relId: result.relId },
      });
    } catch (e: any) {
      Alert.alert('연결 실패', e?.message ?? String(e));
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
        />

        <ScrollView
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ paddingHorizontal: 24, paddingTop: 12, paddingBottom: 8 }}>
            <Text
              style={{
                fontSize: 13,
                fontWeight: '700',
                color: colors.red,
                letterSpacing: 0.2,
              }}
            >
              {mode === 'redeem' ? 'STEP 2 of 2' : 'STEP 1 of 2'}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                marginTop: 8,
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
                누구와{' '}
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
                하실래요?
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
              연인, 가족, 베프와 1:1로 연결하거나{'\n'}그룹을 만들 수 있어요.
              둘 다 콕콕 사용 중이어야 해요.
            </Text>
          </View>

          {mode === 'methods' && (
            <View style={{ paddingHorizontal: 20, paddingTop: 20, gap: 10 }}>
              <MethodCard
                emoji="🔗"
                accent={colors.redSoft}
                title="초대 링크 보내기"
                sub="카톡, 메시지로 초대하기"
                onPress={handleShareLink}
              />
              <MethodCard
                emoji="📝"
                accent={colors.greenSoft}
                title="받은 코드 입력하기"
                sub="6자리 초대 코드를 입력해요"
                onPress={() => setMode('redeem')}
              />
              <MethodCard
                emoji="📷"
                accent={colors.blueSoft}
                title="QR 코드 스캔"
                sub="옆에 있다면 가장 빨라요"
                onPress={() =>
                  Alert.alert('곧 만나요', 'QR 스캔은 다음 업데이트에 추가될 거예요')
                }
              />

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  paddingVertical: 14,
                }}
              >
                <View style={{ flex: 1, height: 1, backgroundColor: colors.hairline }} />
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.inkMuted,
                    fontWeight: '500',
                  }}
                >
                  또는
                </Text>
                <View style={{ flex: 1, height: 1, backgroundColor: colors.hairline }} />
              </View>

              <Pressable
                onPress={() =>
                  Alert.alert('곧 만나요', '가족방은 다음 업데이트에 추가될 거예요')
                }
                style={({ pressed }) => ({
                  borderRadius: radius.lg,
                  padding: 18,
                  borderWidth: 1.5,
                  borderStyle: 'dashed',
                  borderColor: '#E8DDD3',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 14,
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <View
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 14,
                    backgroundColor: colors.peach,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 24 }}>👨‍👩‍👧</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '700',
                      color: colors.ink,
                      letterSpacing: -0.3,
                    }}
                  >
                    가족방 만들기
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: colors.inkSoft,
                      marginTop: 2,
                    }}
                  >
                    최대 6명까지 초대 가능
                  </Text>
                </View>
              </Pressable>
            </View>
          )}

          {mode === 'create' && (
            <View style={{ alignItems: 'center', padding: 24, gap: 20 }}>
              <Text
                style={{
                  color: colors.inkSoft,
                  marginTop: 10,
                  fontSize: 14,
                }}
              >
                가족·연인에게 이 코드를 알려주세요
              </Text>
              <View
                style={[
                  {
                    backgroundColor: colors.surface,
                    paddingHorizontal: 32,
                    paddingVertical: 28,
                    borderRadius: radius.xl,
                  },
                  shadow.card,
                ]}
              >
                <Text
                  style={{
                    fontSize: 44,
                    fontWeight: '800',
                    letterSpacing: 6,
                    color: colors.red,
                    fontVariant: ['tabular-nums'],
                  }}
                >
                  {creating ? '...' : code ?? '------'}
                </Text>
              </View>
              <Text style={{ color: colors.inkMuted, fontSize: 13 }}>
                24시간 동안 유효해요
              </Text>
              <View style={{ width: '100%', gap: 12, marginTop: 4 }}>
                <PressableButton label="공유하기" onPress={handleShareLink} />
                <PressableButton
                  label="복사하기"
                  variant="secondary"
                  onPress={handleCopy}
                />
                <PressableButton
                  label="다른 방법 선택"
                  variant="ghost"
                  onPress={() => setMode('methods')}
                />
              </View>
            </View>
          )}

          {mode === 'redeem' && (
            <View style={{ padding: 24, gap: 16 }}>
              <Text
                style={{
                  color: colors.inkSoft,
                  marginTop: 8,
                  fontSize: 14,
                }}
              >
                받은 6자리 코드를 입력해주세요
              </Text>
              <TextInput
                value={input}
                onChangeText={(t) => setInput(normalizeInviteCode(t))}
                autoCapitalize="characters"
                autoCorrect={false}
                placeholder="K7Q3M9"
                placeholderTextColor={colors.inkMuted}
                maxLength={6}
                style={[
                  {
                    backgroundColor: colors.surface,
                    padding: 22,
                    borderRadius: radius.xl,
                    fontSize: 36,
                    fontWeight: '700',
                    letterSpacing: 8,
                    textAlign: 'center',
                    color: colors.red,
                  },
                  shadow.card,
                ]}
              />
              <PressableButton
                label={signedIn ? '연결하기' : '먼저 로그인해주세요'}
                onPress={handleRedeem}
                disabled={!signedIn || input.length !== 6}
                loading={redeeming}
              />
              {signedIn && (
                <PressableButton
                  label="다른 방법 선택"
                  variant="ghost"
                  onPress={() => setMode('methods')}
                />
              )}
            </View>
          )}
        </ScrollView>

        <View
          style={{
            paddingHorizontal: 24,
            paddingBottom: 12,
            paddingTop: 4,
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              fontSize: 12,
              color: colors.inkMuted,
              lineHeight: 19,
            }}
          >
            연락처는 콕콕 친구 찾기에만 쓰여요.{'\n'}저장되거나 공유되지 않습니다.
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

function MethodCard({
  emoji,
  accent,
  title,
  sub,
  onPress,
}: {
  emoji: string;
  accent: string;
  title: string;
  sub: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: colors.surface,
          borderRadius: radius.lg,
          padding: 18,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
          opacity: pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
        shadow.card,
      ]}
    >
      <View
        style={{
          width: 46,
          height: 46,
          borderRadius: 14,
          backgroundColor: accent,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 24 }}>{emoji}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '700',
            color: colors.ink,
            letterSpacing: -0.3,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: colors.inkSoft,
            marginTop: 2,
            letterSpacing: -0.1,
          }}
        >
          {sub}
        </Text>
      </View>
      <Text style={{ fontSize: 18, color: colors.inkMuted }}>›</Text>
    </Pressable>
  );
}
