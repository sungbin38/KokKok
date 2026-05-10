import React from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import { colors, radius, shadow } from '@/theme';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  dark?: boolean;
}

export function PressableButton({
  label,
  onPress,
  variant = 'primary',
  loading,
  disabled,
  dark,
}: Props) {
  const palette = (() => {
    switch (variant) {
      case 'primary':
        return {
          bg: colors.red,
          fg: '#fff',
          shadow: shadow.redGlow,
        };
      case 'secondary':
        return {
          bg: dark ? colors.dSurfaceAlt : colors.surface,
          fg: dark ? colors.dText : colors.ink,
          shadow: shadow.cardSoft,
        };
      case 'ghost':
        return { bg: 'transparent', fg: colors.inkSoft, shadow: undefined };
      case 'danger':
        return { bg: colors.danger, fg: '#fff', shadow: shadow.redGlow };
    }
  })();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => ({
        backgroundColor: palette.bg,
        paddingVertical: 18,
        paddingHorizontal: 22,
        borderRadius: radius.xl,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 58,
        opacity: disabled ? 0.4 : pressed ? 0.92 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
        ...(palette.shadow ?? {}),
      })}
    >
      {loading ? (
        <ActivityIndicator color={palette.fg} />
      ) : (
        <Text
          style={{
            color: palette.fg,
            fontSize: 17,
            fontWeight: '700',
            letterSpacing: -0.3,
          }}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}
