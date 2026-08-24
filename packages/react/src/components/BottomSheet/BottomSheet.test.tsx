import { render, screen } from "@testing-library/react";
import {
  BottomSheet,
  BottomSheetContent,
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
});
