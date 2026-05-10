import { useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import auth from '@react-native-firebase/auth';
import { useUser, updateFavoriteEmojis } from '@/firebase/firestore';
import {
  CATEGORIES,
  DEFAULT_FAVORITES,
  EMOJI_CATALOG,
  type EmojiCategory,
} from '@/data/emojis';
import { EmojiBadge } from '@/components/EmojiBadge';
import { PressableButton } from '@/components/PressableButton';
import { colors, radius } from '@/theme';

const ALL: EmojiCategory | '전체' = '전체';

export default function PickerScreen() {
  const uid = auth().currentUser?.uid ?? null;
  const router = useRouter();
  const { user } = useUser(uid);
  const initial = user?.favoriteEmojis?.length
    ? user.favoriteEmojis.slice(0, 6)
    : [...DEFAULT_FAVORITES];
  const [favorites, setFavorites] = useState<string[]>(initial);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [category, setCategory] = useState<EmojiCategory | '전체'>(ALL);
  const [saving, setSaving] = useState(false);

  const visible = useMemo(
    () =>
      category === ALL
        ? EMOJI_CATALOG
        : EMOJI_CATALOG.filter((e) => e.category === category),
    [category],
  );

  function handleEmojiPress(id: string) {
    setFavorites((prev) => {
      const next = [...prev];
      // padding to 6
      while (next.length < 6) next.push('');
      const targetSlot =
        selectedSlot !== null
          ? selectedSlot
          : next.findIndex((s) => !s);
      if (targetSlot === -1) {
        // 모두 차있고 슬롯 미선택 → 첫 슬롯 교체
        next[0] = id;
      } else {
        next[targetSlot] = id;
      }
      setSelectedSlot(null);
      return next.slice(0, 6);
    });
  }

  function clearSlot(idx: number) {
    setFavorites((prev) => {
      const next = [...prev];
      next[idx] = '';
      return next;
    });
  }

  async function handleSave() {
    if (!uid) return;
    const filled = favorites.filter(Boolean);
    if (filled.length !== 6) {
      Alert.alert('6개를 다 채워주세요');
      return;
    }
    setSaving(true);
    try {
      await updateFavoriteEmojis(uid, filled);
      router.back();
    } catch (e: any) {
      Alert.alert('저장 실패', e?.message ?? String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView
      edges={['top']}
      style={{ flex: 1, backgroundColor: colors.paperWarm }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 16,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: '700', color: colors.ink }}>
          즐겨찾기 편집
        </Text>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Text style={{ fontSize: 22, color: colors.inkMuted }}>✕</Text>
        </Pressable>
      </View>

      <View
        style={{
          paddingHorizontal: 16,
          paddingBottom: 16,
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          backgroundColor: colors.white,
          marginHorizontal: 16,
          borderRadius: radius.lg,
          padding: 12,
          gap: 8,
        }}
      >
        {Array.from({ length: 6 }).map((_, idx) => {
          const id = favorites[idx];
          const selected = selectedSlot === idx;
          return id ? (
            <Pressable
              key={`slot-${idx}`}
              onPress={() => clearSlot(idx)}
              onLongPress={() => setSelectedSlot(idx)}
              style={{ width: '30%', alignItems: 'center', paddingVertical: 4 }}
            >
              <EmojiBadge emojiId={id} size="sm" disabled selected={selected} />
            </Pressable>
          ) : (
            <Pressable
              key={`slot-${idx}`}
              onPress={() => setSelectedSlot(idx)}
              style={{
                width: '30%',
                aspectRatio: 1,
                borderRadius: radius.md,
                borderWidth: 1.5,
                borderStyle: 'dashed',
                borderColor: selected ? colors.coral : colors.divider,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: colors.inkMuted, fontSize: 24 }}>+</Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingVertical: 8 }}
      >
        {([ALL, ...CATEGORIES] as const).map((cat) => (
          <Pressable
            key={cat}
            onPress={() => setCategory(cat)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 14,
              borderRadius: 999,
              backgroundColor:
                category === cat ? colors.coral : colors.paperCool,
            }}
          >
            <Text
              style={{
                color: category === cat ? colors.white : colors.inkSoft,
                fontWeight: '600',
              }}
            >
              {cat}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <FlatList
        data={visible}
        keyExtractor={(e) => e.id}
        numColumns={4}
        contentContainerStyle={{ padding: 16, paddingBottom: 96 }}
        columnWrapperStyle={{ justifyContent: 'space-between', marginVertical: 6 }}
        renderItem={({ item }) => (
          <View style={{ width: '23%', alignItems: 'center' }}>
            <EmojiBadge
              emojiId={item.id}
              size="sm"
              onPress={() => handleEmojiPress(item.id)}
              selected={favorites.includes(item.id)}
            />
          </View>
        )}
      />

      <View
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 24,
        }}
      >
        <PressableButton
          label="저장"
          onPress={handleSave}
          loading={saving}
          disabled={favorites.filter(Boolean).length !== 6}
        />
      </View>
    </SafeAreaView>
  );
}
