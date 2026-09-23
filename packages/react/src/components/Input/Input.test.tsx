import { render, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { Input } from "./Input";
import "@testing-library/jest-dom/vitest";

afterEach(cleanup);

describe("Input", () => {
  it("does not let an empty error string hide linked helper text", () => {
    const { getByRole, getByText } = render(
      <Input error="" helperText="Guidance" />,
    );
    expect(getByRole("textbox")).toHaveAttribute(
      "aria-describedby",
      getByText("Guidance").id,
    );
  });
  it("retains caller descriptions alongside its error message", () => {
    const { getByRole } = render(
      <Input error="Required" aria-describedby=" caller-help  caller-help " />,
    );
    expect(
      getByRole("textbox").getAttribute("aria-describedby")?.split(/\s+/),
    ).toEqual(["caller-help", getByRole("alert").id]);
  });

  it("retains caller descriptions alongside helper text", () => {
    const { getByRole, getByText } = render(
      <Input helperText="Guidance" aria-describedby="caller-help" />,
    );
    expect(
      getByRole("textbox").getAttribute("aria-describedby")?.split(/\s+/),
    ).toEqual(["caller-help", getByText("Guidance").id]);
  });

  it("does not let aria-invalid=false conceal an error status", () => {
    const { getByRole } = render(<Input status="error" aria-invalid={false} />);
    expect(getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("preserves caller invalid semantics when no component error is set", () => {
    const { getByRole } = render(<Input aria-invalid="spelling" />);
    expect(getByRole("textbox")).toHaveAttribute("aria-invalid", "spelling");
  });
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

  it("uses the owned input recipe (geometry is checked in built browsers)", () => {
    const { getByRole } = render(<Input />);
    expect(getByRole("textbox")).toHaveClass("kozmos-reset", "kozmos-input");
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
    expect(getByRole("textbox")).toHaveClass("kozmos-input-warning");
    expect(getByRole("textbox")).not.toHaveAttribute("aria-invalid");

    rerender(<Input status="success" helperText="Looks good." />);
    expect(getByRole("textbox")).toHaveClass("kozmos-input-success");
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
