import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Focus, Info } from "lucide-react";
import { MapControlButton } from "./MapControlButton";

const meta = {
  title: "Product SDK/MapControlButton",
  component: MapControlButton,
  parameters: { layout: "centered" },
  args: { onClick: fn() },
} satisfies Meta<typeof MapControlButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IconOnly: Story = {
  args: {
    icon: <Info className="h-5 w-5" />,
    label: "Map information",
  },
};

export const LabelledState: Story = {
  args: {
    icon: <Focus className="h-5 w-5" />,
    label: "Focus",
    presentation: "labelled",
    pressed: false,
    stateLabel: "Off",
  },
};
