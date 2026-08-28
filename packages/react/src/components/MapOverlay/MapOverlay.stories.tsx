import type { Meta, StoryObj } from "@storybook/react";
import { MapOverlay } from "./MapOverlay";
import { POICard } from "../POICard";

const meta = {
  title: "Map/MapOverlay",
  component: MapOverlay,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof MapOverlay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    position: "top-left",
    children: (
      <POICard
        title="Gate A12"
        subtitle="Departures"
        description="Overlay content remains interactive while the map remains pannable outside the content bounds."
      />
    ),
  },
  render: (args) => (
    <div className="relative h-[480px] bg-muted overflow-hidden rounded-container border">
      <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
        Map SDK renderer slot
      </div>
      <MapOverlay {...args} />
    </div>
  ),
};

export const BottomCenter: Story = {
  args: {
    ...Default.args,
    position: "bottom-center",
  },
  render: Default.render,
};
