import React from 'react';
import { Text, View } from 'react-native';
import { colors } from '@/theme';

interface Props {
  size?: number;
  color?: string;
  dotColor?: string;
}

/**
 * Inline 콕 with the signature red dot floating above the character —
 * used inside headlines like "지금 콕 찔러보세요".
 */
export function KokWord({ size = 28, color, dotColor }: Props) {
  const dot = size * 0.18;
  return (
    <View style={{ alignItems: 'center', justifyContent: 'flex-end' }}>
      <View
        style={{
          width: dot,
          height: dot,
          borderRadius: dot / 2,
          backgroundColor: dotColor ?? colors.red,
          marginBottom: size * 0.06,
          shadowColor: colors.red,
          shadowOpacity: 0.35,
          shadowRadius: size * 0.16,
          shadowOffset: { width: 0, height: size * 0.04 },
          elevation: 2,
        }}
      />
      <Text
        style={{
          fontSize: size,
          lineHeight: size * 1.05,
          fontWeight: '800',
          color: color ?? colors.ink,
          letterSpacing: -0.7,
        }}
      >
        콕
      </Text>
    </View>
  );
}
