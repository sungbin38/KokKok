import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { getEmoji } from '@/data/emojis';
import { colors, radius } from '@/theme';

type Size = 'sm' | 'md' | 'lg' | 'xl';

const SIZES: Record<
  Size,
  { box: number; glyph: number; image: number; pad: number; radius: number }
> = {
  sm: { box: 56, glyph: 32, image: 40, pad: 8, radius: 18 },
  md: { box: 80, glyph: 48, image: 60, pad: 12, radius: 22 },
  lg: { box: 120, glyph: 72, image: 92, pad: 16, radius: 28 },
  xl: { box: 220, glyph: 140, image: 184, pad: 20, radius: 36 },
};

interface Props {
  emojiId: string;
  size?: Size;
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  selected?: boolean;
  dark?: boolean;
}

/**
 * Lightweight emoji tile — used in pickers and history rows.
 * For the main 3x2 send grid, prefer KokCard (which adds ripple + label).
 */
export function EmojiBadge({
  emojiId,
  size = 'md',
  onPress,
  onLongPress,
  disabled,
  selected,
  dark,
}: Props) {
  const entry = getEmoji(emojiId);
  const dim = SIZES[size];

  const handlePress = () => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onPress?.();
  };

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={onLongPress}
      disabled={disabled}
      style={({ pressed }) => ({
        width: dim.box,
        height: dim.box,
        padding: dim.pad,
        borderRadius: dim.radius,
        backgroundColor: selected
          ? colors.redSoft
          : dark
          ? colors.dSurfaceAlt
          : colors.surfaceAlt,
        borderWidth: selected ? 2 : 0,
        borderColor: colors.red,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.7 : 1,
        transform: [{ scale: pressed ? 0.94 : 1 }],
      })}
    >
      {entry?.asset ? (
        <Image
          source={entry.asset}
          style={{ width: dim.image, height: dim.image }}
          resizeMode="contain"
        />
      ) : (
        <Text
          style={{
            fontSize: dim.glyph,
            lineHeight: dim.glyph * 1.05,
            textShadowColor: 'rgba(0,0,0,0.18)',
            textShadowOffset: { width: 0, height: 4 },
            textShadowRadius: 6,
          }}
        >
          {entry?.fallback ?? '❓'}
        </Text>
      )}
      {!entry && (
        <View
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: colors.surfaceAlt,
            borderRadius: radius.lg,
          }}
        />
      )}
    </Pressable>
  );
}
