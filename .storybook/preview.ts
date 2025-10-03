import type { Preview } from '@storybook/nextjs-vite'
import '../app/globals.css'
import { ne } from 'drizzle-orm';
import next from 'next';

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    },

    nextjs: {
      appDirectory: true,
      nextConfigPath: '../next.config.js'
    }
  },
};

export default preview;