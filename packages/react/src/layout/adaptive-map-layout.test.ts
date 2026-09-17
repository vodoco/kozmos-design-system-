import { describe, expect, it } from "vitest";
import {
  resolveAdaptiveMapLayout,
  resolveMapInsets,
} from "./adaptive-map-layout";

describe("adaptive map geometry", () => {
  it("uses local dimensions and short-height policy", () => {
    expect(
      resolveAdaptiveMapLayout({ width: 360, height: 600, hasPanel: true })
        .presentation,
    ).toBe("bottom");
    expect(
      resolveAdaptiveMapLayout({ width: 844, height: 390, hasPanel: true })
        .presentation,
    ).toBe("side");
    expect(
      resolveAdaptiveMapLayout({ width: 844, height: 200, hasPanel: true })
        .presentation,
    ).toBe("side");
    expect(
      resolveAdaptiveMapLayout({ width: 844, height: 120, hasPanel: true })
        .presentation,
    ).toBe("bottom");
  });
  it("resolves logical placement before calculating physical padding", () => {
    const layout = resolveAdaptiveMapLayout({
      width: 1024,
      height: 768,
      hasPanel: true,
      direction: "rtl",
    });
    expect(layout.panelBounds?.x).toBe(16);
    expect(
      resolveMapInsets(layout.mapBounds, [
        { bounds: layout.panelBounds!, edge: "left" },
      ]).left,
    ).toBe(432);
  });
  it("keeps map and panel in separate hinge-free regions", () => {
    const regions = [
      { x: 0, y: 0, width: 390, height: 700 },
      { x: 410, y: 0, width: 390, height: 700 },
    ];
    const layout = resolveAdaptiveMapLayout({
      width: 800,
      height: 700,
      hasPanel: true,
      usableRegions: regions,
    });
    expect(layout.presentation).toBe("separated");
    expect(layout.mapBounds).toEqual(regions[0]);
    expect(layout.panelBounds).toEqual(regions[1]);
    expect(
      resolveMapInsets(layout.mapBounds, [
        { bounds: layout.panelBounds!, edge: "right" },
      ]).right,
    ).toBe(0);
  });
  it("keeps the map above controls in tabletop posture", () => {
    const regions = [
      { x: 0, y: 0, width: 700, height: 300 },
      { x: 0, y: 320, width: 700, height: 400 },
    ];
    const layout = resolveAdaptiveMapLayout({
      width: 700,
      height: 720,
      hasPanel: true,
      usableRegions: regions,
      direction: "rtl",
    });
    expect(layout.mapBounds).toEqual(regions[0]);
    expect(layout.panelBounds).toEqual(regions[1]);
  });
  it("intersects safe/keyboard insets and never invents space from invalid regions", () => {
    const layout = resolveAdaptiveMapLayout({
      width: 390,
      height: 400,
      hasPanel: true,
      safeAreaInsets: { bottom: 200 },
    });
    expect(layout.mapBounds.height).toBe(200);
    expect(layout.panelBounds!.y + layout.panelBounds!.height).toBe(200);
    expect(
      resolveAdaptiveMapLayout({
        width: 390,
        height: 400,
        hasPanel: true,
        usableRegions: [],
      }).panelBounds,
    ).toBeNull();
  });
  it("merges measured occlusion with host padding without adding it twice", () => {
    const map = { x: 0, y: 0, width: 400, height: 600 };
    expect(
      resolveMapInsets(
        map,
        [{ bounds: { x: 0, y: 300, width: 400, height: 300 }, edge: "bottom" }],
        { bottom: 20, top: 40 },
      ),
    ).toEqual({ top: 40, bottom: 300, left: 0, right: 0 });
  });
});
