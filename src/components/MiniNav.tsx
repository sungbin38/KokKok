import React, { type ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '@/theme';

interface NavProps {
  left?: ReactNode;
  right?: ReactNode;
  dark?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Phone-internal status bar — small 44pt row with optional left/right
 * icon buttons. Sits below the device safe area.
 */
export function MiniNav({ left, right, style }: NavProps) {
  return (
    <View
      style={[
        {
          height: 44,
          paddingHorizontal: 18,
          paddingTop: 8,
          paddingBottom: 2,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        style,
      ]}
    >
      <View style={{ minWidth: 40 }}>{left}</View>
      <View style={{ minWidth: 40, alignItems: 'flex-end' }}>{right}</View>
    </View>
  );
}

interface IconBtnProps {
  onPress?: () => void;
  dark?: boolean;
  children: ReactNode;
}

export function NavIconButton({ onPress, dark = false, children }: IconBtnProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => ({
        width: 40,
        height: 40,
        borderRadius: 999,
        backgroundColor: dark
          ? 'rgba(255,255,255,0.06)'
          : 'rgba(27,22,18,0.04)',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.7 : 1,
      })}
    >
      {children}
    </Pressable>
  );
}

/** Common chevron icons rendered with simple Text glyphs (no SVG dep). */
export const NavGlyph = {
  back: (color = colors.ink, size = 22) => (
    <View
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: size * 0.45,
          height: size * 0.45,
          borderLeftWidth: 2.2,
          borderBottomWidth: 2.2,
          borderColor: color,
          transform: [{ rotate: '45deg' }],
          marginLeft: 3,
          borderRadius: 1,
        }}
      />
    </View>
  ),
};
