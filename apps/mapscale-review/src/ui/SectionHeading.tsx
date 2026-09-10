import { Text } from "@kozmos/react";

/**
 * **The panel's one section heading.**
 *
 * ⚠️ **It lives here rather than in `FeaturePanel` because two modules use it, and putting it in
 * either one makes them import each other.** It was exported from `FeaturePanel` at first and
 * `PersonaVisibility` imported it back — a genuine cycle. Rollup resolved it (both sides only touch
 * the other at render time, and function declarations hoist), so nothing broke; a cycle that works
 * by accident is still a cycle, and the first module-level use on either side would end it.
 *
 * Shared UI belongs to neither of its callers.
 *
 * The shape — 10px, letter-spaced, semibold, muted, upper case — is what PERSONA VISIBILITY has
 * always drawn, and now what an earned property section draws too, so the panel has one kind of
 * heading rather than two that merely look alike.
 *
 * ⚠️ **No margins, and a line height of its own** (C, Olcay 2026-09-10). The panel is one column
 * with a 12px gap, so spacing belongs to the column, not to the heading; and without an explicit
 * line height the DS `Text`'s `text-base` 1.5rem would make a 10px heading 22px tall.
 */
export function SectionHeading({ children }: { children: string }) {
  return (
    <Text
      style={{
        display: "block",
        fontSize: 10,
        letterSpacing: 1,
        fontWeight: 600,
        color: "var(--primitives-colors-background-400)",
        lineHeight: "13px",
        margin: 0,
      }}
    >
      {children}
    </Text>
  );
}
