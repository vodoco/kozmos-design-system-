import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { PasswordInput } from "./PasswordInput";

afterEach(cleanup);

describe("PasswordInput", () => {
  it("renders a password field with label and placeholder", () => {
    render(<PasswordInput label="Password" placeholder="Enter password" />);

    const input = screen.getByLabelText("Password");
    expect(input).toHaveAttribute("type", "password");
    expect(input).toHaveAttribute("placeholder", "Enter password");
  });

  it("uses the shared 44px input height", () => {
    render(<PasswordInput />);

    expect(screen.getByLabelText(/show password/i)).toHaveClass("h-11", "w-11");
    expect(document.querySelector("input")).toHaveClass("h-11");
  });

  it("toggles password visibility", () => {
    render(<PasswordInput defaultValue="secret" />);

    const input = document.querySelector("input");
    const toggle = screen.getByRole("button", { name: /show password/i });

    expect(input).toHaveAttribute("type", "password");
    expect(toggle).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(toggle);

    expect(input).toHaveAttribute("type", "text");
    expect(
      screen.getByRole("button", { name: /hide password/i }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("supports controlled visibility", () => {
    const onVisibleChange = vi.fn();
    const { rerender } = render(
      <PasswordInput visible={false} onVisibleChange={onVisibleChange} />,
    );

    fireEvent.click(screen.getByRole("button", { name: /show password/i }));

    expect(onVisibleChange).toHaveBeenCalledWith(true);
    expect(document.querySelector("input")).toHaveAttribute("type", "password");

    rerender(<PasswordInput visible onVisibleChange={onVisibleChange} />);

    expect(document.querySelector("input")).toHaveAttribute("type", "text");
  });

  it("renders helper and error text with aria-describedby", () => {
    const { rerender } = render(
      <PasswordInput
        label="Password"
        helperText="Use at least 12 characters."
      />,
    );

    const helper = screen.getByText("Use at least 12 characters.");
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "aria-describedby",
      helper.id,
    );

    rerender(<PasswordInput label="Password" error="Password is required." />);

    const error = screen.getByText("Password is required.");
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "aria-describedby",
      error.id,
    );
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("can render without a visibility toggle", () => {
    render(<PasswordInput showToggle={false} />);

    expect(
      screen.queryByRole("button", { name: /show password/i }),
    ).not.toBeInTheDocument();
  });
});
