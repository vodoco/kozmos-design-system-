/**
 * The field shells of the *Editing Map Content* panel, drawn to **C** on the Workbench — Figma
 * `nm6qdzaC9B1lknllbwaMTh` → `589:1079`, "C · the design" (Olcay, 2026-09-10: *"implement C on
 * Figma then implement it on Prototype"*).
 *
 * C draws three shells, and every property control sits inside one of them:
 *
 * - **InnerField** — the product's own input (the old "Text-Inputs · small"): 40px tall, the one
 *   1px border, radius 8, and the label INSIDE the box at 10px above a 12px value.
 *   Text, links, the name, the type and every single choice.
 * - **BoxField** — a 1px `background-200` box with a 9.5px label on top: description, opening
 *   hours, rating, images, logo. Chips put the same label *above* the box instead of in it.
 * - **RowField** — a 12px label on the left and the control on the right: switches, the number
 *   stepper, the price band.
 *
 * **One border** (Olcay, 2026-09-10: *"use one border style, the 1px box one"*). C drew two — the
 * product input's 2px `#e3e4e8` and the drawn box's 1px `#c7cad1` — and every field now takes the
 * box's: 1px `background-200`. ⚠️ At about 1.6:1 on white it is under WCAG 1.4.11's 3:1 for an
 * input's boundary (the DS's `Border/Input`, `#747b8b`, passes); the 2px style it replaced was
 * under it too. Focus is shown by a theme ring, not by the border alone — see `index.css`.
 */
import { useState, type CSSProperties, type ReactNode } from "react";
import { Icon, Popover, PopoverContent, PopoverTrigger } from "@kozmos/react";
import { ChevronDown, Help } from "./icons";

/** C's inks, each the CSS twin of the Figma token C is bound to. */
export const FIELD = {
  /** The label inside an input — Figma `foreground/500`. */
  label: "var(--primitives-colors-background-500)",
  /** The value inside an input — `foreground/800`. */
  value: "var(--primitives-colors-background-800)",
  /** Row labels and box contents — `foreground/900`. */
  ink: "var(--primitives-colors-background-900)",
  /** Box labels, notes, counts, carets — `foreground/600`. */
  muted: "var(--primitives-colors-background-600)",
  /** The clear button's disc — `foreground/400`. */
  faint: "var(--primitives-colors-background-400)",
  /** The panel's one field border, 1px — C's box border, `foreground/200` (Olcay, 2026-09-10). */
  border: "var(--primitives-colors-background-200)",
  /** A chip's ground — `foreground/100`. */
  chip: "var(--primitives-colors-background-100)",
  surface: "var(--primitives-colors-background-0)",
  link: "var(--primitives-colors-theme-700)",
  /** A switch that is on — C's toggle track. */
  on: "var(--primitives-colors-theme-500)",
  /** The chosen step of the price band. */
  chosen: "var(--primitives-colors-theme-800)",
} as const;

export const MULTI = "Multiple values";

/** The taxonomy's own one-line explanation, as the 13px ⓘ C puts after every label. */
export function Info({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <span
      aria-hidden
      title={text}
      style={{
        flex: "0 0 auto",
        display: "grid",
        placeItems: "center",
        color: FIELD.muted,
        cursor: "help",
      }}
    >
      <Help size={13} />
    </span>
  );
}

/* ── InnerField ─────────────────────────────────────────────────────────────────────────────── */

export const innerShell = (height = 40): CSSProperties => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
  width: "100%",
  height,
  padding: "4px 8px",
  boxSizing: "border-box",
  borderRadius: 8,
  border: `1px solid ${FIELD.border}`,
  background: FIELD.surface,
});

const valueText: CSSProperties = {
  display: "block",
  width: "100%",
  minWidth: 0,
  padding: 0,
  border: "none",
  outline: "none",
  background: "none",
  fontFamily: "inherit",
  fontSize: 12,
  lineHeight: "16px",
  color: FIELD.value,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

export function InnerLabel({
  label,
  info,
}: {
  label: ReactNode;
  info?: string;
}) {
  return (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontSize: 10,
        lineHeight: "16px",
        color: FIELD.label,
        whiteSpace: "nowrap",
      }}
    >
      {label}
      <Info text={info} />
    </span>
  );
}

/** C's `clear`: a 16px disc in `foreground/400` with the DS x-close on it, in a 24px target. */
export function ClearButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title="Clear"
      onClick={onClick}
      style={{
        flex: "0 0 auto",
        display: "grid",
        placeItems: "center",
        width: 24,
        height: 24,
        padding: 0,
        border: "none",
        background: "none",
        cursor: "pointer",
      }}
    >
      <ClearDisc />
    </button>
  );
}

/** C's clear mark on its own, for places already inside a button (the type picker's trigger). */
export function ClearDisc() {
  return (
    <span
      aria-hidden
      style={{
        display: "grid",
        placeItems: "center",
        width: 16,
        height: 16,
        borderRadius: 999,
        background: FIELD.faint,
        color: FIELD.surface,
      }}
    >
      <Icon name="x-close" style={{ width: 10, height: 10 }} strokeWidth={3} />
    </span>
  );
}

/**
 * The DS Checkbox's own look — 20px, the marker radius, the input border; filled with the primary
 * and carrying a white tick or dash once set — without the DS wrapper's 44px row.
 *
 * ⚠️ **A DS finding, not a preference.** `Checkbox` wraps its box in `flex min-h-11`, so every row
 * that holds one is at least 44px tall, and there is no prop to opt out. C draws the persona rows
 * at 30 — as does the code's own `minHeight: 30`, which that wrapper had been silently overriding.
 */
export function TriCheck({
  checked,
  onChange,
  label,
}: {
  checked: boolean | "mixed";
  onChange: () => void;
  label: string;
}) {
  const set = checked !== false;
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className="tri-check"
      style={{
        flex: "0 0 auto",
        display: "grid",
        placeItems: "center",
        width: 20,
        height: 20,
        padding: 0,
        boxSizing: "border-box",
        borderRadius: "calc(var(--semantics-radius-marker) * 1px)",
        border: `1px solid ${set ? "var(--primitives-colors-theme-600)" : "var(--semantics-border-input)"}`,
        background: set ? "var(--primitives-colors-theme-600)" : "transparent",
        color: FIELD.surface,
        cursor: "pointer",
      }}
    >
      {checked === "mixed" ? (
        <Icon name="minus" size="sm" />
      ) : checked ? (
        <Icon name="check" size="sm" />
      ) : null}
    </button>
  );
}

/** The caret C's single-choice inputs end on. */
export function Caret() {
  return (
    <span
      aria-hidden
      style={{
        flex: "0 0 auto",
        display: "grid",
        placeItems: "center",
        width: 24,
        height: 24,
        color: FIELD.muted,
      }}
    >
      <ChevronDown size={16} />
    </span>
  );
}

/** A one-line value in C's input: label inside, value below it, a ⊗ to clear what is typed. */
export function TextField({
  label,
  info,
  value,
  onChange,
  placeholder,
  ariaLabel,
  clearable = true,
}: {
  label: string;
  info?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  clearable?: boolean;
}) {
  return (
    <div className="inner-field" style={innerShell()}>
      <span
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <InnerLabel label={label} info={info} />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={ariaLabel ?? label}
          style={valueText}
        />
      </span>
      {clearable && value !== "" && (
        <ClearButton label={`Clear ${label}`} onClick={() => onChange("")} />
      )}
    </div>
  );
}

/** One value from a closed list, in C's input with its caret — how the taxonomy's `enum` edits. */
export function ChoiceField({
  label,
  info,
  value,
  options,
  display,
  onChange,
  many,
}: {
  label: string;
  info?: string;
  value: string;
  options: string[];
  display: (option: string) => string;
  onChange: (v: string) => void;
  many?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={label}
          className="inner-field"
          style={{
            ...innerShell(),
            cursor: "pointer",
            textAlign: "left",
            fontFamily: "inherit",
          }}
        >
          <span
            style={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <InnerLabel label={label} info={info} />
            <span
              style={{
                ...valueText,
                color: value && !many ? FIELD.value : FIELD.label,
              }}
            >
              {many ? MULTI : value ? display(value) : "Choose one"}
            </span>
          </span>
          <Caret />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        style={{
          width: "var(--radix-popover-trigger-width)",
          padding: 4,
          maxHeight: 260,
          overflow: "auto",
        }}
      >
        <div role="listbox" aria-label={label}>
          {options.map((o) => (
            <button
              key={o}
              type="button"
              role="option"
              aria-selected={o === value}
              onClick={() => {
                onChange(o);
                setOpen(false);
              }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "7px 10px",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 12.5,
                color: FIELD.ink,
                background:
                  o === value ? "var(--primitives-colors-theme-0)" : "none",
              }}
            >
              {display(o)}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/* ── BoxField ───────────────────────────────────────────────────────────────────────────────── */

/** The 9.5px label C puts on top of its drawn boxes (and above the chip box). */
export function FieldLabel({
  label,
  info,
  aside,
}: {
  label: ReactNode;
  info?: string;
  aside?: ReactNode;
}) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          flex: 1,
          minWidth: 0,
          fontSize: 9.5,
          lineHeight: "13px",
          color: FIELD.muted,
        }}
      >
        {label}
        <Info text={info} />
      </span>
      {aside != null && (
        <span style={{ flex: "0 0 auto", fontSize: 9, color: FIELD.muted }}>
          {aside}
        </span>
      )}
    </span>
  );
}

export function BoxField({
  label,
  info,
  aside,
  focusRing,
  children,
}: {
  label: ReactNode;
  info?: string;
  aside?: ReactNode;
  /** The box IS the field (the textarea, which draws no edge of its own): it takes the inputs' focus state. */
  focusRing?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={focusRing ? "inner-field" : undefined}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        padding: "10px 12px",
        borderRadius: 8,
        border: `1px solid ${FIELD.border}`,
        background: FIELD.surface,
      }}
    >
      <FieldLabel label={label} info={info} aside={aside} />
      {children}
    </div>
  );
}

/* ── RowField ───────────────────────────────────────────────────────────────────────────────── */

export function RowField({
  label,
  info,
  htmlFor,
  children,
}: {
  label: ReactNode;
  info?: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        minHeight: 24,
      }}
    >
      <label
        htmlFor={htmlFor}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          flex: 1,
          minWidth: 0,
          fontSize: 12,
          color: FIELD.ink,
          cursor: htmlFor ? "pointer" : undefined,
        }}
      >
        {label}
        <Info text={info} />
      </label>
      {children}
    </div>
  );
}

/** C's switch: a 48×24 pill, the 24px knob outlined in the track's colour. */
export function Toggle({
  id,
  checked,
  onChange,
  label,
}: {
  id?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  const ink = checked ? FIELD.on : FIELD.border;
  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      style={{
        position: "relative",
        flex: "0 0 auto",
        width: 48,
        height: 24,
        padding: 0,
        border: "none",
        borderRadius: 30,
        cursor: "pointer",
        background: ink,
        transition: "background-color .15s ease",
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: checked ? 24 : 0,
          width: 24,
          height: 24,
          boxSizing: "border-box",
          borderRadius: 30,
          background: FIELD.surface,
          border: `1.5px solid ${ink}`,
          transition: "left .15s ease, border-color .15s ease",
        }}
      />
    </button>
  );
}

function StepButton({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: "minus" | "plus";
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      style={{
        flex: "0 0 auto",
        display: "grid",
        placeItems: "center",
        width: 24,
        height: 24,
        padding: 0,
        border: "none",
        background: "none",
        color: FIELD.muted,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.4 : 1,
      }}
    >
      <Icon name={icon} size="sm" />
    </button>
  );
}

/** C's stepper for a whole number: − value +, 182px, in the product input's border. */
export function Stepper({
  label,
  value,
  onChange,
  placeholder,
  min = 0,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  min?: number;
}) {
  const n = value === "" ? null : Number(value);
  const set = (v: number) => onChange(String(Math.max(min, v)));
  return (
    <div
      className="inner-field"
      style={{ ...innerShell(40), width: 182, flex: "0 0 auto", padding: 8 }}
    >
      <StepButton
        icon="minus"
        label={`Decrease ${label}`}
        onClick={() => set((n ?? min) - 1)}
        disabled={n == null || n <= min}
      />
      <input
        value={value}
        inputMode="numeric"
        aria-label={label}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ""))}
        style={{ ...valueText, flex: 1, textAlign: "center" }}
      />
      <StepButton
        icon="plus"
        label={`Increase ${label}`}
        onClick={() => set((n ?? min - 1) + 1)}
      />
    </div>
  );
}

/** C's price band: four steps in one 1px box, the chosen one filled. */
export function PriceBand({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (v: number | "") => void;
}) {
  const on = Number(value);
  return (
    <div
      role="group"
      aria-label="Price range"
      style={{
        display: "inline-flex",
        flex: "0 0 auto",
        borderRadius: 8,
        border: `1px solid ${FIELD.border}`,
        overflow: "hidden",
        background: FIELD.surface,
      }}
    >
      {[1, 2, 3, 4].map((n) => (
        <button
          key={n}
          type="button"
          aria-pressed={on === n}
          aria-label={`Price level ${n} of 4`}
          onClick={() => onChange(on === n ? "" : n)}
          style={{
            padding: "6px 12px",
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 11,
            fontWeight: 500,
            lineHeight: "14px",
            color: on === n ? FIELD.surface : FIELD.muted,
            background: on === n ? FIELD.chosen : FIELD.surface,
          }}
        >
          {"$".repeat(n)}
        </button>
      ))}
    </div>
  );
}

/* ── chips ──────────────────────────────────────────────────────────────────────────────────── */

export function Chip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 4px 3px 9px",
        borderRadius: 999,
        background: FIELD.chip,
        fontSize: 11.5,
        lineHeight: "16px",
        color: FIELD.ink,
      }}
    >
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        style={{
          display: "grid",
          placeItems: "center",
          width: 16,
          height: 16,
          padding: 2,
          border: "none",
          background: "none",
          cursor: "pointer",
          color: FIELD.muted,
        }}
      >
        <Icon name="x-close" size="xs" />
      </button>
    </span>
  );
}

/** "+ Add" as C writes it at the end of a chip box — the DS plus, then the word. */
export const addLink: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 3,
  padding: "2px 4px",
  border: "none",
  background: "none",
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: 12,
  fontWeight: 500,
  color: FIELD.link,
};

/** Chips keep the label OUTSIDE, above a 1px box that holds them and the way to add another. */
export function ChipsField({
  label,
  info,
  children,
}: {
  label: ReactNode;
  info?: string;
  children: ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <FieldLabel label={label} info={info} />
      {/* The chips box is the field: focus inside it — the add input, a chip's ✕ — lights it. */}
      <div
        className="inner-field"
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 6,
          minHeight: 36,
          padding: "7px 8px",
          boxSizing: "border-box",
          borderRadius: 8,
          border: `1px solid ${FIELD.border}`,
          background: FIELD.surface,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ── opening hours ──────────────────────────────────────────────────────────────────────────── */

/**
 * ⚠️ **The taxonomy does not say what an opening-hours value looks like** — `openingHours` is typed
 * `object` with `inputType: custom` and no schema (checked against 10.12.0). This is the shape the
 * prototype writes, one entry per weekday: `{ open, close }` in 24-hour `HH:MM`, or `null` for a
 * day that is closed. A day with no entry reads as closed and is written only once it is set.
 */
export const WEEK = [
  ["mon", "Mon"],
  ["tue", "Tue"],
  ["wed", "Wed"],
  ["thu", "Thu"],
  ["fri", "Fri"],
  ["sat", "Sat"],
  ["sun", "Sun"],
] as const;
export type Weekday = (typeof WEEK)[number][0];
export type DayHours = { open: string; close: string } | null;
export type OpeningHours = Partial<Record<Weekday, DayHours>>;

const HHMM = /^\d{2}:\d{2}$/;
const TIMES = Array.from(
  { length: 48 },
  (_, i) =>
    `${String(Math.floor(i / 2)).padStart(2, "0")}:${i % 2 ? "30" : "00"}`,
);
const CLOSED = "closed";

/** Reads whatever is stored into the one shape above, keeping only what it can vouch for. */
export function readHours(v: unknown): OpeningHours {
  const out: OpeningHours = {};
  if (!v || typeof v !== "object") return out;
  const o = v as Record<string, unknown>;
  for (const [k] of WEEK) {
    const d = o[k];
    if (d === null) out[k] = null;
    else if (d && typeof d === "object") {
      const { open, close } = d as Record<string, unknown>;
      if (
        typeof open === "string" &&
        typeof close === "string" &&
        HHMM.test(open) &&
        HHMM.test(close)
      )
        out[k] = { open, close };
    }
  }
  return out;
}

function TimeSelect({
  label,
  value,
  onChange,
  allowClosed,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  allowClosed?: boolean;
}) {
  const options = TIMES.includes(value) ? TIMES : [value, ...TIMES];
  return (
    <span style={{ position: "relative", flex: 1, minWidth: 0 }}>
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="inner-field"
        style={{
          ...innerShell(32),
          display: "block",
          appearance: "none",
          WebkitAppearance: "none",
          paddingRight: 30,
          fontFamily: "inherit",
          fontSize: 12,
          color: FIELD.value,
          cursor: "pointer",
        }}
      >
        {allowClosed && <option value={CLOSED}>Closed</option>}
        {options.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <span
        style={{
          position: "absolute",
          right: 6,
          top: 4,
          pointerEvents: "none",
        }}
      >
        <Caret />
      </span>
    </span>
  );
}

/**
 * C's schedule: a day per row, opens and closes as two time pickers. "Closed" is the first choice
 * of the opening time, and a closed day's word is itself the way back to hours — it opens at the
 * common 09:00–17:00, which is then one change away from right.
 */
export function OpeningHoursField({
  label,
  info,
  value,
  onChange,
  many,
}: {
  label: string;
  info?: string;
  value: unknown;
  onChange: (v: OpeningHours) => void;
  many?: boolean;
}) {
  if (many)
    return (
      <BoxField label={label} info={info}>
        <span style={{ fontSize: 11, fontStyle: "italic", color: FIELD.muted }}>
          {MULTI} — open one feature to edit its hours.
        </span>
      </BoxField>
    );
  const hours = readHours(value);
  const set = (day: Weekday, h: DayHours) => onChange({ ...hours, [day]: h });
  return (
    <BoxField label={label} info={info}>
      {WEEK.map(([day, name]) => {
        const h = hours[day];
        return (
          <div
            key={day}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              minHeight: 32,
            }}
          >
            <span
              style={{
                width: 34,
                flex: "0 0 auto",
                fontSize: 11,
                color: FIELD.ink,
              }}
            >
              {name}
            </span>
            {h ? (
              <>
                <TimeSelect
                  label={`${name} opens`}
                  value={h.open}
                  allowClosed
                  onChange={(v) =>
                    set(day, v === CLOSED ? null : { ...h, open: v })
                  }
                />
                <TimeSelect
                  label={`${name} closes`}
                  value={h.close}
                  onChange={(v) => set(day, { ...h, close: v })}
                />
              </>
            ) : (
              <button
                type="button"
                title={`Set ${name} opening hours`}
                onClick={() => set(day, { open: "09:00", close: "17:00" })}
                style={{
                  padding: 0,
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: 11,
                  color: FIELD.muted,
                }}
              >
                Closed
              </button>
            )}
          </div>
        );
      })}
    </BoxField>
  );
}
