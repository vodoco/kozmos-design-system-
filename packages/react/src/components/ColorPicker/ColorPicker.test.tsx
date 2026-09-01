import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { ColorPicker } from "./ColorPicker";

afterEach(cleanup);

describe("ColorPicker", () => {
  it("renders an editable hex field with a label", () => {
    render(<ColorPicker label="Brand color" defaultValue="#135bec" />);

    expect(screen.getByRole("textbox", { name: "Brand color" })).toHaveValue(
      "#135BEC",
    );
  });

  it("emits normalized values from text and native color input changes", () => {
    const onValueChange = vi.fn();
    render(<ColorPicker label="Brand color" onValueChange={onValueChange} />);

    fireEvent.change(screen.getByRole("textbox", { name: "Brand color" }), {
      target: { value: "#abc" },
    });
    fireEvent.change(screen.getByLabelText("Brand color color"), {
      target: { value: "#7c3aed" },
    });

    expect(onValueChange).toHaveBeenNthCalledWith(1, "#AABBCC");
    expect(onValueChange).toHaveBeenNthCalledWith(2, "#7C3AED");
  });

  it("renders preset buttons that can choose a color", () => {
    const onValueChange = vi.fn();
    render(
      <ColorPicker
        defaultOpen
        label="Theme"
        presets={["#135bec", "#0f766e"]}
        onValueChange={onValueChange}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Use #0F766E" }));

    expect(onValueChange).toHaveBeenCalledWith("#0F766E");
  });

  it("exposes responsive picker controls when expanded", () => {
    const onOpenChange = vi.fn();
    const onAlphaChange = vi.fn();
    const onFormatChange = vi.fn();

    render(
      <ColorPicker
        label="Theme"
        onAlphaChange={onAlphaChange}
        onFormatChange={onFormatChange}
        onOpenChange={onOpenChange}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Show color picker" }));

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(
      screen.getByRole("button", { name: "Choose saturation and lightness" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Hue")).toBeInTheDocument();
    expect(screen.getByLabelText("Color palette")).toHaveValue(
      "Kozmos Design System 2.0",
    );
    expect(screen.queryByLabelText("Hex value")).toBeNull();

    fireEvent.change(screen.getByLabelText("Opacity"), {
      target: { value: "72" },
    });
    fireEvent.change(screen.getByLabelText("Color format"), {
      target: { value: "rgb" },
    });

    expect(onAlphaChange).toHaveBeenCalledWith(72);
    expect(onFormatChange).toHaveBeenCalledWith("rgb");

    fireEvent.change(screen.getByLabelText("Color format"), {
      target: { value: "hex" },
    });

    expect(screen.getByLabelText("Hex value")).toHaveValue("#135BEC");
  });

  it("links helper and error text through aria-describedby", () => {
    const { rerender } = render(
      <ColorPicker label="Theme" helperText="Use a six digit hex value." />,
    );

    const helper = screen.getByText("Use a six digit hex value.");
    expect(screen.getByRole("textbox", { name: "Theme" })).toHaveAttribute(
      "aria-describedby",
      helper.id,
    );

    rerender(<ColorPicker label="Theme" error="Color is required." />);

    const error = screen.getByText("Color is required.");
    expect(screen.getByRole("textbox", { name: "Theme" })).toHaveAttribute(
      "aria-describedby",
      error.id,
    );
    expect(screen.getByRole("textbox", { name: "Theme" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("can hide preset controls for compact forms", () => {
    render(<ColorPicker showPresets={false} />);

    expect(screen.queryByRole("group", { name: /presets/i })).toBeNull();
  });
});
