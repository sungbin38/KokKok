/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        red: {
          DEFAULT: '#FF3D52',
          soft: '#FFE2E5',
        },
        cream: {
          DEFAULT: '#FFF7F1',
          alt: '#FBF3EC',
        },
        ink: {
          DEFAULT: '#1B1612',
          soft: '#5C504A',
          muted: '#9A8E86',
        },
        bg: '#F0EEE9',
        peach: '#FFD9C9',
        // legacy
        coral: {
          DEFAULT: '#FF3D52',
          50: '#FFF1F1',
          100: '#FFE2E5',
          500: '#FF3D52',
          600: '#E63A40',
        },
        paper: {
          DEFAULT: '#F0EEE9',
          warm: '#FFF7F1',
          cool: '#FBF3EC',
        },
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        kok: '22px',
        'kok-lg': '28px',
      },
    },
  },
  plugins: [],
};
