import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useRouter } from 'expo-router';
import { signInWithApple, signInWithGoogle } from '@/firebase/auth';
import { PressableButton } from '@/components/PressableButton';
import { KokLogo } from '@/components/KokLogo';
import { KokWord } from '@/components/KokWord';
import { colors } from '@/theme';
import { enableDemoMode } from '@/demo/demoMode';

const FLOATERS: { e: string; rot: number; dy: number; delay: number }[] = [
  { e: '❤️', rot: -10, dy: 8, delay: 0 },
  { e: '💋', rot: 6, dy: -6, delay: 150 },
  { e: '☝️', rot: -4, dy: 14, delay: 300 },
  { e: '🍔', rot: 10, dy: -2, delay: 450 },
];

export default function Onboarding() {
  const router = useRouter();
  const [loading, setLoading] = useState<'apple' | 'google' | null>(null);
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleSecretTap() {
    tapCountRef.current += 1;
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    if (tapCountRef.current >= 3) {
      tapCountRef.current = 0;
      enableDemoMode();
      router.replace('/(tabs)/home');
      return;
    }
    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, 1500);
  }

  async function handleApple() {
    try {
      setLoading('apple');
      await signInWithApple();
    } catch (e: any) {
      if (e?.code !== 'ERR_REQUEST_CANCELED') {
        Alert.alert('Apple 로그인 실패', e?.message ?? String(e));
      }
    } finally {
      setLoading(null);
    }
  }

  async function handleGoogle() {
    try {
      setLoading('google');
      await signInWithGoogle();
    } catch (e: any) {
      Alert.alert('Google 로그인 실패', e?.message ?? String(e));
    } finally {
      setLoading(null);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      {/* warm radial wash — fake with a translucent peach disk */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: -120,
          left: -80,
          right: -80,
          height: 460,
          borderRadius: 999,
          backgroundColor: colors.peach,
          opacity: 0.55,
        }}
      />

      <SafeAreaView style={{ flex: 1 }}>
        {/* floating poke previews */}
        <View
          pointerEvents="none"
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 14,
            marginTop: 60,
          }}
        >
          {FLOATERS.map((p, i) => (
            <Floater key={i} {...p} />
          ))}
        </View>

        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 28,
            gap: 16,
          }}
        >
          <KokLogo size={84} />

          <View style={{ marginTop: 18, alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 22,
                lineHeight: 30,
                fontWeight: '700',
                color: colors.ink,
                letterSpacing: -0.6,
                textAlign: 'center',
              }}
            >
              <Text>한 번의 </Text>
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
              <KokWord size={22} color={colors.red} />
              <Text
                style={{
                  fontSize: 22,
                  lineHeight: 30,
                  fontWeight: '700',
                  color: colors.ink,
                  letterSpacing: -0.6,
                }}
              >
                으로, 마음을 전합니다
              </Text>
            </View>
          </View>

          <Pressable onPress={handleSecretTap} hitSlop={12}>
            <Text
              style={{
                fontSize: 15,
                color: colors.inkSoft,
                textAlign: 'center',
                letterSpacing: -0.2,
                lineHeight: 22,
                marginTop: 6,
                maxWidth: 280,
              }}
            >
              긴 메시지 없이도 충분해요.{'\n'}아이콘 하나로 안부를 보내보세요.
            </Text>
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: 24, paddingBottom: 24, gap: 10 }}>
          {Platform.OS === 'ios' && (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={
                AppleAuthentication.AppleAuthenticationButtonType.CONTINUE
              }
              buttonStyle={
                AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
              }
              cornerRadius={28}
              style={{ height: 58 }}
              onPress={handleApple}
            />
          )}
          <PressableButton
            label={loading === 'google' ? '로그인 중...' : 'Google로 시작하기'}
            onPress={handleGoogle}
            variant={Platform.OS === 'ios' ? 'secondary' : 'primary'}
            loading={loading === 'google'}
          />
          <Pressable
            onPress={() => router.push('/invite')}
            style={({ pressed }) => ({
              padding: 12,
              opacity: pressed ? 0.6 : 1,
              alignItems: 'center',
            })}
          >
            <Text
              style={{
                color: colors.inkSoft,
                fontSize: 14,
                fontWeight: '500',
              }}
            >
              이미 초대 코드가 있어요
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

function Floater({
  e,
  rot,
  dy,
  delay,
}: {
  e: string;
  rot: number;
  dy: number;
  delay: number;
}) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, {
      toValue: 1,
      duration: 800,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [v, delay]);
  const opacity = v;
  const translateY = v.interpolate({
    inputRange: [0, 1],
    outputRange: [16 + dy, dy],
  });
  return (
    <Animated.Text
      style={{
        fontSize: 38,
        opacity,
        transform: [{ translateY }, { rotate: `${rot}deg` }],
        textShadowColor: 'rgba(0,0,0,0.12)',
        textShadowOffset: { width: 0, height: 8 },
        textShadowRadius: 14,
      }}
    >
      {e}
    </Animated.Text>
  );
}
