import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AISearchButton } from "./AISearchButton";

describe("AISearchButton", () => {
  it("is a button named by its label, its ring and icon silent", () => {
    const onClick = vi.fn();
    const { container } = render(<AISearchButton onClick={onClick} />);
    const button = screen.getByRole("button", { name: "AI search" });
    // Laid out at the prototype's 48; the 66 ring is drawn outside it.
    expect(button).toHaveClass("kozmos-ai-search", "h-12", "w-12");
    expect(container.querySelector(".kozmos-ai-search-ring")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("takes its own label", () => {
    render(<AISearchButton label="Ask the map" />);
    expect(
      screen.getByRole("button", { name: "Ask the map" }),
    ).toBeInTheDocument();
  });
});
