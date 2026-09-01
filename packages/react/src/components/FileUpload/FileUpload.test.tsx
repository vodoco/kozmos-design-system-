import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FileUpload } from "./FileUpload";
import { describe, expect, it, vi } from "vitest";

describe("FileUpload", () => {
  it("renders upload area", () => {
    render(<FileUpload />);
    expect(screen.getByText(/Click to upload/i)).toBeInTheDocument();
  });

  it("emits selected files and renders the file list", async () => {
    const user = userEvent.setup();
    const handleFilesChange = vi.fn();
    const { container } = render(
      <FileUpload multiple maxFiles={2} onFilesChange={handleFilesChange} />,
    );
    const input = container.querySelector('input[type="file"]');
    const file = new File(["hello"], "report.csv", { type: "text/csv" });

    await user.upload(input as HTMLInputElement, file);

    expect(handleFilesChange).toHaveBeenCalledWith([file]);
    expect(screen.getByText("report.csv")).toBeInTheDocument();
  });

  it("shows a validation error when a file exceeds max size", async () => {
    const user = userEvent.setup();
    const { container } = render(<FileUpload maxSize={2} />);
    const input = container.querySelector('input[type="file"]');
    const file = new File(["too large"], "large.txt", { type: "text/plain" });

    await user.upload(input as HTMLInputElement, file);

    expect(screen.getByText("large.txt exceeds 2 B.")).toBeInTheDocument();
  });
});
