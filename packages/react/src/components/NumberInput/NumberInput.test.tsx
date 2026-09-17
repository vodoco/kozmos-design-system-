import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { NumberInput } from "./NumberInput";

afterEach(cleanup);

describe("NumberInput", () => {
  it("renders a native spinbutton", () => {
    render(<NumberInput label="Level" defaultValue={2} />);

    expect(screen.getByRole("spinbutton", { name: "Level" })).toHaveValue(2);
  });

  it("selects the owned field and stepper recipes", () => {
    render(<NumberInput defaultValue={1} />);

    expect(screen.getByRole("spinbutton")).toHaveClass("kozmos-input");
    expect(screen.getByRole("button", { name: /decrease value/i })).toHaveClass(
      "kozmos-field-action",
      "kozmos-number-decrement",
    );
    expect(screen.getByRole("button", { name: /increase value/i })).toHaveClass(
      "kozmos-field-action",
      "kozmos-number-increment",
    );
  });

  it("increments and decrements with the stepper controls", () => {
    const onValueChange = vi.fn();
    render(
      <NumberInput defaultValue={2} step={2} onValueChange={onValueChange} />,
    );

    fireEvent.click(screen.getByRole("button", { name: /increase value/i }));
    fireEvent.click(screen.getByRole("button", { name: /decrease value/i }));

    expect(onValueChange).toHaveBeenNthCalledWith(1, 4);
    expect(onValueChange).toHaveBeenNthCalledWith(2, 2);
    expect(screen.getByRole("spinbutton")).toHaveValue(2);
  });

  it("emits null when the field is cleared", () => {
    const onValueChange = vi.fn();
    render(<NumberInput defaultValue={4} onValueChange={onValueChange} />);

    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "" },
    });

    expect(onValueChange).toHaveBeenCalledWith(null);
  });

  it("does not change a controlled value until the parent accepts the step", () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <NumberInput value={2} onValueChange={onValueChange} />,
    );
    fireEvent.click(screen.getByRole("button", { name: /increase value/i }));
    expect(onValueChange).toHaveBeenCalledWith(3);
    expect(screen.getByRole("spinbutton")).toHaveValue(2);
    rerender(<NumberInput value={3} onValueChange={onValueChange} />);
    expect(screen.getByRole("spinbutton")).toHaveValue(3);
  });

  it("renders helper and error text with aria-describedby", () => {
    const { rerender } = render(
      <NumberInput label="Capacity" helperText="Use whole numbers." />,
    );

    const helper = screen.getByText("Use whole numbers.");
    expect(screen.getByRole("spinbutton")).toHaveAttribute(
      "aria-describedby",
      helper.id,
    );

    rerender(<NumberInput label="Capacity" error="Capacity is required." />);

    const error = screen.getByText("Capacity is required.");
    expect(screen.getByRole("spinbutton")).toHaveAttribute(
      "aria-describedby",
      error.id,
    );
    expect(screen.getByRole("spinbutton")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("can render without visible stepper controls", () => {
    render(<NumberInput showSteppers={false} />);

    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /increase value/i }),
    ).not.toBeInTheDocument();
  });

  it("keeps the numeric value readable while applying validation tone to the field", () => {
    render(<NumberInput defaultValue={12} status="warning" />);

    const spinbutton = screen.getByRole("spinbutton");
    expect(spinbutton).toHaveClass(
      "kozmos-input-warning",
      "kozmos-number-input",
    );
  });
});
