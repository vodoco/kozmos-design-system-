import figma from "@figma/code-connect";
import { EmptyState } from "../EmptyState/EmptyState";
import { SearchBar } from "../SearchBar/SearchBar";
import { BrowseCategoriesPanel } from "./BrowseCategoriesPanel";

const browseCategoriesPanelUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8026";

figma.connect(BrowseCategoriesPanel, browseCategoriesPanelUrl, {
  props: {
    label: figma.string("Panel Label Text"),
    search: figma.enum("Content", {
      Basic: undefined,
      Search: <SearchBar />,
      Empty: undefined,
    }),
    emptyState: figma.enum("Content", {
      Basic: undefined,
      Search: undefined,
      Empty: <EmptyState title="No categories match" />,
    }),
  },
  example: ({ label, search, emptyState }) => (
    <BrowseCategoriesPanel
      label={label}
      categories={categories}
      renderIcon={(category) => renderCategoryIcon(category)}
      onSelect={(categoryId) => selectCategory(categoryId)}
      search={search}
      emptyState={emptyState}
    />
  ),
});
