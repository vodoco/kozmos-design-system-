import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it } from "vitest";
import { FieldWrapper } from "./FieldWrapper";

afterEach(cleanup);

describe("FieldWrapper", () => {
  it("renders label, description, content, and helper text", () => {
    render(
      <FieldWrapper
        description="Use clear supporting guidance."
        helperText="Helper text"
        label="Project name"
      >
        <input aria-label="Project name input" />
      </FieldWrapper>,
    );

    expect(screen.getByText("Project name")).toBeInTheDocument();
    expect(
      screen.getByText("Use clear supporting guidance."),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Project name input")).toBeInTheDocument();
    expect(screen.getByText("Helper text")).toBeInTheDocument();
  });

  it("shows required and optional label anatomy correctly", () => {
    const { rerender } = render(
      <FieldWrapper label="Email" required>
        <input aria-label="Email input" />
      </FieldWrapper>,
    );

    expect(screen.getByText("*")).toBeInTheDocument();

    rerender(
      <FieldWrapper label="Email" optionalText="Optional">
        <input aria-label="Email input" />
      </FieldWrapper>,
    );

    expect(screen.queryByText("*")).not.toBeInTheDocument();
    expect(screen.getByText("Optional")).toBeInTheDocument();
  });

  it("uses alert semantics for string errors", () => {
    render(
      <FieldWrapper error="This field is required." label="Name">
        <input aria-label="Name input" />
      </FieldWrapper>,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "This field is required.",
    );
  });
});
