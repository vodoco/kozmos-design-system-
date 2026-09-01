import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FeedbackCard } from "./FeedbackCard";

describe("FeedbackCard", () => {
  it("requires a rating before submit", () => {
    render(<FeedbackCard />);

    expect(
      screen.getByRole("button", { name: /submit feedback/i }),
    ).toBeDisabled();
  });

  it("submits rating and comment", () => {
    const onSubmitFeedback = vi.fn();

    render(<FeedbackCard onSubmitFeedback={onSubmitFeedback} />);

    fireEvent.click(screen.getByLabelText("Rate 4 out of 5 stars"));
    fireEvent.change(
      screen.getByPlaceholderText("Tell us more about your experience..."),
      {
        target: { value: "Clear route and signage." },
      },
    );
    fireEvent.click(screen.getByRole("button", { name: /submit feedback/i }));

    expect(onSubmitFeedback).toHaveBeenCalledWith(
      4,
      "Clear route and signage.",
    );
    expect(screen.getByText("Thank you for the feedback!")).toBeInTheDocument();
  });
});
