import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SegmentedControl } from "./SegmentedControl";

const items = [
  { value: "one", label: "One" },
  { value: "two", label: "Two" },
  { value: "three", label: "Three" },
];

describe("SegmentedControl", () => {
  it("renders items as a single-choice segmented group", () => {
    render(<SegmentedControl defaultValue="one" items={items} />);

    expect(screen.getByRole("group")).toHaveAttribute(
      "aria-label",
      "Segmented control",
    );
    expect(screen.getByRole("radio", { name: "One" })).toHaveAttribute(
      "data-state",
      "on",
    );
    expect(screen.getByRole("radio", { name: "Two" })).toBeInTheDocument();
  });

  it("calls onValueChange when a segment is selected", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <SegmentedControl
        defaultValue="one"
        items={items}
        onValueChange={onValueChange}
      />,
    );

    await user.click(screen.getByRole("radio", { name: "Two" }));

    expect(onValueChange).toHaveBeenCalledWith("two");
  });

  it("uses the visible label as the group name", () => {
    render(<SegmentedControl items={items} label="View mode" />);

    expect(
      screen.getByRole("group", { name: "View mode" }),
    ).toBeInTheDocument();
  });

  it("marks the group invalid when an error is present", () => {
    render(<SegmentedControl error="Choose one" items={items} />);

    expect(screen.getByRole("group")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Choose one")).toBeInTheDocument();
  });

  it("reports a deselect as undefined, not as an empty string", async () => {
    // Pressing the segment that already holds the pill takes the choice back.
    // Radix calls that "", which is a value no `items` entry can have — so a
    // consumer typing its handler against its own union had to remember to
    // guard, and one of them cast instead and laundered "" past TypeScript.
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <SegmentedControl
        defaultValue="one"
        items={items}
        onValueChange={onValueChange}
      />,
    );

    await user.click(screen.getByRole("radio", { name: "One" }));

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith(undefined);
    expect(onValueChange).not.toHaveBeenCalledWith("");
  });

  it("still reports a normal selection as its value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <SegmentedControl
        defaultValue="one"
        items={items}
        onValueChange={onValueChange}
      />,
    );

    await user.click(screen.getByRole("radio", { name: "Two" }));
    expect(onValueChange).toHaveBeenCalledWith("two");
  });
});
