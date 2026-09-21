import { fireEvent, render, screen } from "@testing-library/react";
import { LocationPin } from "./LocationPin";
import { describe, expect, it, vi } from "vitest";

describe("LocationPin", () => {
  it("renders a labelled non-interactive marker", () => {
    render(<LocationPin label="Baskin-Robbins" />);
    expect(
      screen.getByRole("img", { name: "Baskin-Robbins" }),
    ).toBeInTheDocument();
  });

  it("supports keyboard activation when interactive", () => {
    const onClick = vi.fn();
    render(<LocationPin label="Open Burger King" onClick={onClick} />);

    const pin = screen.getByRole("button", { name: "Open Burger King" });
    fireEvent.keyDown(pin, { key: "Enter" });

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("links a numbered selected pin to its result", () => {
    render(
      <LocationPin
        label="Result 3, Burger King, selected"
        number={3}
        resultId="poi-result-burger-king"
        selected
      />,
    );

    const pin = screen.getByRole("img", {
      name: "Result 3, Burger King, selected",
    });
    expect(pin).toHaveAttribute("aria-controls", "poi-result-burger-king");
    expect(pin).toHaveAttribute("aria-current", "location");
    expect(pin).toHaveTextContent("3");
  });

  it("keeps disabled interactive pins out of the tab order", () => {
    const onClick = vi.fn();
    render(
      <LocationPin disabled label="Unavailable result" onClick={onClick} />,
    );

    const pin = screen.getByRole("button", { name: "Unavailable result" });
    expect(pin).toHaveAttribute("aria-disabled", "true");
    expect(pin).not.toHaveAttribute("tabindex");
    fireEvent.click(pin);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("takes a tint for the marker; a featured pin keeps the alert colour", () => {
    const { rerender } = render(
      <LocationPin
        label="Dining"
        number={3}
        tint={{
          accent: "var(--semantics-category-accent-red)",
          fill: "var(--semantics-category-fill-red)",
          onFill: "var(--semantics-category-on-fill-red)",
        }}
      />,
    );
    const marker = screen.getByRole("img").querySelector("svg") as SVGElement;
    expect(marker.style.getPropertyValue("color")).toBe(
      "var(--semantics-category-fill-red)",
    );
    expect(
      (screen.getByText("3") as HTMLElement).style.getPropertyValue("color"),
    ).toBe("var(--semantics-category-on-fill-red)");
    expect(marker.style.getPropertyValue("fill")).toContain(
      "var(--semantics-category-fill-red)",
    );
    rerender(
      <LocationPin
        featured
        label="Dining"
        tint={{
          accent: "var(--semantics-category-accent-red)",
          fill: "var(--semantics-category-fill-red)",
          onFill: "var(--semantics-category-on-fill-red)",
        }}
      />,
    );
    expect(
      (
        screen.getByRole("img").querySelector("svg") as SVGElement
      ).style.getPropertyValue("color"),
    ).toBe("");
  });
});
