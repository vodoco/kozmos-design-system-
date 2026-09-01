import type { Meta, StoryObj } from "@storybook/react";
import { Bike, Navigation } from "lucide-react";
import { RouteSummary } from "./RouteSummary";

const meta = {
  title: "Map/RouteSummary",
  component: RouteSummary,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof RouteSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: {
    etaText: "12 min",
    distanceText: "1.8 km remaining",
    state: "active",
    transportModeIcon: <Bike className="h-5 w-5" />,
    onEndRoute: () => console.log("end route"),
  },
  render: (args) => (
    <div className="relative min-h-[280px] bg-muted/40">
      <RouteSummary {...args} />
    </div>
  ),
};

export const Preview: Story = {
  args: {
    etaText: "18 min",
    distanceText: "2 stops",
    state: "preview",
    transportModeIcon: <Navigation className="h-5 w-5" />,
    onEndRoute: () => console.log("end route"),
    onStartNavigation: () => console.log("start navigation"),
  },
  render: Active.render,
};
