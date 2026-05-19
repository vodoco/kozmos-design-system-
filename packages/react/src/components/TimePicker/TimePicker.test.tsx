import { render } from "@testing-library/react";
import { TimePicker } from "./TimePicker";
import { describe, it, expect } from "vitest";

describe("TimePicker", () => {
  it("renders time input", () => {
    render(<TimePicker />);
    // Just basic render check as type=time behavior varies
    expect(document.querySelector('input[type="time"]')).toBeInTheDocument();
  });
});
