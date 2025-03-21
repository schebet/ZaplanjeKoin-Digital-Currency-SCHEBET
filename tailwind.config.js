/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8B4513',
          dark: '#654321',
        }
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      height: {
        screen: ['100vh /* fallback */', '100dvh'],
      },
      minHeight: {
        screen: ['100vh /* fallback */', '100dvh'],
      },
      maxHeight: {
        screen: ['100vh /* fallback */', '100dvh'],
      },
    },
  },
  plugins: [],
};