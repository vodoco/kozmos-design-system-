import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MetaStrip, MetaStripItem } from "./MetaStrip";

describe("MetaStrip", () => {
  it("renders a description list of facts", () => {
    render(
      <MetaStrip aria-label="About this place">
        <MetaStripItem label="Travel time">12 min</MetaStripItem>
        <MetaStripItem label="Distance">210 m</MetaStripItem>
      </MetaStrip>,
    );

    const strip = screen.getByLabelText("About this place");
    expect(strip.tagName).toBe("DL");
    expect(strip).toHaveAttribute("data-slot", "meta-strip");
    expect(screen.getByText("12 min")).toBeInTheDocument();
    expect(screen.getByText("210 m")).toBeInTheDocument();
  });

  it("keeps the label in the accessible name even when it is not drawn", () => {
    render(
      <MetaStrip aria-label="About this place">
        <MetaStripItem label="Price band">$$$$</MetaStripItem>
      </MetaStrip>,
    );

    // A price band reads on its own, so the label is hidden — but a screen
    // reader still gets it, which is the whole reason the label is required.
    expect(screen.getByText("Price band")).toHaveClass(
      "kozmos-meta-label-hidden",
    );
  });

  it("draws the label when asked", () => {
    render(
      <MetaStrip aria-label="About this place">
        <MetaStripItem label="Wait" showLabel>
          25 min
        </MetaStripItem>
      </MetaStrip>,
    );

    expect(screen.getByText("Wait")).not.toHaveClass(
      "kozmos-meta-label-hidden",
    );
  });

  it("pairs each term with its value, term first", () => {
    render(
      <MetaStrip aria-label="About this place">
        <MetaStripItem label="Rating">4.5</MetaStripItem>
      </MetaStrip>,
    );

    const group = screen
      .getByText("4.5")
      .closest("[data-slot='meta-strip-item']");
    const children = Array.from(group?.children ?? []).map((n) => n.tagName);
    expect(children).toEqual(["DT", "DD"]);
  });

  it("hides a decorative icon from the accessible name", () => {
    render(
      <MetaStrip aria-label="About this place">
        <MetaStripItem icon={<svg data-testid="glyph" />} label="Crowd level">
          Busy
        </MetaStripItem>
      </MetaStrip>,
    );

    expect(screen.getByTestId("glyph").parentElement).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
