import type { Meta, StoryObj } from "@storybook/react";
import { MapControlsGroup } from "./MapControlsGroup";

const meta = {
  title: "Map/MapControlsGroup",
  component: MapControlsGroup,
  parameters: { layout: "centered" },
} satisfies Meta<typeof MapControlsGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    compassBearing: 32,
    onZoomIn: () => console.log("zoom in"),
    onZoomOut: () => console.log("zoom out"),
    onCompassReset: () => console.log("reset bearing"),
    onMyLocation: () => console.log("locate me"),
  },
};

export const ZoomOnly: Story = {
  args: {
    onZoomIn: () => console.log("zoom in"),
    onZoomOut: () => console.log("zoom out"),
  },
};
