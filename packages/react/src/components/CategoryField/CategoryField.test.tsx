import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CategoryField } from "./CategoryField";

describe("CategoryField", () => {
  it("names itself by the category and its count, and clears on the button", () => {
    const onClear = vi.fn();
    render(
      <CategoryField
        label="Gates"
        count={2}
        tint="var(--semantics-data-yellow)"
        onClear={onClear}
        icon={<svg />}
      />,
    );
    const field = screen.getByRole("group", { name: "Gates, 2 places" });
    expect(field).toHaveClass("h-12", "rounded-control", "border");
    expect(field.style.getPropertyValue("--kozmos-category-tint")).toBe(
      "var(--semantics-data-yellow)",
    );
    expect(screen.getByLabelText("2 places")).toHaveTextContent("2");
    fireEvent.click(screen.getByRole("button", { name: "Clear category" }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("shows no pill without a count", () => {
    render(<CategoryField label="Bookmarks" onClear={() => undefined} />);
    expect(
      screen.getByRole("group", { name: "Bookmarks" }),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText(/places/)).toBeNull();
  });
});
