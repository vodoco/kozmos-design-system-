import type { Meta, StoryObj } from "@storybook/react";
import { Navigation, Radio } from "lucide-react";
import { DynamicIsland } from "./DynamicIsland";

const meta = {
  title: "Platform/DynamicIsland",
  component: DynamicIsland,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof DynamicIsland>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Compact: Story = {
  args: {
    islandState: "compact",
    compactLeading: <Navigation className="h-4 w-4 text-green-400" />,
    compactTrailing: <span className="text-xs font-semibold">1.2 km</span>,
  },
};

export const Expanded: Story = {
  args: {
    islandState: "expanded",
    expandedContent: (
      <div className="flex h-full flex-col justify-center gap-2">
        <span className="text-xs font-semibold uppercase">Next turn</span>
        <span className="text-xl font-semibold">Turn right on Main St</span>
      </div>
    ),
  },
};

export const Minimal: Story = {
  args: {
    islandState: "minimal",
    minimalContent: <Radio className="h-5 w-5 text-green-400" />,
  },
};
