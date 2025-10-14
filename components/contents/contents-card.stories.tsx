import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ContentsCard } from "./contents-card";

const meta = {
  component: ContentsCard,
} satisfies Meta<typeof ContentsCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "title",
    date: "2023/01/01",
  },
};
