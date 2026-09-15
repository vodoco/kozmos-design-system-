import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Focus, Info } from "lucide-react";
import { MapControlButton } from "./MapControlButton";
import { useRevealOnChange } from "../../hooks/useRevealOnChange";

const meta = {
  title: "Product SDK/MapControlButton",
  component: MapControlButton,
  parameters: { layout: "centered" },
  args: { onClick: fn() },
} satisfies Meta<typeof MapControlButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IconOnly: Story = {
  args: {
    icon: <Info className="h-5 w-5" />,
    label: "Map information",
  },
};

export const LabelledState: Story = {
  args: {
    icon: <Focus className="h-5 w-5" />,
    label: "Focus",
    presentation: "labelled",
    pressed: false,
    stateLabel: "Off",
  },
};

export const StackedState: Story = {
  args: {
    icon: <Focus className="h-5 w-5" />,
    label: "Focus",
    labelPlacement: "stacked",
    presentation: "labelled",
    pressed: true,
    stateLabel: "On",
  },
};

export const FilledEmphasis: Story = {
  args: {
    emphasis: "filled",
    icon: <Focus className="h-5 w-5" />,
    label: "Focus",
    presentation: "labelled",
    pressed: true,
    stateLabel: "On",
  },
};

/**
 * A map mode toggle at rest is icon-only. When its mode changes it widens to
 * say which mode it is now, waits long enough to be read, and collapses back
 * so it stops covering the map — `useRevealOnChange` owns that timing so two
 * controls cannot disagree about how long "a while" is.
 */
export const RevealsOnChange: Story = {
  args: {
    icon: <Focus className="h-5 w-5" />,
    label: "Focus",
  },
  render: function RevealsOnChangeStory(args) {
    const [on, setOn] = React.useState(false);
    const revealed = useRevealOnChange(on, { duration: 2500 });

    return (
      <MapControlButton
        {...args}
        icon={<Focus className="h-5 w-5" />}
        labelPlacement="stacked"
        presentation={revealed ? "labelled" : "icon-only"}
        pressed={on}
        stateLabel={on ? "On" : "Off"}
        onClick={() => setOn((value) => !value)}
      />
    );
  },
};
