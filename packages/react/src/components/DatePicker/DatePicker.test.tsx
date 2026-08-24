import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DatePicker, DateRangePicker } from "./DatePicker";

describe("DatePicker", () => {
  it("renders date input", () => {
    render(<DatePicker data-testid="dp" />);
    const input = screen.getByTestId("dp");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "date");
  });

  it("renders label with correct htmlFor association", () => {
    render(<DatePicker label="Start date" data-testid="dp" />);
    const input = screen.getByTestId("dp");
    const label = screen.getByText("Start date");
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute("for", input.id);
  });

  it("renders error message with aria-describedby linkage", () => {
    render(<DatePicker error="Invalid date" data-testid="dp" />);
    const input = screen.getByTestId("dp");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby");

    const errorMessage = screen.getByText("Invalid date");
    expect(errorMessage).toBeInTheDocument();
    expect(input.getAttribute("aria-describedby")).toBe(errorMessage.id);
  });
});

describe("DateRangePicker", () => {
  it("emits a range as dates change", () => {
    const handleValueChange = vi.fn();

    render(<DateRangePicker onValueChange={handleValueChange} />);

    fireEvent.change(screen.getByLabelText("Start date"), {
      target: { value: "2026-05-24" },
    });
    fireEvent.change(screen.getByLabelText("End date"), {
      target: { value: "2026-05-30" },
    });

    expect(handleValueChange).toHaveBeenLastCalledWith({
      start: "2026-05-24",
      end: "2026-05-30",
    });
  });

  it("links helper text to both date fields", () => {
    render(<DateRangePicker helperText="Pick an arrival and departure." />);

    const helper = screen.getByText("Pick an arrival and departure.");
    expect(screen.getByLabelText("Start date")).toHaveAttribute(
      "aria-describedby",
      helper.id,
    );
    expect(screen.getByLabelText("End date")).toHaveAttribute(
      "aria-describedby",
      helper.id,
    );
  });
});
