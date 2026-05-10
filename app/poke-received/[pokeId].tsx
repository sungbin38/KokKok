import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  Pressable,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { getPoke, useUser } from '@/firebase/firestore';
import { useSendPoke } from '@/hooks/useSendPoke';
import { Avatar } from '@/components/Avatar';
import { PressableButton } from '@/components/PressableButton';
import { colors, shadow } from '@/theme';
import { DEFAULT_FAVORITES, getEmoji } from '@/data/emojis';
import type { PokeDoc } from '@/firebase/types';

export default function PokeReceived() {
  const { pokeId } = useLocalSearchParams<{ pokeId: string }>();
  const router = useRouter();
  const uid = auth().currentUser?.uid ?? null;
  const { user } = useUser(uid);
  const { send, pending } = useSendPoke();
  const [poke, setPoke] = useState<PokeDoc | null>(null);
  const [fromName, setFromName] = useState<string>('');
  const [replied, setReplied] = useState(false);

  useEffect(() => {
    if (!pokeId) return;
    (async () => {
      const p = await getPoke(pokeId);
      if (!p) {
        router.back();
        return;
      }
      setPoke(p);
      const fromSnap = await firestore()
        .collection('users')
        .doc(p.fromUid)
        .get();
      setFromName((fromSnap.data()?.displayName as string) ?? '누군가');
    })();
  }, [pokeId, router]);

  async function handleReply(emojiId: string) {
    if (!uid || !poke) return;
    try {
      await send({
        fromUid: uid,
        toUid: poke.fromUid,
        relId: poke.relId,
        emojiId,
        replyToPokeId: poke.id,
      });
      setReplied(true);
      setTimeout(() => router.back(), 800);
    } catch (e: any) {
      Alert.alert('답장 실패', e?.message ?? String(e));
    }
  }

  if (!poke) {
    return <View style={{ flex: 1, backgroundColor: 'rgba(15,15,16,0.6)' }} />;
  }

  const entry = getEmoji(poke.emojiId);
  const favorites = (
    user?.favoriteEmojis?.length ? user.favoriteEmojis : DEFAULT_FAVORITES
  ).slice(0, 3);
  // Make sure the original emoji is offered first.
  const quickReplies = Array.from(new Set([poke.emojiId, ...favorites])).slice(0, 3);

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      {/* radial wash — stack of softening tinted disks */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: -160,
          left: -120,
          right: -120,
          height: 540,
          borderRadius: 999,
          backgroundColor: colors.red,
          opacity: 0.18,
        }}
      />
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: -80,
          left: -40,
          right: -40,
          height: 360,
          borderRadius: 999,
          backgroundColor: colors.peach,
          opacity: 0.35,
        }}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 18,
            paddingTop: 8,
            height: 44,
          }}
        >
          <View style={{ width: 40 }} />
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 999,
              backgroundColor: 'rgba(27,22,18,0.05)',
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text
              style={{
                color: colors.ink,
                fontSize: 13,
                fontWeight: '600',
              }}
            >
              나중에
            </Text>
          </Pressable>
        </View>

        {/* sender row */}
        <View
          style={{
            paddingHorizontal: 24,
            paddingTop: 8,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            justifyContent: 'center',
          }}
        >
          <Avatar name={fromName} size={28} hue={350} />
          <Text style={{ fontSize: 14, color: colors.inkSoft, fontWeight: '600' }}>
            <Text style={{ color: colors.ink, fontWeight: '700' }}>{fromName}</Text>
            님이
            <Text style={{ color: colors.red, fontWeight: '800' }}> 콕! </Text>
            보냈어요
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <AuraRing delay={0} />
          <AuraRing delay={800} />
          <AuraRing delay={1600} />
          <PulseCircle>
            <Text
              style={{
                fontSize: 168,
                lineHeight: 180,
                textShadowColor: 'rgba(0,0,0,0.22)',
                textShadowOffset: { width: 0, height: 16 },
                textShadowRadius: 22,
              }}
            >
              {entry?.fallback ?? '❓'}
            </Text>
          </PulseCircle>
        </View>

        <View style={{ paddingHorizontal: 24, paddingBottom: 28 }}>
          <View style={{ alignItems: 'center', marginBottom: 18 }}>
            <Text
              style={{
                fontSize: 26,
                fontWeight: '800',
                color: colors.ink,
                letterSpacing: -0.6,
              }}
            >
              "{entry?.name ?? '콕'}"
            </Text>
            <Text style={{ fontSize: 13, color: colors.inkSoft, marginTop: 6 }}>
              지금 막 도착했어요
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              gap: 8,
              justifyContent: 'center',
              marginBottom: 12,
              flexWrap: 'wrap',
            }}
          >
            {quickReplies.map((id) => {
              const ent = getEmoji(id);
              return (
                <Pressable
                  key={id}
                  onPress={() => handleReply(id)}
                  disabled={pending || replied}
                  style={({ pressed }) => [
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                      paddingVertical: 8,
                      paddingLeft: 10,
                      paddingRight: 14,
                      borderRadius: 999,
                      backgroundColor: colors.surface,
                      opacity: pressed ? 0.7 : 1,
                    },
                    shadow.cardSoft,
                  ]}
                >
                  <Text style={{ fontSize: 18 }}>{ent?.fallback}</Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '600',
                      color: colors.ink,
                      letterSpacing: -0.2,
                    }}
                  >
                    {ent?.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <PressableButton
            label={replied ? '답장 콕 보냄!' : '답장 콕 보내기'}
            onPress={() => handleReply(poke.emojiId)}
            loading={pending}
            disabled={replied}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

function AuraRing({ delay }: { delay: number }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(v, {
          toValue: 1,
          duration: 2400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(v, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [v, delay]);
  const scale = v.interpolate({ inputRange: [0, 1], outputRange: [0.4, 2.3] });
  const opacity = v.interpolate({ inputRange: [0, 1], outputRange: [0.8, 0] });
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor: colors.red,
        opacity,
        transform: [{ scale }],
      }}
    />
  );
}

function PulseCircle({ children }: { children: React.ReactNode }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(v, {
      toValue: 1,
      friction: 6,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [v]);
  const scale = v.interpolate({
    inputRange: [0, 0.5, 0.7, 1],
    outputRange: [0.6, 1.1, 0.96, 1],
  });
  const opacity = v;
  return (
    <Animated.View
      style={{
        width: 260,
        height: 260,
        borderRadius: 130,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ scale }],
        opacity,
        shadowColor: colors.red,
        shadowOpacity: 0.18,
        shadowRadius: 80,
        shadowOffset: { width: 0, height: 30 },
        elevation: 10,
      }}
    >
      {children}
    </Animated.View>
  );
}
