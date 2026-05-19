import { render, screen } from "@testing-library/react";
import { FileUpload } from "./FileUpload";
import { describe, it, expect } from "vitest";

describe("FileUpload", () => {
  it("renders upload area", () => {
    render(<FileUpload />);
    expect(screen.getByText(/Click to upload/i)).toBeInTheDocument();
  });
});
