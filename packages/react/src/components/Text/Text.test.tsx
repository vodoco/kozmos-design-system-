import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Text } from "./Text";

describe("Text", () => {
  it("renders correctly", () => {
    render(<Text>Sample Text</Text>);
    expect(screen.getByText("Sample Text")).toBeInTheDocument();
  });

  it("renders as paragraph by default", () => {
    const { container } = render(<Text>Content</Text>);
    expect(container.querySelector("p")).toBeInTheDocument();
  });

  it("renders as span when specified", () => {
    const { container } = render(<Text as="span">Content</Text>);
    expect(container.querySelector("span")).toBeInTheDocument();
  });

  it("applies variant classes", () => {
    const { container } = render(
      <Text size="xl" weight="bold" color="primary">
        Content
      </Text>,
    );
    const el = container.firstChild;
    expect(el).toHaveClass("kozmos-text-xl");
    expect(el).toHaveClass("kozmos-text-bold");
    expect(el).toHaveClass("kozmos-text-primary");
  });
});
