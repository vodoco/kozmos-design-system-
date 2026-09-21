import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import {
  Accessibility,
  Heart,
  Info,
  Search,
  ShoppingBag,
  Utensils,
} from "lucide-react";
import { BrowseCategoriesPanel } from "./BrowseCategoriesPanel";
import { SearchBar } from "../SearchBar";

const iconByName = {
  accessibility: <Accessibility className="h-8 w-8" />,
  favourite: <Heart className="h-8 w-8" />,
  information: <Info className="h-8 w-8" />,
  search: <Search className="h-8 w-8" />,
  shopping: <ShoppingBag className="h-8 w-8" />,
  dining: <Utensils className="h-8 w-8" />,
};

const meta = {
  title: "Product SDK/BrowseCategoriesPanel",
  component: BrowseCategoriesPanel,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="flex min-h-screen w-full items-center justify-center p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    categories: [
      {
        id: "favourites",
        label: "Favourites",
        iconName: "favourite",
        selected: false,
      },
      {
        id: "shopping",
        label: "Shopping",
        iconName: "shopping",
        selected: true,
      },
      { id: "dining", label: "Dining", iconName: "dining", selected: false },
      {
        id: "accessible",
        label: "Accessible places",
        iconName: "accessibility",
        selected: false,
      },
      {
        id: "information",
        label: "Information and help",
        iconName: "information",
        selected: false,
      },
    ],
    className: "h-[34rem] w-full max-w-[25rem]",
    onSelect: fn(),
    renderIcon: (category) =>
      iconByName[category.iconName as keyof typeof iconByName] ??
      iconByName.search,
    search: <SearchBar aria-label="Search places" />,
  },
} satisfies Meta<typeof BrowseCategoriesPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const categoryPalette = [
  "yellow",
  "orange",
  "turquoise",
  "red",
  "blue",
  "navy",
  "green",
  "pink",
];

/** Each tile in a category colour of its own, from the taxonomy's palette. */
export const Tinted: Story = {
  args: {
    tint: (category) => {
      const name =
        categoryPalette[
          [...category.id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) %
            categoryPalette.length
        ];
      return {
        accent: `var(--semantics-category-accent-${name})`,
        fill: `var(--semantics-category-fill-${name})`,
        onFill: `var(--semantics-category-on-fill-${name})`,
      };
    },
  },
};
