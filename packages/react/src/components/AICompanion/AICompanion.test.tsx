import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  ActionCard,
  AICompanionPanel,
  AIInputBar,
  AIMessage,
  AIMessageList,
  UserMessage,
} from "./index";

describe("AICompanion", () => {
  it("announces the thread politely, as a log", () => {
    // Story 5 AC2 and Story 10: turns arrive over time and must be heard
    // without taking the visitor's place. Assertive would interrupt.
    render(
      <AIMessageList>
        <AIMessage>Hello</AIMessage>
      </AIMessageList>,
    );
    const log = screen.getByRole("log");
    expect(log).toHaveAttribute("aria-live", "polite");
    expect(log).toHaveAccessibleName("Assistant conversation");
  });

  it("streams an acknowledgement beside its dots, not instead of it", () => {
    // Story 10 counts a streamed acknowledgement as the first visible
    // response, so the words must show while the dots are still going.
    render(<AIMessage status="streaming">Looking through this building…</AIMessage>);
    expect(screen.getByText("Looking through this building…")).toBeVisible();
    expect(screen.getByText("Assistant is replying")).toHaveClass("sr-only");
  });

  it("says plainly when a turn timed out", () => {
    render(<AIMessage status="timedOut" />);
    expect(
      screen.getByText("The assistant did not reply in time."),
    ).toBeVisible();
  });

  it("never sends an empty or whitespace-only question", () => {
    const onSubmit = vi.fn();
    const { rerender } = render(
      <AIInputBar onSubmit={onSubmit} onValueChange={vi.fn()} value="   " />,
    );
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
    fireEvent.submit(screen.getByRole("button", { name: "Send" }).closest("form")!);
    expect(onSubmit).not.toHaveBeenCalled();

    rerender(
      <AIInputBar
        onSubmit={onSubmit}
        onValueChange={vi.fn()}
        value="  where is a quiet desk  "
      />,
    );
    fireEvent.submit(screen.getByRole("button", { name: "Send" }).closest("form")!);
    // Trimmed: the product should never have to trim what it is handed.
    expect(onSubmit).toHaveBeenCalledWith("where is a quiet desk");
  });

  it("opens without a close button when the host has no way to close it", () => {
    // Story 18 lets a host turn the assistant off; Story 5 AC1 says the panel
    // must tolerate AISearchButton being absent.
    const { rerender } = render(<AICompanionPanel />);
    expect(
      screen.queryByRole("button", { name: "Close assistant" }),
    ).not.toBeInTheDocument();

    const onClose = vi.fn();
    rerender(<AICompanionPanel onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "Close assistant" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("distinguishes the visitor's turn from the assistant's", () => {
    const { container } = render(
      <AIMessageList>
        <AIMessage>Assistant turn</AIMessage>
        <UserMessage>Visitor turn</UserMessage>
      </AIMessageList>,
    );
    // Side and fill, not colour alone.
    expect(container.querySelector(".justify-end")).not.toBeNull();
    expect(screen.getByText("Visitor turn")).toHaveClass("bg-primary");
  });

  it("carries rich content under a turn without reimplementing it", () => {
    render(
      <AIMessage actionCard={<ActionCard title="2 results">rows</ActionCard>}>
        Here is what I found
      </AIMessage>,
    );
    expect(screen.getByText("2 results")).toBeVisible();
    expect(screen.getByText("rows")).toBeVisible();
  });
});
