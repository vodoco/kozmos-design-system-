import * as React from "react";

export interface UseRevealOnChangeOptions {
  /** How long the reveal stays open once it opens, in milliseconds. */
  duration?: number;
  /**
   * How long to wait after the value changes before revealing, in
   * milliseconds. A control whose change takes time to settle — a route being
   * recalculated, say — reveals its new state when the work is done rather
   * than while it is still wrong.
   */
  delay?: number;
  /** Set false to leave the reveal closed without unmounting the caller. */
  enabled?: boolean;
}

/**
 * Reveals something for a while after a value changes, then closes it again.
 *
 * A map mode toggle is icon-only at rest. When its mode changes it widens to
 * say which mode it is now, waits long enough to be read, and collapses back
 * so it stops covering the map. That is timing, not appearance, so it lives
 * here instead of inside `MapControlButton` — `Focus` and a step-free toggle
 * both need it, and two hand-rolled timers are how two controls end up
 * disagreeing about how long "a while" is.
 *
 * The first render never reveals: a control that shouts its state on mount is
 * announcing something the user did not just do.
 *
 * @returns whether the caller should be showing its label right now.
 */
export function useRevealOnChange(
  value: unknown,
  { duration = 2500, delay = 0, enabled = true }: UseRevealOnChangeOptions = {},
): boolean {
  const [revealed, setRevealed] = React.useState(false);
  const previous = React.useRef(value);

  React.useEffect(() => {
    if (Object.is(previous.current, value)) return;
    previous.current = value;

    if (!enabled) {
      setRevealed(false);
      return;
    }

    let closeTimer: ReturnType<typeof setTimeout> | undefined;
    const openTimer = setTimeout(() => {
      setRevealed(true);
      closeTimer = setTimeout(() => setRevealed(false), duration);
    }, delay);

    return () => {
      clearTimeout(openTimer);
      if (closeTimer) clearTimeout(closeTimer);
    };
  }, [value, duration, delay, enabled]);

  // A caller that turns the reveal off mid-flight should close, not freeze.
  React.useEffect(() => {
    if (!enabled) setRevealed(false);
  }, [enabled]);

  return revealed;
}
