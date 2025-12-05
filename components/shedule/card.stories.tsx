import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ScheduleContentsCard } from './card';

const meta = {
  component: ScheduleContentsCard,
} satisfies Meta<typeof ScheduleContentsCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "柏まつり",
    year: "2024",
    month: "10",
    day: "14",
    weekDay: "tue"
  }
};