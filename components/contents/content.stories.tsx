import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Contents } from "./content";

const meta = {
  component: Contents,
} satisfies Meta<typeof Contents>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "title",
    items: [
      { title: "次回のイベント案内", date: "2025-10-15" },
      { title: "会員限定セミナー開催のお知らせ", date: "2025-10-10" },
      { title: "新メンバー紹介", date: "2025-10-05" },
      { title: "活動報告：10月第1週", date: "2025-10-01" },
    ],
  },
};
