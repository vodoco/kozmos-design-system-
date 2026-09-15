import { describe, expect, it } from "vitest";
import { cn } from "../utils";

describe("cn", () => {
  it("still resolves the standard scale", () => {
    expect(cn("rounded-sm", "rounded-lg")).toBe("rounded-lg");
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  /**
   * The defect this fixes: a caller could not override a component's radius.
   * `Avatar` carries `rounded-pill`, and `className="rounded-control"` used to
   * leave both on the element, so CSS order won and the avatar stayed a circle.
   */
  it("treats the design system's radius roles as one property", () => {
    expect(cn("rounded-pill", "rounded-control")).toBe("rounded-control");
    expect(cn("rounded-control", "rounded-pill")).toBe("rounded-pill");
    expect(cn("rounded-container", "rounded-panel")).toBe("rounded-panel");
  });

  it("resolves a role against the standard scale too", () => {
    expect(cn("rounded-full", "rounded-marker")).toBe("rounded-marker");
    expect(cn("rounded-pill", "rounded-none")).toBe("rounded-none");
  });

  it("resolves per-corner and per-side roles", () => {
    expect(cn("rounded-t-container", "rounded-t-panel")).toBe(
      "rounded-t-panel",
    );
    expect(cn("rounded-tl-marker", "rounded-tl-control")).toBe(
      "rounded-tl-control",
    );
  });

  it("keeps a side role beside the all-corners one", () => {
    // Different properties: the side should survive the general class.
    expect(cn("rounded-control", "rounded-t-panel")).toBe(
      "rounded-control rounded-t-panel",
    );
  });

  it("treats the elevation roles as one property", () => {
    expect(cn("shadow-raised", "shadow-overlay")).toBe("shadow-overlay");
    expect(cn("shadow-lg", "shadow-floating")).toBe("shadow-floating");
  });

  it("treats the border widths as one property", () => {
    expect(cn("border-sm", "border-lg")).toBe("border-lg");
  });
});
