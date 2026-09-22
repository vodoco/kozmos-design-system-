import React from "react";
import { ThemeProvider } from "../src/components/ThemeProvider/ThemeProvider";
import { WayfindingInputRow } from "../src/components/WayfindingCard/WayfindingCard";

export function WayfindingInputRowFixture() {
  return (
    <ThemeProvider theme="light">
      <div style={{ width: 328 }}>
        <WayfindingInputRow
          originValue="Current location"
          destinationValue=""
        />
      </div>
    </ThemeProvider>
  );
}
