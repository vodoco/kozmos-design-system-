import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Heading } from "./Heading";

describe("Heading", () => {
  it("renders correctly", () => {
    render(<Heading level={1}>Title</Heading>);
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Title").tagName).toBe("H1");
  });

  it("renders correct levels", () => {
    const { container } = render(<Heading level={3}>Subtitle</Heading>);
    expect(container.querySelector("h3")).toBeInTheDocument();
  });

  it("uses owned typography while preserving semantic tag overrides", () => {
    render(
      <Heading level={2} as="h3" className="consumer-title">
        Owned heading
      </Heading>,
    );
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveClass(
      "kozmos-text-3xl",
      "kozmos-text-bold",
      "consumer-title",
    );
  });
});
