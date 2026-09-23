import type { Meta, StoryObj } from "@storybook/react";
import { Itinerary } from "./Itinerary";

const meta = {
  title: "Map/Itinerary",
  component: Itinerary,
  parameters: { layout: "padded" },
  args: {
    origin: "Dunkin'",
    destination: "Airport Shuttles",
    steps: [
      {
        id: "1",
        instruction: "Take Elevator down to First Floor",
        type: "straight",
      },
      {
        id: "2",
        instruction: "Take Corridor to Garage B",
        type: "straight",
        current: true,
      },
      {
        id: "3",
        instruction: "Turn right onto the Walkway to Terminal B",
        type: "right",
      },
      { id: "4", instruction: "Destination", type: "destination" },
    ],
  },
} satisfies Meta<typeof Itinerary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoCurrentStep: Story = {
  args: { steps: meta.args.steps.map((step) => ({ ...step, current: false })) },
};
