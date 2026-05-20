import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders correctly", () => {
    render(<Badge>Test Content</Badge>);
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("hides the counter by default", () => {
    render(<Badge counter={2}>New</Badge>);
    expect(screen.getByText("New")).toBeInTheDocument();
    expect(screen.queryByText("(2)")).not.toBeInTheDocument();
  });

  it("renders an opt-in counter", () => {
    render(
      <Badge counter={2} showCounter>
        New
      </Badge>,
    );

    expect(screen.getByText("New")).toBeInTheDocument();
    expect(screen.getByText("(2)")).toBeInTheDocument();
  });

  it("renders icon-sized badges from the icon slot", () => {
    render(
      <Badge icon={<span data-testid="badge-icon">ok</span>} size="icon">
        Text
      </Badge>,
    );

    expect(screen.getByTestId("badge-icon")).toBeInTheDocument();
    expect(screen.queryByText("Text")).not.toBeInTheDocument();
  });
});
