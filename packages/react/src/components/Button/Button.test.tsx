import React from "react";
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Button, BUTTON_EMOTIONS } from "./Button";

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

  describe("emotion", () => {
    it("changes nothing when it is not set", () => {
      render(<Button>Plain</Button>);
      const button = screen.getByRole("button");
      expect(button.style.getPropertyValue("--kz-button-bg")).toBe("");
      expect(button.className).toContain(
        "bg-[var(--components-primary-buttons-themed-button-background-idle)]",
      );
    });

    it.each(BUTTON_EMOTIONS)("points the filled tier at %s", (emotion) => {
      render(<Button emotion={emotion}>Save</Button>);
      const button = screen.getByRole("button");
      expect(button.style.getPropertyValue("--kz-button-bg")).toBe(
        `var(--components-primary-buttons-${emotion}-button-background-idle)`,
      );
      expect(button.style.getPropertyValue("--kz-button-fg")).toBe(
        `var(--components-primary-buttons-${emotion}-button-foreground-content-idle)`,
      );
      expect(button.className).toContain("bg-[var(--kz-button-bg)]");
    });

    it("reads the secondary tier for a bordered variant", () => {
      render(
        <Button variant="outline" emotion="success">
          Confirm
        </Button>,
      );
      const button = screen.getByRole("button");
      expect(button.style.getPropertyValue("--kz-button-fg")).toBe(
        "var(--components-secondary-buttons-success-button-foreground-content-idle)",
      );
      expect(button.className).toContain("border-[var(--kz-button-fg)]");
    });

    it("reads the secondary tier for a text variant", () => {
      render(
        <Button variant="ghost" emotion="alert">
          Warn
        </Button>,
      );
      const button = screen.getByRole("button");
      expect(button.style.getPropertyValue("--kz-button-fg")).toBe(
        "var(--components-secondary-buttons-alert-button-foreground-content-idle)",
      );
      expect(button.className).toContain("text-[var(--kz-button-fg)]");
    });

    it("leaves glass alone, because it is an effect and not a weight", () => {
      render(
        <Button variant="glass" emotion="danger">
          Glass
        </Button>,
      );
      const button = screen.getByRole("button");
      expect(button.style.getPropertyValue("--kz-button-bg")).toBe("");
      expect(button.className).toContain("glass");
    });

    it("lets an emotion override what destructive hard-codes", () => {
      render(
        <Button variant="destructive" emotion="informative">
          Reclassified
        </Button>,
      );
      const button = screen.getByRole("button");
      expect(button.style.getPropertyValue("--kz-button-bg")).toBe(
        "var(--components-primary-buttons-informative-button-background-idle)",
      );
    });

    it("lets a caller's own style win", () => {
      render(
        <Button
          emotion="success"
          style={{ "--kz-button-bg": "red" } as React.CSSProperties}
        >
          Override
        </Button>,
      );
      expect(
        screen.getByRole("button").style.getPropertyValue("--kz-button-bg"),
      ).toBe("red");
    });
  });
});
