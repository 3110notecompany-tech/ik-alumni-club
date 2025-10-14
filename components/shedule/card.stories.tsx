import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ScheduleContentsCard } from './card';

const meta = {
  component: ScheduleContentsCard,
} satisfies Meta<typeof ScheduleContentsCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "title",
    date: "2025-10-14"
  }
};