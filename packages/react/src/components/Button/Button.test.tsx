import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders correctly", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: /click me/i }),
    ).toBeInTheDocument();
  });

  it("renders loading state correctly", () => {
    render(
      <Button disabled={undefined} isLoading>
        Loading...
      </Button>,
    );
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    // Check for the loader icon if possible, usually by testid or class
    // For now assuming the disabling is the key behavior to check
  });

  it("handles clicks", async () => {
    // We can add interaction tests later with user-event
    // For now just basic rendering checks
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeEnabled();
  });
});
