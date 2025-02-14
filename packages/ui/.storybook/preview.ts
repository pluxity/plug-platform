import '../src/index.css';  // Tailwind CSS 파일 경로
import type { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {
    actions: { 
      
     },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
