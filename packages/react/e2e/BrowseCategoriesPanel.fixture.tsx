import React from "react";
import { BrowseCategoriesPanel } from "../src/components/BrowseCategoriesPanel";
import { ThemeProvider } from "../src/components/ThemeProvider";

/**
 * Eight tiles, as the prototype's aviation quick access shows, at the width
 * of its sheet, inside the ThemeProvider a product wraps the system in: the
 * package's CSS applies only under its `data-kozmos-root`. A wrapper, because
 * a component test cannot pass a render function across to the page.
 */
export function BrowseGrid() {
  return (
    <ThemeProvider theme="light">
      <div style={{ width: 402 }}>
        <BrowseCategoriesPanel
          categories={Array.from({ length: 8 }, (_, index) => ({
            id: `c${index}`,
            label: "Gates",
            selected: false,
          }))}
          onSelect={() => undefined}
          renderIcon={() => <svg aria-hidden="true" height={24} width={24} />}
        />
      </div>
    </ThemeProvider>
  );
}
