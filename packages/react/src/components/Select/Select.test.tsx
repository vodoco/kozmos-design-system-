import { render, screen, cleanup } from "@testing-library/react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./Select";
import { describe, it, expect, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";

afterEach(cleanup);

describe("Select", () => {
  it("merges consumer descriptions without allowing an error to be hidden", () => {
    render(
      <>
        <p id="hint">Choose one</p>
        <Select>
          <SelectTrigger
            aria-label="Fruit"
            aria-describedby="hint"
            aria-invalid={false}
            error="Required"
          >
            <SelectValue />
          </SelectTrigger>
        </Select>
      </>,
    );
    const trigger = screen.getByRole("combobox", { name: "Fruit" });
    expect(trigger).toHaveAttribute("aria-invalid", "true");
    expect(trigger).toHaveAccessibleDescription("Choose one Required");
  });
  it("renders correctly", () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(screen.getByText("Select")).toBeInTheDocument();
  });

  it("renders error messages and aria attributes correctly", () => {
    const { getByRole, getByText } = render(
      <Select>
        <SelectTrigger error="Selection required">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
      </Select>,
    );
    const trigger = getByRole("combobox");
    expect(trigger).toHaveAttribute("aria-invalid", "true");
    expect(trigger).toHaveAttribute("aria-describedby");

    const errorMessage = getByText("Selection required");
    expect(errorMessage).toBeInTheDocument();
    expect(trigger.getAttribute("aria-describedby")).toBe(errorMessage.id);
  });
});
