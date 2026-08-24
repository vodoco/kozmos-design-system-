import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import type { POIPresentation } from "@kozmos/product-contracts";
import { POIResultCard } from "./POIResultCard";

const poi: POIPresentation = {
  id: "burger-king",
  name: "Burger King",
  categoryLabel: "Dining",
  floorId: "1",
  floorLabel: "First floor",
  buildingLabel: "Building A",
  media: [],
  availability: "open",
  availabilityLabel: "Open",
  actions: ["navigate", "favourite", "bookmark"],
};

const meta = {
  title: "Product SDK/POIResultCard",
  component: POIResultCard,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="flex min-h-screen w-full items-center justify-center p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    poi,
    onSelect: fn(),
    className: "w-full max-w-[24rem]",
    result: {
      poiId: poi.id,
      resultIndex: 1,
      selected: false,
      featured: false,
      floorId: poi.floorId,
      travelEstimate: { durationSeconds: 180, durationLabel: "3 min" },
    },
  },
} satisfies Meta<typeof POIResultCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FeaturedSelected: Story = {
  args: {
    result: {
      poiId: poi.id,
      resultIndex: 1,
      selected: true,
      featured: true,
      floorId: poi.floorId,
      travelEstimate: { durationSeconds: 180, durationLabel: "3 min" },
    },
  },
};
