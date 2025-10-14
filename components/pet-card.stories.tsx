import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PetCard } from "./pet-card";
import { expect, within } from "storybook/test";

const meta = {
  component: PetCard,
} satisfies Meta<typeof PetCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    pet: {
      id: "",
      name: "Buddy",
      type: "dog",
      hp: 3,
      ownerId: "",
    },
  },
};

export const 長い名前: Story = {
  args: {
    pet: {
      id: "",
      name: "BuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddyBuddy",
      type: "dog",
      hp: 3,
      ownerId: "",
    },
  },
};

export const HPゼロ: Story = {
  args: {
    pet: {
      id: "",
      name: "Buddy",
      type: "dog",
      hp: 0,
      ownerId: "",
    },
  },
};

export const HP100: Story = {
  args: {
    pet: {
      id: "",
      name: "Buddy",
      type: "dog",
      hp: 100,
      ownerId: "",
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("HPが100で表示される", async () => {
      const hpText = canvas.getByText("元気 (100/100)");
      expect(hpText).toBeVisible();
    });
    await step("HPが緑になること", async () => {
      const hpBar = canvas.getByRole("progressbar");
      expect(hpBar).toHaveClass("bg-green-500");
    });
  },
};
