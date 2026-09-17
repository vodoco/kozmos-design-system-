import type { Meta, StoryObj } from "@storybook/react";
import { PasswordInput } from "./PasswordInput";
import { ThemeProvider } from "../ThemeProvider";

const meta = {
  title: "Components/PasswordInput",
  component: PasswordInput,
  args: {
    label: "Password",
    placeholder: "Enter password",
    helperText: "Use at least 12 characters.",
  },
} satisfies Meta<typeof PasswordInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Visible: Story = {
  args: {
    defaultValue: "CorrectHorseBatteryStaple",
    defaultVisible: true,
  },
};

export const Error: Story = {
  args: {
    error: "Password is required.",
  },
};

export const WithoutToggle: Story = {
  args: {
    showToggle: false,
  },
};

export const RightToLeft: Story = {
  render: (args) => (
    <ThemeProvider dir="rtl">
      <div style={{ width: 220 }}>
        <PasswordInput {...args} />
      </div>
    </ThemeProvider>
  ),
};
