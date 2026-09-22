import React from "react";
import { Input } from "../src/components/Input";
import { Stepper } from "../src/components/Stepper";
import { ThemeProvider } from "../src/components/ThemeProvider";

/**
 * A bare `border`, a field and a stepper with a pending step, inside the
 * ThemeProvider a product wraps the system in, in light.
 */
export function EdgeRoles() {
  return (
    <ThemeProvider theme="light">
      <div style={{ width: 320, padding: 16 }}>
        <div data-testid="bare" className="h-8 border" />
        <Input aria-label="Gate" defaultValue="Gate B12" />
        <Stepper steps={["Search", "Route", "Go"]} currentStep={0} />
      </div>
    </ThemeProvider>
  );
}
