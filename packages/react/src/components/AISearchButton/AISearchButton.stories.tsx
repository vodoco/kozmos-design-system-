import type { Meta, StoryObj } from "@storybook/react";
import { AISearchButton } from "./AISearchButton";
import { SearchBar } from "../SearchBar";

const meta = {
  title: "Product SDK/AISearchButton",
  component: AISearchButton,
  parameters: { layout: "padded" },
} satisfies Meta<typeof AISearchButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Beside the search field, as the prototype's search sheet places it. */
export const BesideTheSearchField: Story = {
  render: () => (
    <div className="flex max-w-[402px] items-center gap-2">
      <SearchBar
        placeholder="Search this building"
        containerClassName="flex-1"
      />
      <AISearchButton />
    </div>
  ),
};
