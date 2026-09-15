import { render, screen, fireEvent } from "@testing-library/react";
import { Tag } from "./Tag";
import { describe, it, expect, vi } from "vitest";

describe("Tag", () => {
  it("renders correctly", () => {
    render(<Tag>Test Tag</Tag>);
    expect(screen.getByText("Test Tag")).toBeInTheDocument();
  });

  it("handles remove click", () => {
    const handleRemove = vi.fn();
    render(<Tag onRemove={handleRemove}>Removable</Tag>);
    fireEvent.click(screen.getByRole("button", { name: /remove/i }));
    expect(handleRemove).toHaveBeenCalled();
  });

  describe("emotion", () => {
    it("leaves the variant untouched when it is not set", () => {
      const { container } = render(<Tag variant="secondary">Draft</Tag>);
      const tag = container.firstElementChild as HTMLElement;
      expect(tag.style.getPropertyValue("--kz-emotion-surface")).toBe("");
      expect(tag).toHaveClass("bg-secondary");
    });

    it("fills with the emotion's own pair", () => {
      const { container } = render(<Tag emotion="success">Open</Tag>);
      const tag = container.firstElementChild as HTMLElement;
      expect(tag.style.getPropertyValue("--kz-emotion-surface")).toBe(
        "var(--semantics-emotion-success-surface)",
      );
      expect(tag.style.getPropertyValue("--kz-emotion-on-surface")).toBe(
        "var(--semantics-emotion-success-on-surface)",
      );
      expect(tag).toHaveClass("bg-[var(--kz-emotion-surface)]");
    });

    it("reads as text and an edge when the variant is outline", () => {
      const { container } = render(
        <Tag emotion="danger" variant="outline">
          Closed
        </Tag>,
      );
      const tag = container.firstElementChild as HTMLElement;
      expect(tag).toHaveClass("text-[var(--kz-emotion-text)]");
      expect(tag).not.toHaveClass("bg-[var(--kz-emotion-surface)]");
    });

    it("lets the caller's own style win", () => {
      const { container } = render(
        <Tag emotion="alert" style={{ "--kz-emotion-surface": "red" } as never}>
          Late
        </Tag>,
      );
      const tag = container.firstElementChild as HTMLElement;
      expect(tag.style.getPropertyValue("--kz-emotion-surface")).toBe("red");
    });
  });
});
