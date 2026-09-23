import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PasswordInput } from "../PasswordInput";
import { NumberInput } from "../NumberInput";

afterEach(cleanup);

describe.each([
  ["PasswordInput", PasswordInput],
  ["NumberInput", NumberInput],
] as const)("%s accessibility composition", (_name, Control) => {
  it.each(["helper", "error"])(
    "merges external and owned %s descriptions",
    (kind) => {
      render(
        <Control
          label="Value"
          aria-describedby="external external"
          {...(kind === "helper"
            ? { helperText: "Owned message" }
            : { error: "Owned message" })}
        />,
      );
      expect(screen.getByLabelText("Value")).toHaveAttribute(
        "aria-describedby",
        `external ${screen.getByText("Owned message").id}`,
      );
    },
  );

  it("preserves caller invalid semantics without a component error", () => {
    render(<Control label="Value" aria-invalid="grammar" />);
    expect(screen.getByLabelText("Value")).toHaveAttribute(
      "aria-invalid",
      "grammar",
    );
  });

  it("does not let a caller conceal a component error", () => {
    render(
      <Control label="Value" error="Invalid value" aria-invalid={false} />,
    );
    expect(screen.getByLabelText("Value")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("keeps the helper when error is an empty string", () => {
    render(
      <Control
        label="Value"
        error=""
        helperText="Owned message"
        aria-describedby="external"
      />,
    );
    expect(screen.getByLabelText("Value")).toHaveAttribute(
      "aria-describedby",
      `external ${screen.getByText("Owned message").id}`,
    );
  });
});
