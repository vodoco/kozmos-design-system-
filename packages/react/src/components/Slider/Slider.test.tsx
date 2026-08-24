import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Slider } from "./Slider";
import "@testing-library/jest-dom/vitest";

describe("Slider", () => {
  it("renders correctly", () => {
    render(<Slider defaultValue={[50]} max={100} />);
    expect(screen.getByRole("slider")).toBeInTheDocument();
  });

  it("renders a thumb for each range value", () => {
    render(<Slider defaultValue={[20, 80]} max={100} />);
    expect(screen.getAllByRole("slider")).toHaveLength(2);
    expect(
      screen.getByRole("slider", { name: "Minimum value" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("slider", { name: "Maximum value" }),
    ).toBeInTheDocument();
  });

  it("can reserve multiple thumbs before a value is supplied", () => {
    render(<Slider thumbCount={2} max={100} />);
    expect(screen.getAllByRole("slider")).toHaveLength(2);
  });

  it("renders label associated with the slider", () => {
    render(<Slider label="Volume" defaultValue={[50]} max={100} />);
    const label = screen.getByText("Volume");
    expect(label).toBeInTheDocument();
    expect(label.tagName).toBe("LABEL");
  });

  it("renders error message with aria-describedby linkage", () => {
    render(<Slider error="Value out of range" defaultValue={[50]} max={100} />);
    const slider = screen.getByRole("slider");
    expect(slider.closest('[aria-invalid="true"]')).toBeInTheDocument();

    const errorMessage = screen.getByText("Value out of range");
    expect(errorMessage).toBeInTheDocument();
  });

  it("renders boolean error without error text", () => {
    render(<Slider error={true} defaultValue={[50]} max={100} />);
    const slider = screen.getByRole("slider");
    expect(slider.closest('[aria-invalid="true"]')).toBeInTheDocument();
  });
});
