import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import {
  TaxonomyAmenitySpaceDesk,
  TaxonomyEntranceExit,
  TaxonomyFoodBeverageSpace,
  TaxonomyParkingSpace,
  TaxonomyRetailSpace,
  TaxonomySecuritySpace,
  TaxonomyServiceSpaceOffice,
  TaxonomyTransportationSpaceBoardingGate,
} from "@kozmos-ds/icons";
import {
  Heart,
  InfoCircle as Info,
  SearchMd as Search,
  ShoppingBag01 as ShoppingBag,
} from "@kozmos-ds/icons";
import { Accessibility, Utensils } from "@kozmos-ds/icons";
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

/**
 * The aviation quick access at 10.12.0 — the taxonomy's first eight
 * categories, each with the symbol and the colour it publishes — as the SDK's
 * bar shows it and the Figma set draws it.
 */
const aviationQuickAccess = [
  {
    id: "entrances-exits",
    label: "Entrances & Exits",
    colour: "green",
    Symbol: TaxonomyEntranceExit,
    count: 6,
  },
  {
    id: "check-in-baggage",
    label: "Check-in & Baggage",
    colour: "turquoise",
    Symbol: TaxonomyServiceSpaceOffice,
    count: 14,
  },
  {
    id: "security-immigration",
    label: "Security & Immigration",
    colour: "red",
    Symbol: TaxonomySecuritySpace,
    count: 5,
  },
  {
    id: "gates",
    label: "Gates",
    colour: "yellow",
    Symbol: TaxonomyTransportationSpaceBoardingGate,
    count: 88,
  },
  {
    id: "customer-service",
    label: "Customer Service",
    colour: "blue",
    Symbol: TaxonomyAmenitySpaceDesk,
    count: 9,
  },
  {
    id: "parking-ground-transport",
    label: "Parking & Ground Transport",
    colour: "navy",
    Symbol: TaxonomyParkingSpace,
    count: 22,
  },
  {
    id: "dining",
    label: "Dining",
    colour: "orange",
    Symbol: TaxonomyFoodBeverageSpace,
    count: 37,
  },
  {
    id: "shopping",
    label: "Shopping",
    colour: "pink",
    Symbol: TaxonomyRetailSpace,
    count: 41,
  },
];

export const AviationQuickAccess: Story = {
  args: {
    categories: aviationQuickAccess.map(({ id, label, count }) => ({
      id,
      label,
      resultCount: count,
      selected: false,
    })),
    renderIcon: (category) => {
      const entry = aviationQuickAccess.find(({ id }) => id === category.id);
      const Symbol = entry ? entry.Symbol : TaxonomyEntranceExit;
      return <Symbol aria-hidden="true" />;
    },
    tint: (category) => {
      const entry = aviationQuickAccess.find(({ id }) => id === category.id);
      if (!entry) return undefined;
      return {
        accent: `var(--semantics-category-accent-${entry.colour})`,
        fill: `var(--semantics-category-fill-${entry.colour})`,
        onFill: `var(--semantics-category-on-fill-${entry.colour})`,
      };
    },
  },
};

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
