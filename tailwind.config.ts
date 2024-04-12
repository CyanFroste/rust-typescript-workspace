import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'
import tailwindAnimatePlugin from 'tailwindcss-animate'
import tailwindContainerQueries from '@tailwindcss/container-queries'
import path from 'path'

const config: Config = {
  darkMode: ['class'],
  content: [
    path.resolve(__dirname, 'app/src/**/*.{ts,tsx}'),
    path.resolve(__dirname, 'app/index.html'),
    path.resolve(__dirname, 'common/src/**/*.{ts,tsx}'),
    path.resolve(__dirname, 'extension/src/**/*.{ts,tsx}'),
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
        mono: ['var(--font-mono)', ...defaultTheme.fontFamily.mono],
      },
      colors: ({ colors }) => ({ base: colors.gray }),
    },
  },
  plugins: [tailwindAnimatePlugin, tailwindContainerQueries],
}

export default config
