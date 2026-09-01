import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Chip } from "./Chip";

describe("Chip", () => {
  it("renders a non-interactive chip by default", () => {
    render(<Chip>Retail</Chip>);

    expect(screen.getByText("Retail")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /retail/i }),
    ).not.toBeInTheDocument();
  });

  it("supports selected interactive chips", () => {
    const onClick = vi.fn();

    render(
      <Chip selected onClick={onClick}>
        Food
      </Chip>,
    );

    const chip = screen.getByRole("button", { name: /food/i });
    expect(chip).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(chip);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("keeps the legacy active prop as a selected alias", () => {
    render(
      <Chip active onClick={() => undefined}>
        Coffee
      </Chip>,
    );

    expect(screen.getByRole("button", { name: /coffee/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("supports keyboard activation", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Chip onClick={onClick}>Open now</Chip>);

    screen.getByRole("button", { name: /open now/i }).focus();
    await user.keyboard("{Enter}");

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("keeps removable chips as sibling actions", () => {
    const onClick = vi.fn();
    const onRemove = vi.fn();

    render(
      <Chip onClick={onClick} onRemove={onRemove}>
        Open now
      </Chip>,
    );

    expect(screen.getAllByRole("button")).toHaveLength(2);
    fireEvent.click(screen.getByRole("button", { name: /remove open now/i }));

    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });
});
