import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { POIMediaGallery } from "./POIMediaGallery";

const media = [
  { id: "one", src: "/one.jpg", alt: "Shop entrance" },
  { id: "two", src: "/two.jpg", alt: "Accessible service counter" },
];

describe("POIMediaGallery", () => {
  it("uses semantic image steps for keyboard navigation", () => {
    const onChange = vi.fn();
    render(
      <POIMediaGallery
        label="Photos"
        media={media}
        onActiveIndexChange={onChange}
        positionLabel={(n) => `Image ${n}`}
      />,
    );
    const list = screen.getByRole("list", { name: "Photos" });
    fireEvent.keyDown(list, { key: "End" });
    expect(screen.getByText("Image 2")).toBeVisible();
    fireEvent.keyDown(list, { key: "Home" });
    expect(screen.getByText("Image 1")).toBeVisible();
    expect(onChange.mock.calls.map(([index]) => index)).toEqual([1, 0]);
  });

  it("emits controlled requests without silently accepting them", () => {
    const onChange = vi.fn();
    const props = {
      label: "Photos",
      media,
      activeIndex: 0,
      onActiveIndexChange: onChange,
      positionLabel: (n: number) => `Image ${n}`,
    };
    const { rerender } = render(<POIMediaGallery {...props} />);
    fireEvent.keyDown(screen.getByRole("list"), { key: "End" });
    expect(onChange).toHaveBeenCalledWith(1);
    expect(screen.getByText("Image 1")).toBeVisible();
    rerender(<POIMediaGallery {...props} activeIndex={1} />);
    expect(screen.getByText("Image 2")).toBeVisible();
  });

  it("synchronizes native scrolling with state and announcements", () => {
    const onChange = vi.fn();
    render(
      <POIMediaGallery
        label="Photos"
        media={media}
        onActiveIndexChange={onChange}
        positionLabel={(n) => `Image ${n}`}
      />,
    );
    const list = screen.getByRole("list");
    vi.spyOn(list, "getBoundingClientRect").mockReturnValue(
      new DOMRect(0, 0, 200, 100),
    );
    vi.spyOn(list.children[0], "getBoundingClientRect").mockReturnValue(
      new DOMRect(-200, 0, 200, 100),
    );
    vi.spyOn(list.children[1], "getBoundingClientRect").mockReturnValue(
      new DOMRect(0, 0, 200, 100),
    );
    fireEvent.scroll(list);
    expect(screen.getByText("Image 2")).toBeVisible();
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("resolves out-of-range state when media shrinks or becomes empty", () => {
    const props = {
      label: "Photos",
      positionLabel: (n: number) => `Image ${n}`,
    };
    const { rerender } = render(
      <POIMediaGallery {...props} media={media} defaultActiveIndex={1} />,
    );
    expect(screen.getByText("Image 2")).toBeVisible();
    rerender(<POIMediaGallery {...props} media={[media[0]]} />);
    expect(screen.getByText("Image 1")).toBeVisible();
    rerender(<POIMediaGallery {...props} media={media} />);
    expect(screen.getByText("Image 1")).toBeVisible();
    rerender(<POIMediaGallery {...props} media={[]} />);
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    rerender(<POIMediaGallery {...props} media={media} />);
    expect(screen.getByText("Image 1")).toBeVisible();
  });

  it.each([
    [NaN, 1],
    [Infinity, 1],
    [-2, 1],
    [1.8, 2],
    [100, 2],
  ])("bounds index %s to image %s", (index, expected) => {
    render(
      <POIMediaGallery
        label="Photos"
        media={media}
        activeIndex={index}
        positionLabel={(n) => `Image ${n}`}
      />,
    );
    expect(screen.getByText(`Image ${expected}`)).toBeVisible();
  });

  it("accepts localized group and failure labels, including empty alt text", () => {
    render(
      <POIMediaGallery
        label="Photos"
        controlsLabel="Actions des photos"
        unavailableLabel="Image indisponible"
        media={[{ ...media[0], alt: "" }, media[1]]}
        positionLabel={(n) => String(n)}
      />,
    );
    expect(
      screen.getByRole("group", { name: "Actions des photos" }),
    ).toBeVisible();
    fireEvent.error(screen.getByAltText(""));
    expect(
      screen.getByRole("img", { name: "Image indisponible" }),
    ).toBeVisible();
  });
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
