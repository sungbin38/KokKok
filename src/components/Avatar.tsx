import React from 'react';
import { Image, Text, View } from 'react-native';

interface Props {
  uri?: string | null;
  name: string;
  size?: number;
  /** Hue (0–360) for the gradient-style background. Defaults to a warm tone. */
  hue?: number;
}

/**
 * Avatar with a single-letter initial. Background is a warm two-stop
 * gradient approximated with a tinted view (no native gradient dep).
 */
export function Avatar({ uri, name, size = 48, hue = 18 }: Props) {
  const initial = name.trim().charAt(0).toUpperCase() || '?';
  const top = `hsl(${hue}, 80%, 70%)`;
  const bottom = `hsl(${(hue + 30) % 360}, 80%, 60%)`;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bottom,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        shadowColor: '#1B1612',
        shadowOpacity: 0.12,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
      }}
    >
      {/* faux gradient — top-half lighter overlay */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: size / 2,
          backgroundColor: top,
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
          }}
        >
          {initial}
        </Text>
      )}
    </View>
  );
}
