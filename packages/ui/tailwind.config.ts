import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',   // UI 컴포넌트
    '../../.storybook/**/*.{js,ts,jsx,tsx,mdx}', // 스토리북 폴더 (루트 기준)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
