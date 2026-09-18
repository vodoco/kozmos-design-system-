import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { POIMediaGallery } from "./POIMediaGallery";

const media = [
  { id: "one", src: "/one.jpg", alt: "Shop entrance" },
  { id: "two", src: "/two.jpg", alt: "Accessible service counter" },
];

describe("POIMediaGallery", () => {
  it("shows a labelled failure and recovers when the source changes", () => {
    const props = {
      label: "Photos",
      positionLabel: (n: number) => String(n),
      unavailableLabel: "Photo unavailable",
    };
    const { rerender } = render(
      <POIMediaGallery {...props} media={[media[0]]} />,
    );
    fireEvent.error(screen.getByAltText("Shop entrance"));
    expect(
      screen.getByRole("img", { name: "Shop entrance: Photo unavailable" }),
    ).toBeVisible();
    rerender(
      <POIMediaGallery
        {...props}
        media={[{ ...media[0], src: "/replacement.jpg" }]}
      />,
    );
    expect(screen.getByAltText("Shop entrance")).toHaveAttribute(
      "src",
      "/replacement.jpg",
    );
  });
  it("provides labelled controls and announces position", () => {
    const onChange = vi.fn();
    render(
      <POIMediaGallery
        label="Burger King photos"
        media={media}
        onActiveIndexChange={onChange}
        positionLabel={(current, total) => `Image ${current} of ${total}`}
      />,
    );

    expect(screen.getByText("Image 1 of 2")).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Previous image" }),
    ).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Next image" }));
    expect(screen.getByText("Image 2 of 2")).toBeVisible();
    expect(onChange).toHaveBeenCalledWith(1);
    expect(screen.getByAltText("Accessible service counter")).toBeVisible();
  });

  it("renders nothing when real media is unavailable", () => {
    const { container } = render(
      <POIMediaGallery label="Photos" media={[]} positionLabel={() => ""} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
