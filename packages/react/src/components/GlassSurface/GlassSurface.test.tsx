import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GlassSurface } from "./GlassSurface";
import {
  designConfigTokens,
  normalizeDesignConfig,
} from "../../context/design-config";

describe("GlassSurface", () => {
  it("is the glass surface role, in the caller's shape", () => {
    render(
      <GlassSurface className="rounded-container p-4">
        Over the map
      </GlassSurface>,
    );
    const surface = screen.getByText("Over the map");
    expect(surface.tagName).toBe("DIV");
    expect(surface).toHaveClass(
      "kozmos-surface-glass",
      "rounded-container",
      "p-4",
    );
  });

  it("passes the caller's attributes through", () => {
    render(
      <GlassSurface role="region" aria-label="Summary">
        Summary
      </GlassSurface>,
    );
    expect(screen.getByRole("region", { name: "Summary" })).toHaveClass(
      "kozmos-surface-glass",
    );
  });

  it("is switched off by the design config only while transparency is reduced", () => {
    const on = designConfigTokens(normalizeDesignConfig({}), "t");
    expect(on["--kozmos-surface-glass-opacity"]).toBe("initial");
    expect(on["--kozmos-surface-glass-blur"]).toBe("initial");
    const off = designConfigTokens(
      normalizeDesignConfig({ accessibility: { reduceTransparency: true } }),
      "t",
    );
    expect(off["--kozmos-surface-glass-opacity"]).toBe(1);
    expect(off["--kozmos-surface-glass-blur"]).toBe("0px");
  });
});
