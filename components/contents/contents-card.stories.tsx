import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ContentsHeader } from './contents-card';

const meta = {
  component: ContentsHeader,
} satisfies Meta<typeof ContentsHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "title"
  }
};