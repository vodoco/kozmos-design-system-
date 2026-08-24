import { render, screen } from "@testing-library/react";
import { Navbar } from "./Navbar";
import { describe, it, expect } from "vitest";

describe("Navbar", () => {
  it("renders logo and content", () => {
    render(
      <Navbar logo={<span>Logo</span>}>
        <a href="#">Link</a>
      </Navbar>,
    );
    expect(screen.getByText("Logo")).toBeInTheDocument();
    expect(screen.getByText("Link")).toBeInTheDocument();
  });

  it("renders slotted navigation regions", () => {
    render(
      <Navbar
        account={<button type="button">Account</button>}
        context={<button type="button">Workspace</button>}
        logo={<span>Logo</span>}
        navigation={<a href="#">Explore</a>}
        primaryAction={<button type="button">Publish</button>}
        utilities={<button type="button">Notifications</button>}
      />,
    );

    expect(screen.getByText("Workspace")).toBeInTheDocument();
    expect(screen.getByText("Publish")).toBeInTheDocument();
    expect(screen.getByText("Explore")).toBeInTheDocument();
    expect(screen.getByText("Notifications")).toBeInTheDocument();
    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(
      screen.getByText("Workspace").closest('[data-slot="navbar-context"]'),
    ).toBeInTheDocument();
    expect(
      screen
        .getByText("Publish")
        .closest('[data-slot="navbar-primary-action"]'),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Explore").closest('[data-slot="navbar-navigation"]'),
    ).toBeInTheDocument();
  });

  it("keeps the legacy site slot as a context alias", () => {
    render(<Navbar site={<button type="button">Legacy Site</button>} />);

    expect(screen.getByText("Legacy Site")).toBeInTheDocument();
  });
});
