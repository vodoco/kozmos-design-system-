import figma from "@figma/code-connect";
import { CategoryTile } from "./CategoryTile";

const categoryTileUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8039";

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
  },
  // category is a CategoryPresentation from @kozmos/product-contracts; the
  // Figma set carries only the label and the selection state, so the rest of
  // the object is product data supplied by the caller.
  example: ({ label, selected, disabled }) => (
    <CategoryTile
      category={{ id: "food", label, selected, disabled }}
      icon={categoryIcon}
      onSelect={(categoryId) => selectCategory(categoryId)}
    />
  ),
});
