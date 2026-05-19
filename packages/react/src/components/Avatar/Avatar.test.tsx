import { render, screen } from "@testing-library/react";
import { Avatar, AvatarFallback } from "./Avatar";
import { describe, it, expect } from "vitest";

describe("Avatar", () => {
  it("renders fallback when image is missing", () => {
    render(
      <Avatar>
        <AvatarFallback>FB</AvatarFallback>
      </Avatar>,
    );
    expect(screen.getByText("FB")).toBeInTheDocument();
  });
});
