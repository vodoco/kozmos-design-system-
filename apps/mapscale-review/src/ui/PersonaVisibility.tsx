import {
  Checkbox,
  Text,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@kozmos/react";
import { Help } from "./icons";
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
    <div style={{ marginTop: 18 }}>
      <Text
        style={{
          display: "block",
          fontSize: 10,
          letterSpacing: 1,
          fontWeight: 600,
          color: "#9AA0A6",
          marginBottom: 6,
        }}
      >
        {many
          ? `PERSONA VISIBILITY · applies to all ${features.length}`
          : "PERSONA VISIBILITY"}
      </Text>

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
              minHeight: 30,
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
                  color: state === "off" ? "#171A1C" : "#0B369C",
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

            <Checkbox
              checked={
                state === "indeterminate" ? "indeterminate" : state === "on"
              }
              onCheckedChange={cycle}
              aria-label={persona.displayName}
              wrapperClassName="w-auto"
            />
          </div>
        );
      })}
    </div>
  );
}
