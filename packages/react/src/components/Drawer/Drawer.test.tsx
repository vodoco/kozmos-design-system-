import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { AnalyticsProvider } from "../../utils/analytics";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "./Drawer";

describe("Drawer", () => {
  it("opens on trigger click", async () => {
    const user = userEvent.setup();
    render(
      <AnalyticsProvider onDispatch={() => {}}>
        <Drawer>
          <DrawerTrigger>Open drawer</DrawerTrigger>
          <DrawerContent>
            <DrawerTitle>Drawer content</DrawerTitle>
            <DrawerDescription>Drawer description</DrawerDescription>
          </DrawerContent>
        </Drawer>
      </AnalyticsProvider>,
    );

    await user.click(screen.getByText("Open drawer"));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Drawer content")).toBeInTheDocument();
  });

  it("applies side metadata for placement-aware styling", async () => {
    const user = userEvent.setup();
    render(
      <AnalyticsProvider onDispatch={() => {}}>
        <Drawer>
          <DrawerTrigger>Open details</DrawerTrigger>
          <DrawerContent side="left">
            <DrawerTitle>Navigation</DrawerTitle>
            <DrawerDescription>Choose a section</DrawerDescription>
          </DrawerContent>
        </Drawer>
      </AnalyticsProvider>,
    );

    await user.click(screen.getByText("Open details"));

    expect(screen.getByRole("dialog")).toHaveAttribute("data-side", "left");
  });
});
