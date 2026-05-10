// Design tokens — sourced from the KokKok design package (components.jsx KK).
// Warm cream background, red dot accent, generous radii.

export const colors = {
  // Surfaces
  bg: '#F0EEE9',
  cream: '#FFF7F1',
  surface: '#FFFFFF',
  surfaceAlt: '#FBF3EC',
  white: '#FFFFFF',

  // Ink ladder
  ink: '#1B1612',
  inkSoft: '#5C504A',
  inkMuted: '#9A8E86',
  hairline: 'rgba(27, 22, 18, 0.07)',
  divider: 'rgba(27, 22, 18, 0.07)',

  // Signature red — the "콕" dot
  red: '#FF3D52',
  redSoft: '#FFE2E5',
  redShadow: 'rgba(255, 61, 82, 0.40)',
  peach: '#FFD9C9',

  // Accent washes for method/setting tiles
  blueSoft: '#E4E8FF',
  greenSoft: '#E2F4EA',
  yellowSoft: '#FFF1C9',
  orangeSoft: '#FFE7D4',

  // Status
  online: '#34C285',
  danger: '#E63A40',

  // Dark mode
  dInk: '#0E0B09',
  dSurface: '#1A1613',
  dSurfaceAlt: '#241E1A',
  dText: '#FBF3EC',
  dTextSoft: 'rgba(251,243,236,0.62)',
  dHairline: 'rgba(255,255,255,0.08)',

  // Legacy aliases (existing screens still reference these names)
  coral: '#FF3D52',
  coralDark: '#E63A40',
  coralSoft: '#FFE2E5',
  paper: '#F0EEE9',
  paperWarm: '#FFF7F1',
  paperCool: '#FBF3EC',
} as const;

export const radius = {
  sm: 12,
  md: 18,
  lg: 22,
  xl: 28,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const shadow = {
  card: {
    shadowColor: '#6A4C3C',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  cardSoft: {
    shadowColor: '#1B1612',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  redGlow: {
    shadowColor: '#FF3D52',
    shadowOpacity: 0.4,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
} as const;
