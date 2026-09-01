import type { Meta, StoryObj } from "@storybook/react";
import { Info } from "lucide-react";
import { AdaptiveMapShell } from "./AdaptiveMapShell";
import { MapControlButton } from "../MapControlButton";

const meta = {
  title: "Product SDK/AdaptiveMapShell",
  component: AdaptiveMapShell,
  parameters: { layout: "fullscreen" },
  args: {
    className: "h-[42rem]",
    controls: (
      <MapControlButton
        icon={<Info className="h-5 w-5" />}
        label="Map information"
        onClick={() => undefined}
      />
    ),
    map: (
      <div className="flex h-full items-center justify-center bg-muted text-sm text-muted-foreground">
        Map SDK renderer slot
      </div>
    ),
    panel: (
      <div className="p-6">
        <h2 className="text-xl font-semibold">Selected place</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Panel content remains independently scrollable.
        </p>
      </div>
    ),
  },
} satisfies Meta<typeof AdaptiveMapShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PanelAtEnd: Story = {};

export const Error: Story = {
  args: {
    mapStatus: "error",
    mapStatusContent: "The map could not load. Check your connection.",
    panel: undefined,
  },
};
