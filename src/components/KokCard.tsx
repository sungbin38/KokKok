import React, { useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, radius, shadow } from '@/theme';
import { getEmoji, type EmojiEntry } from '@/data/emojis';

type Size = 'sm' | 'md' | 'lg';

const DIMS: Record<
  Size,
  { w: number; h: number; emoji: number; image: number; radius: number }
> = {
  sm: { w: 80, h: 90, emoji: 44, image: 56, radius: 20 },
  md: { w: 100, h: 116, emoji: 56, image: 72, radius: 22 },
  lg: { w: 156, h: 168, emoji: 76, image: 100, radius: 28 },
};

interface Props {
  emojiId: string;
  /** Override label — defaults to the emoji entry's name. */
  label?: string | null;
  /** Tone wash color for the soft radial inside the card. */
  tone?: string;
  size?: Size;
  dark?: boolean;
  ripple?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

interface Burst {
  id: number;
}

/**
 * Rounded-square card with a 3D emoji + label and a tap ripple in the
 * card's tone. The card is the primary tap target on the send screen.
 */
export function KokCard({
  emojiId,
  label,
  tone = colors.red,
  size = 'md',
  dark = false,
  ripple = true,
  disabled,
  onPress,
  onLongPress,
  style,
}: Props) {
  const dim = DIMS[size];
  const entry: EmojiEntry | undefined = getEmoji(emojiId);
  const showLabel = label !== null;
  const [bursts, setBursts] = useState<Burst[]>([]);
  const burstId = useRef(0);
  const press = useRef(new Animated.Value(0)).current;

  const handlePressIn = () =>
    Animated.timing(press, {
      toValue: 1,
      duration: 90,
      useNativeDriver: true,
    }).start();

  const handlePressOut = () =>
    Animated.timing(press, {
      toValue: 0,
      duration: 140,
      easing: Easing.bezier(0.2, 0.7, 0.2, 1),
      useNativeDriver: true,
    }).start();

  const handlePress = () => {
    if (disabled) return;
    if (ripple) {
      const id = ++burstId.current;
      setBursts((b) => [...b, { id }]);
      setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 700);
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onPress?.();
  };

  const scale = press.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.94],
  });

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
    >
      <Animated.View
        style={[
          styles.card,
          {
            width: dim.w,
            height: dim.h,
            borderRadius: dim.radius,
            backgroundColor: dark ? colors.dSurfaceAlt : colors.surface,
            transform: [{ scale }],
          },
          dark ? styles.cardDark : shadow.card,
          style,
        ]}
      >
        {/* tone wash — subtle radial-ish overlay */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: dim.h * 0.6,
            backgroundColor: tone,
            opacity: 0.08,
            borderTopLeftRadius: dim.radius,
            borderTopRightRadius: dim.radius,
          }}
        />

        {entry?.asset ? (
          <Image
            source={entry.asset}
            style={{ width: dim.image, height: dim.image }}
            resizeMode="contain"
          />
        ) : (
          <Text
            style={{
              fontSize: dim.emoji,
              lineHeight: dim.emoji * 1.05,
              textShadowColor: 'rgba(0,0,0,0.18)',
              textShadowOffset: { width: 0, height: 4 },
              textShadowRadius: 6,
            }}
          >
            {entry?.fallback ?? '❓'}
          </Text>
        )}

        {showLabel && (
          <Text
            numberOfLines={1}
            style={{
              marginTop: 6,
              fontSize: 13,
              fontWeight: '600',
              color: dark ? colors.dTextSoft : colors.inkSoft,
              letterSpacing: -0.2,
            }}
          >
            {label ?? entry?.name ?? ''}
          </Text>
        )}

        {/* ripple bursts */}
        {bursts.map((b) => (
          <Burst key={b.id} tone={tone} radius={dim.radius} size={dim.w} />
        ))}
      </Animated.View>
    </Pressable>
  );
}

function Burst({
  tone,
  radius: rad,
  size,
}: {
  tone: string;
  radius: number;
  size: number;
}) {
  const v = useRef(new Animated.Value(0)).current;
  useRef<boolean>(false);
  // start once
  React.useEffect(() => {
    Animated.timing(v, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [v]);
  const scale = v.interpolate({ inputRange: [0, 1], outputRange: [0.4, 2.6] });
  const opacity = v.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0] });
  return (
    <View
      pointerEvents="none"
      style={{
        ...StyleSheet.absoluteFillObject,
        borderRadius: rad,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Animated.View
        style={{
          width: size * 1.4,
          height: size * 1.4,
          borderRadius: size * 0.7,
          backgroundColor: tone,
          opacity,
          transform: [{ scale }],
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cardDark: {
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
});
