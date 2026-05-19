import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider, useTheme } from "./ThemeProvider";
import { describe, it, expect } from "vitest";

const TestComponent = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-value">{theme}</span>
      <button onClick={() => setTheme("dark")}>Set Dark</button>
    </div>
  );
};

describe("ThemeProvider", () => {
  it("provides theme context", () => {
    render(
      <ThemeProvider defaultTheme="light">
        <TestComponent />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("theme-value")).toHaveTextContent("light");
  });

  it("updates theme", () => {
    render(
      <ThemeProvider defaultTheme="light">
        <TestComponent />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByText("Set Dark"));
    expect(screen.getByTestId("theme-value")).toHaveTextContent("dark");
  });
});
