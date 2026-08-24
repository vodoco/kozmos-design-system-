import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";
import { EmptyState } from "./EmptyState";

afterEach(cleanup);

describe("EmptyState", () => {
  it("renders the title and optional description", () => {
    render(
      <EmptyState
        title="No results found"
        description="Try adjusting your filters or search terms."
      />,
    );

    expect(screen.getByText("No results found")).toBeInTheDocument();
    expect(
      screen.getByText("Try adjusting your filters or search terms."),
    ).toBeInTheDocument();
  });

  it("renders optional icon and action content", () => {
    render(
      <EmptyState
        title="No results found"
        icon={<span aria-label="Search icon" />}
        action={<button type="button">Clear filters</button>}
      />,
    );

    expect(screen.getByLabelText("Search icon")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Clear filters" }),
    ).toBeInTheDocument();
  });

  it("keeps the expected centered empty-state layout classes", () => {
    render(<EmptyState title="Nothing here" data-testid="empty-state" />);

    expect(screen.getByTestId("empty-state")).toHaveClass(
      "flex",
      "items-center",
      "justify-center",
      "p-8",
      "text-center",
    );
  });
});
