import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { DesignConfigProvider, useDesignConfig } from "./DesignConfigContext";
import { useEffect } from "react";

// Helper component to expose context for testing
const TestController = ({ onUpdate }: { onUpdate?: (config: any) => void }) => {
  const context = useDesignConfig();
  useEffect(() => {
    if (onUpdate) onUpdate(context);
  }, [context, onUpdate]);

  return (
    <div>
      <button
        data-testid="set-refraction-100"
        onClick={() => context.updateGlassConfig({ refraction: 100 })}
      >
        Refraction 100
      </button>
      <button
        data-testid="set-depth-100"
        onClick={() => context.updateGlassConfig({ depth: 100 })}
      >
        Depth 100
      </button>
      <button
        data-testid="set-surface-20"
        onClick={() => context.updateGlassConfig({ surfaceScale: 20 })}
      >
        Surface 20
      </button>
      <button
        data-testid="set-frost-50"
        onClick={() => context.updateGlassConfig({ frost: 50 })}
      >
        Frost 50
      </button>
      <button
        data-testid="set-specular-100"
        onClick={() => context.updateGlassConfig({ specular: 100 })}
      >
        Specular 100
      </button>
    </div>
  );
};

describe("Glass Engine Controls", () => {
  beforeEach(() => {
    // Clear storage to ensure clean state
    localStorage.clear();
  });

  const renderWithProvider = (ui: React.ReactNode) => {
    // Persistence is opt-in; null is also accepted for compatibility.
    return render(
      <DesignConfigProvider persistKey={null}>{ui}</DesignConfigProvider>,
    );
  };

  it("Refraction (Displacement) should control Scale and Blur", async () => {
    const { getByTestId, container } = renderWithProvider(<TestController />);

    // Initial State (Default Refraction 40, Frost 10)
    // Scale = 1 + (40/100)*0.05 = 1.02
    // Base Blur = 40/2 = 20
    // Frost Blur = 10/5 = 2
    // Total Blur = 22px
    const root = container.firstElementChild as HTMLElement;

    expect(root.style.getPropertyValue("--glass-scale")).toBe("1.02");
    expect(root.style.getPropertyValue("--glass-blur")).toBe("22px");

    // Update to 100
    fireEvent.click(getByTestId("set-refraction-100"));

    // Expected: Scale = 1 + (100/100)*0.05 = 1.05
    expect(root.style.getPropertyValue("--glass-scale")).toBe("1.05");

    // Blur Calculation:
    // Refraction 100 -> Base Blur = 50
    // Frost is still default 10 -> Frost Blur = 2
    // Total = 52px
    expect(root.style.getPropertyValue("--glass-blur")).toBe("52px");
  });

  it("Depth (Light Distance) should control Inner Shadow", async () => {
    const { getByTestId, container } = renderWithProvider(<TestController />);
    const root = container.firstElementChild as HTMLElement;

    // Update to 100
    fireEvent.click(getByTestId("set-depth-100"));

    // Depth 100 -> depthOpacity = 0.6, rimOpacity = 0.8
    const shadow = root.style.getPropertyValue("--glass-inner-shadow");
    expect(shadow).toContain("rgba(255, 255, 255, 0.8)"); // Rim
    expect(shadow).toContain("rgba(0, 0, 0, 0.6)"); // Volume
  });

  it("Surface Scale (Roughness) should control Surface Opacity", async () => {
    const { getByTestId, container } = renderWithProvider(<TestController />);
    const root = container.firstElementChild as HTMLElement;

    // Update to 20 (Max)
    fireEvent.click(getByTestId("set-surface-20"));

    // Surface 20 -> 20/10 * 0.3 = 0.6 opacity
    expect(root.style.getPropertyValue("--glass-surface-opacity")).toBe("0.6");
    const filter = container.querySelector("filter")!;
    expect(root.style.getPropertyValue("--glass-surface-filter")).toBe(
      `url("#${filter.id}")`,
    );
  });

  it("Frost (Blur) should control additional Blur", async () => {
    const { getByTestId, container } = renderWithProvider(<TestController />);
    const root = container.firstElementChild as HTMLElement;

    // Default Config: Refraction 40 -> Base Blur 20
    // Default Config: Frost 10 -> Frost Blur 2
    // Total = 22px

    // Set Frost to 50
    fireEvent.click(getByTestId("set-frost-50"));

    // Refraction 40 -> Base Blur 20px
    // Frost 50 -> Frost Blur (50/5) = 10px
    // Total = 30px
    expect(root.style.getPropertyValue("--glass-blur")).toBe("30px");
  });

  it("Specular (Shininess) should control Border Opacity", async () => {
    const { getByTestId, container } = renderWithProvider(<TestController />);
    const root = container.firstElementChild as HTMLElement;

    // Set Specular to 100
    fireEvent.click(getByTestId("set-specular-100"));

    // Specular 100 -> Border Opacity 1.0
    expect(root.style.getPropertyValue("--glass-bevel-opacity")).toBe("1");
  });
});
