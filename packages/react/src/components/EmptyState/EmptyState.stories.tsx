import type { Meta, StoryObj } from "@storybook/react";
import { EmptyState } from "./EmptyState";
import { Button } from "../Button";
import { Search } from "lucide-react";

const meta = {
  title: "Components/EmptyState",
  component: EmptyState,
  parameters: { layout: "centered" },
} satisfies Meta<typeof EmptyState>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <Search className="h-8 w-8 text-muted-foreground" />,
    title: "No results found",
    description:
      "We couldn't find any places matching your search. Please check your spelling or try another term.",
    action: <Button variant="outline">Clear Search</Button>,
  },
  render: (args) => (
    <div className="w-[360px] h-[400px] border rounded-lg bg-card flex">
      <EmptyState {...args} />
    </div>
  ),
};
