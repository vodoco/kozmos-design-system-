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
 * `value` is compared with `Object.is`, so pass a primitive — an object built
 * during render is a new value every time, and would reveal on every render.
 * A change of `duration` or `delay` applies from the next change of `value`;
 * a window that is already open keeps the timing it opened with.
 *
 * @returns whether the caller should be showing its label right now.
 */
export function useRevealOnChange(
  value: unknown,
  { duration = 2500, delay = 0, enabled = true }: UseRevealOnChangeOptions = {},
): boolean {
  const [revealed, setRevealed] = React.useState(false);
  const previous = React.useRef(value);
  // The timing lives in a ref rather than in the reveal effect's dependencies.
  // If it were a dependency, a caller computing it could change it mid-reveal:
  // the effect would re-run, its cleanup would clear the close timer, and its
  // body would return early because `value` had not changed — leaving the
  // label open for ever.
  const timing = React.useRef({ duration, delay });

  // Synced in an effect, not during render, so a render React throws away
  // cannot leave its values behind. Effects run in the order they are declared,
  // so this one has always run before the reveal effect below reads the ref.
  React.useEffect(() => {
    timing.current = { duration, delay };
  });

  React.useEffect(() => {
    if (Object.is(previous.current, value)) return;
    previous.current = value;

    if (!enabled) {
      setRevealed(false);
      return;
    }

    let closeTimer: ReturnType<typeof setTimeout> | undefined;
    const { duration: openFor, delay: waitFor } = timing.current;
    const openTimer = setTimeout(() => {
      setRevealed(true);
      closeTimer = setTimeout(() => setRevealed(false), openFor);
    }, waitFor);

    return () => {
      clearTimeout(openTimer);
      if (closeTimer) clearTimeout(closeTimer);
    };
    // `enabled` stays a dependency: turning it off must stop a pending reveal,
    // and the effect below closes one that is already open.
  }, [value, enabled]);

  // A caller that turns the reveal off mid-flight should close, not freeze.
  React.useEffect(() => {
    if (!enabled) setRevealed(false);
  }, [enabled]);

  return revealed;
}
