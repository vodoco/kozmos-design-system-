import { render, screen, fireEvent } from "@testing-library/react";
import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from "./Popover";
import { describe, it, expect } from "vitest";

describe("Popover", () => {
  it("shows content on click", () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );

    fireEvent.click(screen.getByText("Open"));
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("renders an arrow only when one is asked for", () => {
    const { container, rerender } = render(
      <Popover open>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );
    // The arrow is opt-in, unlike Tooltip's, because plenty of popovers are
    // panels that read better without a pointer.
    expect(document.querySelectorAll("svg")).toHaveLength(0);

    rerender(
      <Popover open>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          Content
          <PopoverArrow />
        </PopoverContent>
      </Popover>,
    );
    expect(document.querySelectorAll("svg").length).toBeGreaterThan(0);
    void container;
  });
});
