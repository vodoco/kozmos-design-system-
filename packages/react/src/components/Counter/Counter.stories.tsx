import type { Meta, StoryObj } from "@storybook/react";
import { Counter } from "./Counter";

const meta = {
  title: "Components/Counter",
  component: Counter,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Counter>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "2",
  },
};

export const Brand: Story = {
  args: {
    children: "12",
    tone: "brand",
  },
};

export const Small: Story = {
  args: {
    children: "4",
    size: "sm",
  },
};

export const Destructive: Story = {
  args: {
    children: "3",
    tone: "destructive",
  },
};
