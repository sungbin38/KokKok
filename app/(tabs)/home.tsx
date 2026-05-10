import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import auth from '@react-native-firebase/auth';
import { useRelationships } from '@/firebase/firestore';
import { Avatar } from '@/components/Avatar';
import { KokLogo } from '@/components/KokLogo';
import { PressableButton } from '@/components/PressableButton';
import { colors, radius, shadow } from '@/theme';
import { getEmoji } from '@/data/emojis';
import { timeAgo } from '@/utils/time';

export default function Home() {
  const uid = auth().currentUser?.uid ?? null;
  const router = useRouter();
  const { items, loading } = useRelationships(uid);

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View
          style={{
            paddingHorizontal: 24,
            paddingTop: 12,
            paddingBottom: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <KokLogo size={32} animated={false} />
          <Pressable
            onPress={() => router.push('/invite')}
            style={({ pressed }) => ({
              paddingHorizontal: 14,
              paddingVertical: 8,
              backgroundColor: colors.redSoft,
              borderRadius: 999,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text
              style={{
                color: colors.red,
                fontWeight: '700',
                fontSize: 13,
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
              paddingBottom: 24,
              gap: 8,
            }}
            renderItem={({ item, index }) => {
              const nickname = item.nicknames?.[uid ?? ''] ?? '친구';
              const hue = [350, 30, 200, 280, 110, 50][index % 6];
              const lastEmoji = item.lastPokeEmojiId
                ? getEmoji(item.lastPokeEmojiId)
                : null;
              return (
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: '/poke/[relId]',
                      params: { relId: item.id },
                    })
                  }
                  style={({ pressed }) => [
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 16,
                      borderRadius: radius.lg,
                      backgroundColor: colors.surface,
                      gap: 16,
                      opacity: pressed ? 0.85 : 1,
                      transform: [{ scale: pressed ? 0.99 : 1 }],
                    },
                    shadow.cardSoft,
                  ]}
                >
                  <Avatar name={nickname} size={56} hue={hue} />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: '700',
                        color: colors.ink,
                        letterSpacing: -0.3,
                      }}
                    >
                      {nickname}
                    </Text>
                    <Text style={{ color: colors.inkSoft, marginTop: 2, fontSize: 13 }}>
                      {item.lastPokeAt ? timeAgo(item.lastPokeAt) : '아직 콕 없음'}
                    </Text>
                  </View>
                  {lastEmoji && (
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        backgroundColor: colors.surfaceAlt,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 24,
                          textShadowColor: 'rgba(0,0,0,0.18)',
                          textShadowOffset: { width: 0, height: 3 },
                          textShadowRadius: 4,
                        }}
                      >
                        {lastEmoji.fallback}
                      </Text>
                    </View>
                  )}
                </Pressable>
              );
            }}
          />
        )}
      </SafeAreaView>
    </View>
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
      <KokLogo size={56} />
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
