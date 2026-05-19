import { render, screen } from "@testing-library/react";
import { IconButton } from "./IconButton";
import { describe, it, expect } from "vitest";
import { Search } from "lucide-react";

describe("IconButton", () => {
  it("renders correctly", () => {
    render(
      <IconButton aria-label="search">
        <Search />
      </IconButton>,
    );
    expect(screen.getByLabelText("search")).toBeInTheDocument();
  });

  it("keeps icon-only sizes square", () => {
    render(
      <IconButton aria-label="small search" size="sm">
        <Search />
      </IconButton>,
    );
    const button = screen.getByLabelText("small search");

    expect(button).toHaveClass("h-11");
    expect(button).toHaveClass("w-11");
    expect(button).toHaveClass("px-0");
  });
});
