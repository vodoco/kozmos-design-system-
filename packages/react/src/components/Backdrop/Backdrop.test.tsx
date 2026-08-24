import { render } from "@testing-library/react";
import { Backdrop } from "./Backdrop";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";

describe("Backdrop", () => {
  it("renders correctly", () => {
    const { container } = render(<Backdrop />);
    expect(container.firstChild).toHaveClass("fixed inset-0");
  });

  it("does not render when not visible", () => {
    const { container } = render(<Backdrop visible={false} />);
    expect(container.firstChild).toBeNull();
  });
});
