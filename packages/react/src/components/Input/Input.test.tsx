import { render, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { Input } from "./Input";
import "@testing-library/jest-dom/vitest";

afterEach(cleanup);

describe("Input", () => {
  it("renders correctly", () => {
    const { getByRole } = render(<Input />);
    expect(getByRole("textbox")).toBeInTheDocument();
  });

  it("renders label and placeholder text", () => {
    const { getByLabelText } = render(
      <Input label="Email" placeholder="Email address" />,
    );
    const input = getByLabelText("Email");
    expect(input).toHaveAttribute("placeholder", "Email address");
  });

  it("uses the 44px field height class", () => {
    const { getByRole } = render(<Input />);
    expect(getByRole("textbox")).toHaveClass("h-11");
  });

  it("renders error messages and aria attributes correctly", () => {
    const { getByRole, getByText } = render(
      <Input error="This is an error message" />,
    );
    const input = getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby");

    const errorMessage = getByText("This is an error message");
    expect(errorMessage).toBeInTheDocument();

    const errorId = input.getAttribute("aria-describedby");
    expect(errorId).toBe(errorMessage.id);
  });

  it("supports boolean error state without an error description", () => {
    const { getByRole, queryByText } = render(<Input error />);
    const input = getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).not.toHaveAttribute("aria-describedby");
    expect(queryByText("true")).not.toBeInTheDocument();
  });

  it("renders helper text with aria-describedby linkage", () => {
    const { getByRole, getByText } = render(
      <Input helperText="Use your work email." />,
    );
    const input = getByRole("textbox");
    const helperText = getByText("Use your work email.");
    expect(input).toHaveAttribute("aria-describedby", helperText.id);
    expect(input).not.toHaveAttribute("aria-invalid");
  });

  it("supports warning and success validation tones", () => {
    const { getByRole, rerender } = render(
      <Input status="warning" helperText="Check this value." />,
    );
    expect(getByRole("textbox")).toHaveClass("border-warning");
    expect(getByRole("textbox")).not.toHaveAttribute("aria-invalid");

    rerender(<Input status="success" helperText="Looks good." />);
    expect(getByRole("textbox")).toHaveClass("border-success");
  });

  it("treats status error as invalid for assistive tech", () => {
    const { getByRole } = render(
      <Input status="error" helperText="Invalid value." />,
    );
    expect(getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("passes disabled through to the native input", () => {
    const { getByRole } = render(<Input disabled />);
    expect(getByRole("textbox")).toBeDisabled();
  });

  it("passes readOnly through to the native input", () => {
    const { getByRole } = render(<Input readOnly />);
    expect(getByRole("textbox")).toHaveAttribute("readonly");
  });
});
