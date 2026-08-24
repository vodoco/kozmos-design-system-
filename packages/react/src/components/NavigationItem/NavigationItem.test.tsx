import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NavigationItem } from "./NavigationItem";

describe("NavigationItem", () => {
  it("renders a selected navigation link", () => {
    render(
      <NavigationItem href="/explore" selected>
        Explore
      </NavigationItem>,
    );

    const item = screen.getByRole("link", { name: "Explore" });
    expect(item).toHaveAttribute("aria-current", "page");
    expect(item).toHaveAttribute("data-selected", "true");
  });

  it("renders a button when no href is provided", () => {
    render(<NavigationItem>Overview</NavigationItem>);

    expect(screen.getByRole("button", { name: "Overview" })).toHaveAttribute(
      "type",
      "button",
    );
  });

  it("prevents disabled anchor activation", () => {
    const onClick = vi.fn();
    render(
      <NavigationItem disabled href="/settings" onClick={onClick}>
        Settings
      </NavigationItem>,
    );

    const item = screen.getByRole("link", { name: "Settings" });
    expect(item).toHaveAttribute("aria-disabled", "true");
    expect(item).toHaveAttribute("href", "/settings");
    expect(item).toHaveAttribute("tabindex", "-1");
  });

  it("applies focus-visible styling when requested", () => {
    render(<NavigationItem focusVisible>Overview</NavigationItem>);

    expect(screen.getByRole("button", { name: "Overview" })).toHaveClass(
      "ring-2",
    );
  });

  it("supports rail icon-only items", () => {
    render(
      <NavigationItem
        aria-label="Search"
        content="icon-only"
        icon={<span data-testid="icon" />}
        placement="rail"
      />,
    );

    expect(screen.getByRole("button", { name: "Search" })).toHaveAttribute(
      "data-placement",
      "rail",
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("infers icon-label content when an icon is supplied", () => {
    render(
      <NavigationItem icon={<span data-testid="icon" />}>
        Overview
      </NavigationItem>,
    );

    expect(screen.getByRole("button", { name: "Overview" })).toHaveAttribute(
      "data-content",
      "icon-label",
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("uses explicit content to decide which optional slots render", () => {
    render(
      <NavigationItem
        badge={<span data-testid="badge">3</span>}
        content="label"
        icon={<span data-testid="icon" />}
        trailing={<span data-testid="trailing" />}
      >
        Overview
      </NavigationItem>,
    );

    expect(screen.getByRole("button", { name: "Overview" })).toHaveAttribute(
      "data-content",
      "label",
    );
    expect(screen.queryByTestId("icon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("badge")).not.toBeInTheDocument();
    expect(screen.queryByTestId("trailing")).not.toBeInTheDocument();
  });

  it("renders only the matching extra slot for badge and trailing content", () => {
    const { rerender } = render(
      <NavigationItem
        badge={<span data-testid="badge">3</span>}
        content="badge"
        icon={<span data-testid="icon" />}
        trailing={<span data-testid="trailing" />}
      >
        Notifications
      </NavigationItem>,
    );

    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getByTestId("badge")).toBeInTheDocument();
    expect(screen.queryByTestId("trailing")).not.toBeInTheDocument();

    rerender(
      <NavigationItem
        badge={<span data-testid="badge">3</span>}
        content="trailing"
        icon={<span data-testid="icon" />}
        trailing={<span data-testid="trailing" />}
      >
        Settings
      </NavigationItem>,
    );

    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.queryByTestId("badge")).not.toBeInTheDocument();
    expect(screen.getByTestId("trailing")).toBeInTheDocument();
  });
});
