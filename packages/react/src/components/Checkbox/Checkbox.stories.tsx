import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./Checkbox";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Accept terms and conditions",
  },
};

export const Checked: Story = {
  args: {
    checked: true,
    label: "Accept terms and conditions",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: "Accept terms and conditions",
  },
};

export const Error: Story = {
  args: {
    error: true,
    label: "Accept terms and conditions",
  },
};
