import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { getEmoji } from '@/data/emojis';
import { colors } from '@/theme';

interface Props {
  message: string;
  emojiId?: string;
  dark?: boolean;
  /** Top offset from the parent. Defaults to 64 like the design. */
  top?: number;
}

/**
 * Top-of-screen pill toast with a row of floating heart particles.
 * Mount when a poke is sent; unmount after ~2.2s.
 */
export function KokToast({ message, emojiId, dark = false, top = 64 }: Props) {
  const slide = useRef(new Animated.Value(0)).current;
  const entry = emojiId ? getEmoji(emojiId) : null;

  useEffect(() => {
    Animated.timing(slide, {
      toValue: 1,
      duration: 420,
      easing: Easing.bezier(0.2, 0.8, 0.2, 1),
      useNativeDriver: true,
    }).start();
  }, [slide]);

  const translateY = slide.interpolate({
    inputRange: [0, 1],
    outputRange: [-80, 0],
  });
  const opacity = slide;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.wrap,
        { top, transform: [{ translateY }], opacity },
      ]}
    >
      <View
        style={[
          styles.pill,
          {
            backgroundColor: dark
              ? 'rgba(36,30,26,0.94)'
              : 'rgba(27,22,18,0.94)',
          },
        ]}
      >
        {entry && (
          <Text style={styles.emoji}>{entry.fallback}</Text>
        )}
        <Text style={styles.message}>{message}</Text>
      </View>
      <View pointerEvents="none" style={styles.heartLayer}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Heart key={i} index={i} />
        ))}
      </View>
    </Animated.View>
  );
}

function Heart({ index }: { index: number }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, {
      toValue: 1,
      duration: 1100,
      delay: index * 60,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [v, index]);
  const dx = (index - 2) * 14;
  const translateY = v.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -120],
  });
  const translateX = v.interpolate({
    inputRange: [0, 1],
    outputRange: [0, dx],
  });
  const opacity = v.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [0, 1, 0],
  });
  const scale = v.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1.1],
  });
  return (
    <Animated.Text
      style={{
        position: 'absolute',
        fontSize: 14,
        color: colors.red,
        opacity,
        transform: [{ translateX }, { translateY }, { scale }],
      }}
    >
      ❤
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    zIndex: 80,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingLeft: 14,
    paddingRight: 18,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  emoji: {
    fontSize: 22,
    lineHeight: 24,
  },
  message: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  heartLayer: {
    position: 'absolute',
    top: 18,
    left: 0,
    right: 0,
    alignItems: 'center',
    height: 0,
  },
});
