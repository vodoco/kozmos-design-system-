import type { Meta, StoryObj } from "@storybook/react";
import { GlassSurface } from "./GlassSurface";
import { Text } from "../Text";

const meta = {
  title: "Foundations/GlassSurface",
  component: GlassSurface,
  parameters: { layout: "padded" },
  render: (args) => (
    <div
      className="relative min-h-[280px] rounded-panel p-6"
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 30%, rgb(var(--kozmos-glass-rgb)) 0, transparent 0), linear-gradient(135deg, var(--primitives-colors-theme-500) 0%, var(--primitives-colors-theme-200) 45%, var(--primitives-colors-background-300) 100%)",
      }}
    >
      <Text className="mb-24 text-sm">
        What is behind the surface shows through, blurred and saturated by the
        token.
      </Text>
      <GlassSurface {...args} />
    </div>
  ),
  args: {
    className: "rounded-container p-4 text-foreground shadow-floating",
    children: "A card over the map, on the glass surface role.",
  },
} satisfies Meta<typeof GlassSurface>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Panel: Story = {
  args: {
    className: "rounded-panel p-6 text-foreground shadow-overlay",
    children: "A panel, radius Panel, elevation Overlay.",
  },
};
