import React from 'react';
import { Image, Text, View } from 'react-native';

interface Props {
  uri?: string | null;
  name: string;
  size?: number;
  /** Hue (0–360) for the avatar tint. Defaults to a warm tone. */
  hue?: number;
}

export function Avatar({ uri, name, size = 48, hue = 18 }: Props) {
  const initial = name.trim().charAt(0).toUpperCase() || '?';
  const base = `hsl(${hue}, 72%, 64%)`;
  const highlight = `hsla(${hue}, 90%, 90%, 0.55)`;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: base,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        shadowColor: '#1B1612',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
      }}
    >
      <View
        style={{
          position: 'absolute',
          top: -size * 0.25,
          left: -size * 0.1,
          width: size * 0.7,
          height: size * 0.7,
          borderRadius: size,
          backgroundColor: highlight,
        }}
      />
      {uri ? (
        <Image source={{ uri }} style={{ width: size, height: size }} />
      ) : (
        <Text
          style={{
            color: '#fff',
            fontSize: size * 0.42,
            fontWeight: '700',
            letterSpacing: -0.5,
            includeFontPadding: false,
          }}
        >
          {initial}
        </Text>
      )}
    </View>
  );
}
