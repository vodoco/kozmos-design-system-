import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/react";
import { TimePicker } from "./TimePicker";
import { describe, it, expect } from "vitest";

describe("TimePicker", () => {
  it("renders time input", () => {
    render(<TimePicker />);
    // Just basic render check as type=time behavior varies
    expect(document.querySelector('input[type="time"]')).toBeInTheDocument();
  });

  it("links helper text through aria-describedby", () => {
    render(<TimePicker helperText="Use local time." />);

    const input = document.querySelector('input[type="time"]');
    const helper = document.querySelector("p");

    expect(input).toHaveAttribute("aria-describedby", helper?.id);
  });
});
