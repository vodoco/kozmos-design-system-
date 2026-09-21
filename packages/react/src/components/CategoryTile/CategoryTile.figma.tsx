import figma from "@figma/code-connect";
import { CategoryTile, type CategoryTileProps } from "./CategoryTile";

const categoryTileUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8039";

// What the caller supplies, typed from the component's own props so the
// example type-checks against them; Code Connect renders the names as written.
declare const categoryIcon: CategoryTileProps["icon"];
declare const selectCategory: CategoryTileProps["onSelect"];

// The Tint axis: Theme is a tile with no tint; the eight are the taxonomy's
// quick-access colours as the Semantics.Category tokens' CSS variables — the
// accent, the fill and the ink that reads on it.
const tintFor = (name: string) => ({
  accent: `var(--semantics-category-accent-${name})`,
  fill: `var(--semantics-category-fill-${name})`,
  onFill: `var(--semantics-category-on-fill-${name})`,
});

figma.connect(CategoryTile, categoryTileUrl, {
  props: {
    label: figma.string("Label Text"),
    selected: figma.enum("State", {
      Default: false,
      Selected: true,
      Disabled: false,
    }),
    disabled: figma.enum("State", {
      Default: false,
      Selected: false,
      Disabled: true,
    }),
    tint: figma.enum("Tint", {
      Theme: undefined,
      Yellow: tintFor("yellow"),
      Orange: tintFor("orange"),
      Turquoise: tintFor("turquoise"),
      Red: tintFor("red"),
      Blue: tintFor("blue"),
      Navy: tintFor("navy"),
      Green: tintFor("green"),
      Pink: tintFor("pink"),
    }),
    // Show Count is category.resultCount being set; the number itself is the
    // nested Counter's text, which is product data.
    resultCount: figma.boolean("Show Count", {
      true: 12,
      false: undefined,
    }),
  },
  // category is a CategoryPresentation from @kozmos/product-contracts; the
  // Figma set carries the label, the selection state and the count, so the
  // rest of the object is product data supplied by the caller.
  example: ({ label, selected, disabled, tint, resultCount }) => (
    <CategoryTile
      category={{ id: "transport", label, selected, disabled, resultCount }}
      icon={categoryIcon}
      tint={tint}
      onSelect={(categoryId) => selectCategory(categoryId)}
    />
  ),
});
