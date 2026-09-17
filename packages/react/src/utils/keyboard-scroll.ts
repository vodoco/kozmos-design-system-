import type { KeyboardEvent } from "react";

/** Native keyboard scrolling is inconsistent for focusable lists in WebKit.
 * Handle horizontal scroll keys only when the viewport itself owns focus;
 * descendants retain their own keys and vertical page navigation is untouched.
 */
export function scrollHorizontalWithKeyboard(
  event: KeyboardEvent<HTMLElement>,
) {
  const viewport = event.currentTarget;
  if (
    event.defaultPrevented ||
    event.target !== viewport ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey ||
    viewport.scrollWidth <= viewport.clientWidth
  )
    return;
  const distance = Math.max(40, viewport.clientWidth / 10);
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    viewport.scrollBy({
      left: event.key === "ArrowLeft" ? -distance : distance,
      behavior: "auto",
    });
  } else if (event.key === "Home" || event.key === "End") {
    event.preventDefault();
    const direction =
      viewport.ownerDocument.defaultView?.getComputedStyle(viewport).direction;
    viewport.scrollTo({
      left:
        event.key === "Home"
          ? 0
          : (direction === "rtl" ? -1 : 1) *
            (viewport.scrollWidth - viewport.clientWidth),
      behavior: "auto",
    });
  }
}
