import { render, screen } from "@testing-library/react";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetTitle,
  BottomSheetTrigger,
} from "./BottomSheet";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";

describe("BottomSheet", () => {
  it("renders trigger", () => {
    render(
      <BottomSheet>
        <BottomSheetTrigger>Open</BottomSheetTrigger>
        <BottomSheetContent>Content</BottomSheetContent>
      </BottomSheet>,
    );
    expect(screen.getByText("Open")).toBeInTheDocument();
  });

  it("names the sheet from the title prop without drawing it", () => {
    render(
      <BottomSheet open>
        <BottomSheetContent title="About this place">
          <p>Body</p>
        </BottomSheetContent>
      </BottomSheet>,
    );

    const dialog = screen.getByRole("dialog");
    const labelledBy = dialog.getAttribute("aria-labelledby");
    expect(labelledBy).toBeTruthy();

    const title = document.getElementById(labelledBy as string);
    expect(title).toHaveTextContent("About this place");
    // Named for a screen reader, drawn for nobody.
    expect(title).toHaveClass("sr-only");
  });

  it("leaves a caller's own title alone", () => {
    render(
      <BottomSheet open>
        <BottomSheetContent>
          <BottomSheetTitle>Visible title</BottomSheetTitle>
        </BottomSheetContent>
      </BottomSheet>,
    );

    expect(screen.getByText("Visible title")).not.toHaveClass("sr-only");
  });
});
