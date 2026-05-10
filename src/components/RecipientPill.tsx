import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Avatar } from './Avatar';
import { colors, shadow } from '@/theme';

interface Props {
  name: string;
  label: string;
  hue?: number;
  active?: boolean;
  dark?: boolean;
  onPress?: () => void;
}

/**
 * Pill-shaped chip with a small avatar + name + relationship label.
 * Used in the send screen's recipient switcher row.
 */
export function RecipientPill({
  name,
  label,
  hue = 18,
  active,
  dark,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 6,
        paddingLeft: 6,
        paddingRight: 14,
        borderRadius: 999,
        backgroundColor: active
          ? colors.red
          : dark
          ? colors.dSurfaceAlt
          : colors.surface,
        opacity: pressed ? 0.85 : 1,
        transform: [{ scale: pressed ? 0.97 : 1 }],
        ...(active ? shadow.redGlow : dark ? {} : shadow.cardSoft),
      })}
    >
      <Avatar name={name} size={32} hue={hue} />
      <View style={{ alignItems: 'flex-start' }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '700',
            letterSpacing: -0.2,
            color: active ? '#fff' : dark ? colors.dText : colors.ink,
          }}
        >
          {name}
        </Text>
        <Text
          style={{
            fontSize: 11,
            letterSpacing: -0.1,
            color: active
              ? 'rgba(255,255,255,0.85)'
              : dark
              ? colors.dTextSoft
              : colors.inkMuted,
          }}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
