import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import { colors } from '@/theme';

interface Props {
  size?: number;
  dark?: boolean;
  animated?: boolean;
}

/**
 * "콕콕!" wordmark — the leading 콕 carries a bouncing red dot above its ㅗ.
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

  const dot = size * 0.2;
  const dotMargin = size * 0.18;
  const ink = dark ? colors.dText : colors.ink;
  const translateY = bob.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -size * 0.08],
  });

  const wordStyle = {
    fontSize: size,
    lineHeight: size * 1.05,
    fontWeight: '800' as const,
    color: ink,
    letterSpacing: -0.02 * size,
    includeFontPadding: false,
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
      <View style={{ paddingTop: dot + dotMargin }}>
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            marginLeft: -dot / 2,
            width: dot,
            height: dot,
            borderRadius: dot / 2,
            backgroundColor: colors.red,
            transform: [{ translateY }],
            shadowColor: colors.red,
            shadowOpacity: 0.45,
            shadowRadius: size * 0.14,
            shadowOffset: { width: 0, height: size * 0.05 },
            elevation: 4,
          }}
        />
        <Text style={wordStyle}>콕</Text>
      </View>
      <Text style={[wordStyle, { marginLeft: size * 0.04 }]}>콕</Text>
      <Text
        style={[
          wordStyle,
          { color: colors.red, marginLeft: size * 0.04 },
        ]}
      >
        !
      </Text>
    </View>
  );
}
