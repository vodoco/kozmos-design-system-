import figma from "@figma/code-connect";
import { CategoryField, type CategoryFieldProps } from "./CategoryField";

// The set is new on 2026-09-21: Build CategoryField in the importer, then put
// the node id its log prints here and add this file and CategoryField.tsx to
// figma.linked.config.json. Until then the file is not published.
const categoryFieldUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=0-0";

declare const categoryIcon: CategoryFieldProps["icon"];
declare const clearCategory: CategoryFieldProps["onClear"];

// The Tint axis: Theme is the field with no category, the component's own
// default; the eight are the taxonomy's quick-access colours as the
// Semantics.Category tokens' CSS variables.
const tintFor = (name: string) => ({
  accent: `var(--semantics-category-accent-${name})`,
  fill: `var(--semantics-category-fill-${name})`,
  onFill: `var(--semantics-category-on-fill-${name})`,
});

figma.connect(CategoryField, categoryFieldUrl, {
  props: {
    label: figma.string("Label Text"),
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
    // Show Count is count being set; Count Text carries the number.
    count: figma.boolean("Show Count", {
      true: 12,
      false: undefined,
    }),
  },
  example: ({ label, tint, count }) => (
    <CategoryField
      label={label}
      count={count}
      tint={tint}
      icon={categoryIcon}
      onClear={clearCategory}
    />
  ),
});
