import { fireEvent, render, screen } from "@testing-library/react";
import { ShoppingBag } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { CategoryTile } from "./CategoryTile";

describe("CategoryTile", () => {
  it("exposes controlled selection and emits the category ID", () => {
    const onSelect = vi.fn();
    render(
      <CategoryTile
        category={{ id: "shopping", label: "Shopping", selected: true }}
        icon={<ShoppingBag />}
        onSelect={onSelect}
      />,
    );

    const button = screen.getByRole("button", { name: "Shopping" });
    expect(button).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(button);
    expect(onSelect).toHaveBeenCalledWith("shopping");
  });

  it("prevents selection for unavailable categories", () => {
    const onSelect = vi.fn();
    render(
      <CategoryTile
        category={{
          id: "service",
          label: "Customer service",
          selected: false,
          disabled: true,
        }}
        icon={<ShoppingBag />}
        onSelect={onSelect}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Customer service" }),
    ).toBeDisabled();
  });
});
