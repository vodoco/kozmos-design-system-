import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Counter, formatCounterValue } from "./Counter";

describe("Counter", () => {
  it("renders numeric content", () => {
    render(<Counter>12</Counter>);
    expect(screen.getByText("12")).toHaveAttribute("data-slot", "counter");
  });

  it("supports tone and size variants", () => {
    render(
      <Counter tone="brand" size="sm">
        4
      </Counter>,
    );

    expect(screen.getByText("4")).toHaveClass("h-[18px]", "bg-primary");
  });

  it("normalizes legacy parenthesized values", () => {
    render(<Counter>(8)</Counter>);
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.queryByText("(8)")).not.toBeInTheDocument();
  });

  it("keeps non-text children unchanged", () => {
    const child = <span data-testid="custom-counter">99+</span>;
    expect(formatCounterValue(child)).toBe(child);
  });
});
