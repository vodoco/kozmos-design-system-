import React from "react";
import { cn } from "../../utils";

export interface AIMessageListProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Names the thread for assistive technology. */
  label?: string;
  /**
   * Scroll the newest turn into view when the thread grows. On by default:
   * a reply that arrives below the fold has not been delivered.
   */
  followLatest?: boolean;
}

/**
 * The thread.
 *
 * `role="log"` with `aria-live="polite"` because turns arrive over time and
 * the visitor must hear them without losing their place — Story 5 AC2, and
 * Story 10 where a streamed acknowledgement is itself an arrival. Polite, not
 * assertive: an assistant reply never interrupts.
 */
const AIMessageList = React.forwardRef<HTMLDivElement, AIMessageListProps>(
  (
    { className, children, label = "Assistant conversation", followLatest = true, ...props },
    ref,
  ) => {
    const inner = React.useRef<HTMLDivElement | null>(null);
    const count = React.Children.count(children);

    React.useEffect(() => {
      if (!followLatest) return;
      const node = inner.current;
      if (!node) return;
      // Jump rather than smooth-scroll: prefers-reduced-motion aside, a thread
      // that animates on every token is unreadable.
      node.scrollTop = node.scrollHeight;
    }, [count, followLatest]);

    return (
      <div
        aria-live="polite"
        aria-label={label}
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain px-4 py-4",
          className,
        )}
        ref={(node) => {
          inner.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        role="log"
        {...props}
      >
        {children}
      </div>
    );
  },
);
AIMessageList.displayName = "AIMessageList";

export { AIMessageList };
