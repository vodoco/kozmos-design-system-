import { render, screen } from "@testing-library/react";
import { List, ListItem } from "./List";
import { describe, it, expect } from "vitest";

describe("List", () => {
  it("renders correctly", () => {
    render(
      <List>
        <ListItem>Item 1</ListItem>
        <ListItem>Item 2</ListItem>
      </List>,
    );
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("supports compact density", () => {
    render(
      <List density="compact" data-testid="list">
        <ListItem>Item 1</ListItem>
      </List>,
    );
    expect(screen.getByTestId("list")).toHaveAttribute(
      "data-density",
      "compact",
    );
  });
});
