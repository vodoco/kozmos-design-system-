import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { LocationPin } from "./LocationPin";

const meta: Meta<typeof LocationPin> = {
  title: "Product SDK/LocationPin",
  component: LocationPin,
  parameters: { layout: "centered" },
  args: { onClick: fn() },
};

export default meta;
type Story = StoryObj<typeof LocationPin>;

export const Default: Story = {
  args: {
    label: "Selected place",
    variant: "primary",
    size: "md",
  },
};

export const NumberedSelected: Story = {
  args: {
    label: "Result 2, Burger King, selected",
    number: 2,
    selected: true,
    featured: true,
  },
};

export const ExternalLabel: Story = {
  args: {
    label: "Baskin-Robbins, second floor",
    externalLabel: "Baskin-Robbins",
    labelPlacement: "bottom",
  },
};

/** A pin in a category's colours: the fill as the marker, its ink on the number. */
export const Tinted: Story = {
  args: {
    label: "Dining",
    number: 3,
    tint: {
      accent: "var(--semantics-category-accent-red)",
      fill: "var(--semantics-category-fill-red)",
      onFill: "var(--semantics-category-on-fill-red)",
    },
  },
};
