import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useRevealOnChange } from "./useRevealOnChange";

describe("useRevealOnChange", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("stays closed on the first render", () => {
    const { result } = renderHook(() => useRevealOnChange("off"));
    expect(result.current).toBe(false);

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current).toBe(false);
  });

  it("opens when the value changes and closes after the duration", () => {
    const { result, rerender } = renderHook(
      ({ mode }) => useRevealOnChange(mode, { duration: 2500 }),
      { initialProps: { mode: "off" } },
    );

    rerender({ mode: "on" });
    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(result.current).toBe(true);

    act(() => {
      vi.advanceTimersByTime(2499);
    });
    expect(result.current).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe(false);
  });

  it("waits out the delay before opening", () => {
    const { result, rerender } = renderHook(
      ({ mode }) => useRevealOnChange(mode, { delay: 1400, duration: 3000 }),
      { initialProps: { mode: "off" } },
    );

    rerender({ mode: "on" });
    act(() => {
      vi.advanceTimersByTime(1399);
    });
    expect(result.current).toBe(false);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe(true);

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current).toBe(false);
  });

  it("restarts rather than stacking when the value changes again mid-reveal", () => {
    const { result, rerender } = renderHook(
      ({ mode }) => useRevealOnChange(mode, { duration: 2000 }),
      { initialProps: { mode: "off" } },
    );

    rerender({ mode: "on" });
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(result.current).toBe(true);

    rerender({ mode: "off" });
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    // The first reveal's close fired at 2000ms and would have shut this one
    // early if the timers stacked; the second reveal owns the window now.
    expect(result.current).toBe(true);

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe(false);
  });

  it("stays closed while disabled", () => {
    const { result, rerender } = renderHook(
      ({ mode }) => useRevealOnChange(mode, { enabled: false }),
      { initialProps: { mode: "off" } },
    );

    rerender({ mode: "on" });
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current).toBe(false);
  });
});
