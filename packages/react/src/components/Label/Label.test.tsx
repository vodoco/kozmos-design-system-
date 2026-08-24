import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, it, expect } from "vitest";
import { Label } from "./Label";

describe("Label", () => {
  it("renders correctly", () => {
    render(<Label>Test Content</Label>);
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });
});
