import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import { colors } from '@/theme';

interface Props {
  size?: number;
  dark?: boolean;
  animated?: boolean;
}

/**
 * "콕콕!" wordmark — the leading 콕 carries a bouncing red dot.
 */
export function KokLogo({ size = 56, dark = false, animated = true }: Props) {
  const bob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animated) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bob, {
          toValue: 0,
          duration: 800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [animated, bob]);

  const dot = size * 0.22;
  const ink = dark ? colors.dText : colors.ink;
  const translateY = bob.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -size * 0.08],
  });

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
      }}
    >
      <View style={{ paddingTop: size * 0.32 }}>
        <Animated.View
          style={{
            position: 'absolute',
            left: '50%',
            marginLeft: -dot / 2,
            top: size * 0.04,
            width: dot,
            height: dot,
            borderRadius: dot / 2,
            backgroundColor: colors.red,
            transform: [{ translateY }],
            shadowColor: colors.red,
            shadowOpacity: 0.5,
            shadowRadius: size * 0.16,
            shadowOffset: { width: 0, height: size * 0.05 },
            elevation: 4,
          }}
        />
        <Text
          style={{
            fontSize: size,
            lineHeight: size * 1.05,
            fontWeight: '800',
            color: ink,
            letterSpacing: -0.02 * size,
          }}
        >
          콕
        </Text>
      </View>
      <Text
        style={{
          fontSize: size,
          lineHeight: size * 1.05,
          fontWeight: '800',
          color: ink,
          letterSpacing: -0.02 * size,
        }}
      >
        콕
      </Text>
      <Text
        style={{
          fontSize: size,
          lineHeight: size * 1.05,
          fontWeight: '800',
          color: colors.red,
          marginLeft: size * 0.04,
        }}
      >
        !
      </Text>
    </View>
  );
}
