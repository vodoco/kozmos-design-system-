import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { SearchBar } from "./SearchBar";

afterEach(cleanup);

describe("SearchBar", () => {
  it("renders the search input with placeholder and value", () => {
    render(
      <SearchBar
        placeholder="Search places"
        value="Station"
        onChange={() => {}}
      />,
    );

    const input = screen.getByPlaceholderText("Search places");
    expect(input).toHaveValue("Station");
  });

  it("emits value changes", () => {
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} />);

    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "Library" },
    });

    expect(onChange).toHaveBeenCalledWith("Library");
  });

  it("clears the value and calls onClear", () => {
    const onChange = vi.fn();
    const onClear = vi.fn();
    render(<SearchBar value="Museum" onChange={onChange} onClear={onClear} />);

    fireEvent.click(screen.getByRole("button", { name: "Clear search" }));

    expect(onChange).toHaveBeenCalledWith("");
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("does not render a clear button for an empty value", () => {
    render(<SearchBar value="" onChange={() => {}} />);
    expect(
      screen.queryByRole("button", { name: "Clear search" }),
    ).not.toBeInTheDocument();
  });

  it("passes disabled and readOnly through to the input", () => {
    const { rerender } = render(
      <SearchBar value="" onChange={() => {}} disabled />,
    );
    expect(screen.getByRole("searchbox")).toBeDisabled();

    rerender(<SearchBar value="" onChange={() => {}} readOnly />);
    expect(screen.getByRole("searchbox")).toHaveAttribute("readonly");
  });
});
