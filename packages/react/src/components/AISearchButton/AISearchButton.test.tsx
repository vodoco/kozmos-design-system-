import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { kozmosIconDefinitions } from "@kozmos-ds/icons";
import { Sparkles } from "lucide-react";
import { AISearchButton } from "./AISearchButton";

describe("AISearchButton", () => {
  it("is a button named by its label, its ring and icon silent", () => {
    const onClick = vi.fn();
    const { container } = render(<AISearchButton onClick={onClick} />);
    const button = screen.getByRole("button", { name: "AI search" });
    // Laid out at the prototype's 48; the 66 ring is drawn outside it.
    expect(button).toHaveClass("kozmos-ai-search", "h-12", "w-12");
    expect(container.querySelector(".kozmos-ai-search-ring")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("draws whatever the icon registry calls stars-01", () => {
    // The Figma painter draws `stars-01` from the Pointr Icon Library; the
    // registry names the same icon. The button imports the component directly,
    // because reaching it through `getIconComponent` would pull all 66 icons
    // into every consumer — so this is what keeps the two from drifting. When
    // `stars-01` gains its real Pointr vector, this fails and names the button.
    const definition = kozmosIconDefinitions.find(
      (entry) => entry.name === "stars-01",
    );
    expect(definition, "the registry no longer carries stars-01").toBeDefined();
    expect(
      definition?.component,
      "stars-01 now draws something other than the button's icon: point AISearchButton at it",
    ).toBe(Sparkles);
  });

  it("takes its own label", () => {
    render(<AISearchButton label="Ask the map" />);
    expect(
      screen.getByRole("button", { name: "Ask the map" }),
    ).toBeInTheDocument();
  });
});
