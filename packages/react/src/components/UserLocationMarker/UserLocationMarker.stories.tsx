import type { Meta, StoryObj } from "@storybook/react";
import { UserLocationMarker } from "./UserLocationMarker";
import { useState, useEffect } from "react";

const meta = {
  title: "Components/UserLocationMarker",
  component: UserLocationMarker,
  parameters: { layout: "centered" },
} satisfies Meta<typeof UserLocationMarker>;
export default meta;
type Story = StoryObj<typeof meta>;

const DynamicCompass = () => {
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeading((h) => (h + 5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-[300px] h-[300px] bg-muted/30 border rounded-container flex items-center justify-center relative overflow-hidden">
      {/* Grid background simulation */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(var(--primitives-colors-background-200) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <UserLocationMarker heading={heading} showHeading={true} />
    </div>
  );
};

export const Default: Story = {
  render: () => <DynamicCompass />,
};

export const StaticNoHeading: Story = {
  args: {
    showHeading: false,
  },
  render: (args) => (
    <div className="w-[100px] h-[100px] flex items-center justify-center">
      <UserLocationMarker {...args} />
    </div>
  ),
};
