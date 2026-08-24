import { act, cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AnalyticsProvider } from "../../utils/analytics";
import { NavigationAnnouncer } from "./NavigationAnnouncer";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("NavigationAnnouncer", () => {
  it("renders an assertive live region with the active announcement", () => {
    render(
      <AnalyticsProvider onDispatch={() => undefined}>
        <NavigationAnnouncer message="Proceed to gate A" />
      </AnalyticsProvider>,
    );

    const liveRegion = screen.getByRole("alert");
    expect(liveRegion).toHaveAttribute("aria-live", "assertive");
    expect(liveRegion).toHaveAttribute("aria-atomic", "true");
    expect(liveRegion).toHaveTextContent("Proceed to gate A");
  });

  it("keeps the live region empty when inactive", () => {
    render(
      <AnalyticsProvider onDispatch={() => undefined}>
        <NavigationAnnouncer message="Turn left" isActive={false} />
      </AnalyticsProvider>,
    );

    expect(screen.getByRole("alert")).toBeEmptyDOMElement();
  });

  it("tracks each distinct active announcement once", () => {
    vi.useFakeTimers();
    const onDispatch = vi.fn();

    const { rerender } = render(
      <AnalyticsProvider onDispatch={onDispatch} batchDelayMs={0}>
        <NavigationAnnouncer message="Turn left" />
      </AnalyticsProvider>,
    );

    act(() => {
      vi.runAllTimers();
    });

    expect(onDispatch).toHaveBeenCalledTimes(1);
    expect(onDispatch.mock.calls[0][0][0]).toMatchObject({
      component: "A11y",
      eventName: "navigation_announced",
      properties: { message: "Turn left" },
    });

    rerender(
      <AnalyticsProvider onDispatch={onDispatch} batchDelayMs={0}>
        <NavigationAnnouncer message="Turn left" />
      </AnalyticsProvider>,
    );

    act(() => {
      vi.runAllTimers();
    });

    expect(onDispatch).toHaveBeenCalledTimes(1);

    rerender(
      <AnalyticsProvider onDispatch={onDispatch} batchDelayMs={0}>
        <NavigationAnnouncer message="Take the lift to level 2" />
      </AnalyticsProvider>,
    );

    act(() => {
      vi.runAllTimers();
    });

    expect(onDispatch).toHaveBeenCalledTimes(2);
  });
});
