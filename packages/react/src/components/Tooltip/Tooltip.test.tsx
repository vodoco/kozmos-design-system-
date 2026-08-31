import { render, screen } from "@testing-library/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./Tooltip";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";

describe("Tooltip", () => {
  it("renders trigger correctly", () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Content</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    expect(screen.getByText("Hover me")).toBeInTheDocument();
  });

  it("renders tooltip content in the DOM (sr-only until activated)", () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Content</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    // Radix renders tooltip content as a visually hidden span for screen readers
    // even before pointer activation. With open=true, the content should be queryable.
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("keeps a disabled trigger reachable by keyboard", () => {
    // The case the whole prop exists for. A disabled <button> emits no
    // pointer events and cannot take focus, so without the wrapper the
    // tooltip is silently dead — and a wrapper WITHOUT tabIndex is dead
    // only for keyboard users, which is worse because hovering still works
    // and it looks fixed.
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger disabled>
            <button disabled>Combine</button>
          </TooltipTrigger>
          <TooltipContent>Select two adjacent levels first</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    const button = screen.getByText("Combine");
    const wrapper = button.parentElement as HTMLElement;
    expect(wrapper).toHaveAttribute("data-disabled-trigger");
    expect(wrapper).toHaveAttribute("tabindex", "0");

    wrapper.focus();
    expect(document.activeElement).toBe(wrapper);
  });

  it("does not wrap a trigger that is not disabled", () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Content</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    expect(document.querySelector("[data-disabled-trigger]")).toBeNull();
  });
});
