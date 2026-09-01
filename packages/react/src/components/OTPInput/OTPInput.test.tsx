import { render, fireEvent, screen } from "@testing-library/react";
import { OTPInput } from "./OTPInput";
import { describe, expect, it, vi } from "vitest";

describe("OTPInput", () => {
  it("renders correct number of inputs", () => {
    render(<OTPInput length={4} />);
    expect(screen.getAllByRole("textbox")).toHaveLength(4);
  });

  it("normalizes invalid lengths to one input", () => {
    render(<OTPInput length={0} />);
    expect(screen.getAllByRole("textbox")).toHaveLength(1);
  });

  it("focuses next input on change", () => {
    render(<OTPInput length={4} />);
    const inputs = screen.getAllByRole("textbox");
    fireEvent.change(inputs[0], { target: { value: "1" } });
    expect(document.activeElement).toBe(inputs[1]);
  });

  it("renders error messages and aria attributes correctly", () => {
    render(<OTPInput length={4} error="OTP is invalid" />);
    const inputs = screen.getAllByRole("textbox");
    inputs.forEach((input) => {
      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(input).toHaveAttribute("aria-describedby");
      const errorId = input.getAttribute("aria-describedby");
      expect(document.getElementById(errorId!)).toBeInTheDocument();
    });
    expect(screen.getByText("OTP is invalid")).toBeInTheDocument();
  });

  it("associates the label and helper text with the first digit", () => {
    render(
      <OTPInput
        helperText="Enter the code we sent."
        id="verification-code"
        label="Verification code"
        length={4}
      />,
    );

    expect(screen.getByLabelText("Verification code")).toHaveAttribute(
      "id",
      "verification-code",
    );
    expect(screen.getByText("Enter the code we sent.")).toBeInTheDocument();
  });

  it("does not change values while read only", () => {
    const handleChange = vi.fn();
    render(
      <OTPInput length={4} onChange={handleChange} readOnly value="1234" />,
    );

    const inputs = screen.getAllByRole("textbox");
    fireEvent.change(inputs[0], { target: { value: "9" } });

    expect(handleChange).not.toHaveBeenCalled();
    expect(inputs[0]).toHaveValue("1");
  });

  it("sanitizes controlled values to digits", () => {
    render(<OTPInput length={4} value="1a 2-3" />);

    const inputs = screen.getAllByRole("textbox");
    expect(inputs.map((input) => (input as HTMLInputElement).value)).toEqual([
      "1",
      "2",
      "3",
      "",
    ]);
  });

  it("sanitizes pasted codes", () => {
    const handleChange = vi.fn();
    render(<OTPInput length={4} onChange={handleChange} />);

    const inputs = screen.getAllByRole("textbox");
    fireEvent.paste(inputs[0], {
      clipboardData: {
        getData: () => "12-34",
      },
    });

    expect(handleChange).toHaveBeenCalledWith("1234");
    expect(inputs.map((input) => (input as HTMLInputElement).value)).toEqual([
      "1",
      "2",
      "3",
      "4",
    ]);
  });
});
