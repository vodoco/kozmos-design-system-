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
figma.connect(CategoryField, categoryFieldUrl, {
  props: {
    label: figma.string("Label Text"),
    tint: figma.enum("Tint", {
      Theme: undefined,
      Yellow: {
        accent: "var(--semantics-category-accent-yellow)",
        fill: "var(--semantics-category-fill-yellow)",
        onFill: "var(--semantics-category-on-fill-yellow)",
      },
      Orange: {
        accent: "var(--semantics-category-accent-orange)",
        fill: "var(--semantics-category-fill-orange)",
        onFill: "var(--semantics-category-on-fill-orange)",
      },
      Turquoise: {
        accent: "var(--semantics-category-accent-turquoise)",
        fill: "var(--semantics-category-fill-turquoise)",
        onFill: "var(--semantics-category-on-fill-turquoise)",
      },
      Red: {
        accent: "var(--semantics-category-accent-red)",
        fill: "var(--semantics-category-fill-red)",
        onFill: "var(--semantics-category-on-fill-red)",
      },
      Blue: {
        accent: "var(--semantics-category-accent-blue)",
        fill: "var(--semantics-category-fill-blue)",
        onFill: "var(--semantics-category-on-fill-blue)",
      },
      Navy: {
        accent: "var(--semantics-category-accent-navy)",
        fill: "var(--semantics-category-fill-navy)",
        onFill: "var(--semantics-category-on-fill-navy)",
      },
      Green: {
        accent: "var(--semantics-category-accent-green)",
        fill: "var(--semantics-category-fill-green)",
        onFill: "var(--semantics-category-on-fill-green)",
      },
      Pink: {
        accent: "var(--semantics-category-accent-pink)",
        fill: "var(--semantics-category-fill-pink)",
        onFill: "var(--semantics-category-on-fill-pink)",
      },
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
