import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DateRangePicker } from "./DateRangePicker";

describe("DateRangePicker", () => {
  it("emits a range as either date changes", () => {
    const handleValueChange = vi.fn();

    render(<DateRangePicker onValueChange={handleValueChange} />);

    fireEvent.change(screen.getByLabelText("Start date"), {
      target: { value: "2026-05-21" },
    });
    fireEvent.change(screen.getByLabelText("End date"), {
      target: { value: "2026-05-25" },
    });

    expect(handleValueChange).toHaveBeenLastCalledWith({
      start: "2026-05-21",
      end: "2026-05-25",
    });
  });

  it("links helper text to both date fields", () => {
    render(<DateRangePicker helperText="Choose both arrival dates." />);

    const helper = screen.getByText("Choose both arrival dates.");
    expect(screen.getByLabelText("Start date")).toHaveAttribute(
      "aria-describedby",
      helper.id,
    );
    expect(screen.getByLabelText("End date")).toHaveAttribute(
      "aria-describedby",
      helper.id,
    );
  });

  it("constrains each side of the range against the other", () => {
    render(
      <DateRangePicker
        defaultValue={{ start: "2026-05-21", end: "2026-05-25" }}
        min="2026-05-01"
        max="2026-05-31"
      />,
    );

    expect(screen.getByLabelText("Start date")).toHaveAttribute(
      "max",
      "2026-05-25",
    );
    expect(screen.getByLabelText("End date")).toHaveAttribute(
      "min",
      "2026-05-21",
    );
  });

  it("applies disabled and readonly state to both fields", () => {
    const { rerender } = render(<DateRangePicker disabled />);

    expect(screen.getByLabelText("Start date")).toBeDisabled();
    expect(screen.getByLabelText("End date")).toBeDisabled();

    rerender(<DateRangePicker readOnly />);

    expect(screen.getByLabelText("Start date")).toHaveAttribute("readonly");
    expect(screen.getByLabelText("End date")).toHaveAttribute("readonly");
  });
});
