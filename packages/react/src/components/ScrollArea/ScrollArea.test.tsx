import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";
import { ScrollArea } from "./ScrollArea";

describe("ScrollArea", () => {
  it("renders children inside a scroll viewport", () => {
    const { getByText } = render(<ScrollArea>Scrollable content</ScrollArea>);
    expect(getByText("Scrollable content")).toBeInTheDocument();
  });

  it("uses vertical scrolling by default", () => {
    const { container } = render(<ScrollArea>Content</ScrollArea>);
    const viewport = container.firstElementChild?.firstElementChild;

    expect(container.firstElementChild).toHaveClass("overflow-hidden");
    expect(viewport).toHaveClass("overflow-y-auto", "overflow-x-hidden");
  });

  it("supports horizontal scrolling with visible scrollbars", () => {
    const { container } = render(
      <ScrollArea orientation="horizontal" hideScrollbar={false}>
        Content
      </ScrollArea>,
    );
    const viewport = container.firstElementChild?.firstElementChild;

    expect(viewport).toHaveClass("overflow-x-auto", "overflow-y-hidden");
    expect(viewport).not.toHaveClass("[scrollbar-width:none]");
  });

  it("supports two-axis scrolling and two-axis snapping", () => {
    const { container } = render(
      <ScrollArea orientation="both" snap="both">
        Content
      </ScrollArea>,
    );
    const viewport = container.firstElementChild?.firstElementChild;

    expect(viewport).toHaveClass(
      "overflow-auto",
      "snap-both",
      "snap-mandatory",
    );
  });
});
