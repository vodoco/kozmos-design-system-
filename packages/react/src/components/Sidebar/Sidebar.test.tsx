import { render, screen } from "@testing-library/react";
import { Sidebar } from "./Sidebar";
import { describe, it, expect } from "vitest";

describe("Sidebar", () => {
  it("renders correctly", () => {
    render(<Sidebar>Content</Sidebar>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("renders slotted sidebar regions", () => {
    render(
      <Sidebar
        footer={<span>Account</span>}
        header={<span>Workspace</span>}
        navigation={<a href="#">Explore</a>}
        tools={<button type="button">Settings</button>}
      />,
    );

    expect(screen.getByText("Workspace")).toBeInTheDocument();
    expect(screen.getByText("Explore")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(
      screen.getByText("Workspace").closest('[data-slot="sidebar-header"]'),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Explore").closest('[data-slot="sidebar-navigation"]'),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Settings").closest('[data-slot="sidebar-tools"]'),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Account").closest('[data-slot="sidebar-footer"]'),
    ).toBeInTheDocument();
  });

  it("supports rail variant state", () => {
    render(<Sidebar variant="rail">Rail content</Sidebar>);

    expect(screen.getByText("Rail content").closest("aside")).toHaveAttribute(
      "data-collapsed",
      "true",
    );
  });
});
