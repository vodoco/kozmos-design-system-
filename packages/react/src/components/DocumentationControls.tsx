import { Controls as StorybookControls } from "@storybook/blocks";
import type { ComponentProps } from "react";

/** Keep wide property tables readable and keyboard-scrollable inside Docs. */
export function Controls(props: ComponentProps<typeof StorybookControls>) {
  return (
    <div
      className="kozmos-docs-properties"
      role="region"
      aria-label="Component properties"
      tabIndex={0}
    >
      <StorybookControls {...props} />
    </div>
  );
}
