import {
  Text,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@kozmos/react";
import { TriCheck } from "./fields";
import { Help } from "./icons";
import { SectionHeading } from "./SectionHeading";
import {
  MAP_PERSONAS,
  personaStateAcross,
  type PersonaState,
} from "../mock/personas";

/**
 * **Persona visibility — the one piece of metadata that crosses a selection** (US4).
 *
 * ⚠️ **The check mark is on the RIGHT** (Olcay, 2026-08-16: *"the toggles should be on the right
 * side not left"*), the same shape as `MapSettings`' `PrefRow`, so the two agree.
 *
 * ⚠️ **The diamond is the taxonomy's own colour**, read from `mapPersonas[].color` in the published
 * taxonomy rather than picked here — see `../mock/personas`. It says WHICH persona the row is and
 * nothing about its state; the check mark carries the state alone, because a row told apart only by
 * #6D1B2A against #8D6E63 is unreadable at 11px to most people.
 *
 * ⚠️ **Three states, and the third exists only while the selection disagrees.** Clicking cycles
 * on → off → indeterminate in turn, and indeterminate is only reachable when the features actually
 * differed — with one feature selected there is nothing to disagree about, so the box is a plain
 * on/off. Left indeterminate, each feature keeps the value it already had (US4).
 */
export function PersonaVisibility({
  features,
  edits,
  onEdit,
}: {
  /** Every selected feature's own `mapPersonas`, primary first. */
  features: { mapPersonas?: unknown }[];
  /** Personas the user has explicitly decided. Absent = untouched, so "leave as they are". */
  edits: Record<string, boolean>;
  onEdit: (next: Record<string, boolean>) => void;
}) {
  const many = features.length > 1;

  return (
    // C: the block sits 12px further down than the column's gap, and its rows 2px apart.
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        paddingTop: 12,
      }}
    >
      {/* ⚠️ Was a hand-rolled <Text> with a raw #9AA0A6. The property sections now draw the same
          heading, so it comes from one component and the two cannot drift apart. */}
      <SectionHeading>
        {many
          ? `PERSONA VISIBILITY · applies to all ${features.length}`
          : "PERSONA VISIBILITY"}
      </SectionHeading>

      {MAP_PERSONAS.map((persona) => {
        const original = personaStateAcross(persona.key, features);
        const edited = edits[persona.key];
        const state: PersonaState =
          edited === undefined ? original : edited ? "on" : "off";

        /**
         * on → off → (indeterminate, only if they originally differed) → on.
         * Clearing the edit is what "indeterminate" means: no instruction for this persona.
         */
        const cycle = () => {
          const next = { ...edits };
          if (state === "on") next[persona.key] = false;
          else if (state === "off") {
            if (original === "indeterminate") delete next[persona.key];
            else next[persona.key] = true;
          } else next[persona.key] = true;
          onEdit(next);
        };

        return (
          <div
            key={persona.key}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              height: 30,
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                aria-hidden
                style={{
                  width: 11,
                  height: 11,
                  background: persona.color,
                  transform: "rotate(45deg)",
                  borderRadius: 1,
                  flex: "0 0 auto",
                }}
              />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  /**
                   * ⚠️ **Was `#171A1C` and `#0B369C` typed by hand** — both are token values,
                   * `background-900` and `theme-800`, written out where the variable would do. A
                   * literal that happens to match a token today is a literal that stops matching it
                   * the day the ramp moves, and it cannot follow the theme at all.
                   */
                  color:
                    state === "off"
                      ? "var(--primitives-colors-background-900)"
                      : "var(--primitives-colors-theme-800)",
                }}
              >
                {persona.displayName}
              </Text>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      tabIndex={0}
                      aria-label={`What is ${persona.displayName}?`}
                      style={{
                        display: "grid",
                        placeItems: "center",
                        color: "var(--primitives-colors-background-500)",
                        cursor: "help",
                      }}
                    >
                      {/* ⚠️ Was the literal character ⓘ, which renders in whatever the system font
                          decides and sat a pixel off the baseline. The library's own `help-circle`
                          is the mark the type picker and every property row now use. */}
                      <Help size={14} />
                    </span>
                  </TooltipTrigger>
                  {/* The taxonomy's own definition — not a sentence written here. */}
                  <TooltipContent style={{ maxWidth: 260 }}>
                    {persona.description}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>

            {/* The DS Checkbox's look without its 44px row — see TriCheck. */}
            <TriCheck
              checked={state === "indeterminate" ? "mixed" : state === "on"}
              onChange={cycle}
              label={persona.displayName}
            />
          </div>
        );
      })}
    </div>
  );
}
