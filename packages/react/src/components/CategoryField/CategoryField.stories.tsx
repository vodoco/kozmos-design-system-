import type { Meta, StoryObj } from "@storybook/react";
import { Plane, UtensilsCrossed, Bookmark } from "lucide-react";
import { CategoryField } from "./CategoryField";
import { AISearchButton } from "../AISearchButton";
import { IconButton } from "../IconButton";
import { SlidersHorizontal } from "lucide-react";

const meta = {
  title: "Product SDK/CategoryField",
  component: CategoryField,
  parameters: { layout: "padded" },
  args: {
    label: "Gates",
    count: 2,
    tint: {
      accent: "var(--semantics-category-accent-yellow)",
      fill: "var(--semantics-category-fill-yellow)",
      onFill: "var(--semantics-category-on-fill-yellow)",
    },
    icon: <Plane />,
    onClear: () => undefined,
  },
} satisfies Meta<typeof CategoryField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** In the search row, as the prototype places it: the field's place, Filters and the AI search beside. */
export const InTheSearchRow: Story = {
  render: (args) => (
    <div className="flex max-w-[402px] items-center gap-2">
      <CategoryField {...args} className="flex-1" />
      <IconButton
        variant="outline"
        size="lg"
        aria-label="Filters"
        icon={<SlidersHorizontal />}
      />
      <AISearchButton />
    </div>
  ),
};

export const Dining: Story = {
  args: {
    label: "Dining",
    count: 19,
    tint: {
      accent: "var(--semantics-category-accent-orange)",
      fill: "var(--semantics-category-fill-orange)",
      onFill: "var(--semantics-category-on-fill-orange)",
    },
    icon: <UtensilsCrossed />,
  },
};

/** A personal tile in the theme's colour, no Filters beside it. */
export const Bookmarks: Story = {
  args: {
    label: "Bookmarks",
    count: 1,
    tint: {
      accent: "var(--primitives-colors-theme-700)",
      fill: "var(--components-primary-buttons-themed-button-background-idle)",
      onFill:
        "var(--components-primary-buttons-themed-button-foreground-content-idle)",
    },
    icon: <Bookmark />,
  },
};
