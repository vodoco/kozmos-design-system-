/**
 * The taxonomy's **property vocabulary** — what each property *is*, so both halves of the POI panel
 * can be driven by data rather than by a hand-written list.
 *
 * Two consumers, one source:
 *
 * - **Reading**, which is the SDK's own POI card: it derives its sections from `properties`
 *   (`Cuisines`, `Dietary Options`, `Service Options` … 23 sections from 60 properties in the
 *   published contract). `segment` is what groups them; `valueType` is what decides whether a value
 *   draws as chips, a switch state, a link or a line of text.
 * - **Editing**, which is the dashboard's *Editing Map Content* panel: `inputType` decides the
 *   control, `options` fills the picker, and the **type label** (Text · Boolean · Hyperlink · Array)
 *   is shown beside each property in *Add additional field*.
 *
 * ⚠️ **Grounded where it matters, conventional where it doesn't — and the difference is marked.**
 * The entries in `DEFS` were read from the taxonomy service's own `get_property_definition`, values
 * and all. Anything not in that table falls through `inferDef()`, which reads the **naming
 * convention the taxonomy itself follows** (`has*`/`is*` are booleans, `*Url` is a hyperlink) rather
 * than pretending to know. That guess is visible: an inferred property says `Text` and offers a
 * plain field, which is the safe wrong answer rather than the confident one.
 *
 * ⚠️ Same standing limit as the rest of `mock/`: **this is a cache of a service the app cannot reach
 * at runtime.** The real dashboard reads it live, which is why its picker can list every property in
 * the taxonomy and this one lists what the demo needs.
 */

/**
 * ⚠️ **Every value the published taxonomy actually uses.** `email`, `image` and `number` were
 * missing while this list was written by hand — a property carrying one of them fell through to
 * `text` and drew a plain field.
 */
import { PROPERTIES, SEGMENTS } from "./taxonomyData";

export type PropertyValueType =
  | "text"
  | "boolean"
  | "hyperlink"
  | "array"
  | "enum"
  | "integer"
  | "object"
  | "email"
  | "image"
  | "number";

export interface PropertyDef {
  key: string;
  /** The taxonomy's own one-line explanation — the ⓘ beside each row in the picker. */
  description?: string;
  valueType: PropertyValueType;
  /** The taxonomy's own control hint: `textField` · `textArea` · `switch` · `autoComplete` · `custom`. */
  inputType:
    | "textField"
    | "textArea"
    | "switch"
    | "autoComplete"
    | "custom"
    | "numberField"
    | "comboBox";
  /** The taxonomy's own label — `hasAlcoholService` → `Alcohol Service`. */
  displayName?: string;
  /** `tsa-precheck` → `TSA PreCheck`. A closed list is only usable if its values have names. */
  valueLabels?: Record<string, string>;
  /** The taxonomy's own ordering, which is why this app no longer invents one. */
  order?: number;
  /** Written by the platform, not by a content editor — the panel must not offer these. */
  isSystem?: boolean;
  /** How the POI card groups it — `Food`, `Access`, `Metadata`, `Operations`, `Service`… */
  segment: string;
  /** The closed list, where the taxonomy publishes one. */
  options?: string[];
  min?: number;
  max?: number;
  /** Set where the property is an action on the card (`websiteUrl` → a *Website* button). */
  actionName?: string;
  /** True when this entry came from the taxonomy service rather than from `inferDef()`. */
  grounded?: true;
}

/**
 * **All 60 published properties**, from `taxonomyData.ts`.
 *
 * ⚠️ **This was ten entries typed out by hand** until 2026-09-08, with the other fifty falling
 * through `inferDef()` — so `cuisines` knew its 73 values and `parkingTypes` did not know it had
 * any. The generated table carries every one, with the control the taxonomy asks for, the closed
 * list where it publishes one, and the display name for each value.
 */
const DEFS: Record<string, PropertyDef> = Object.fromEntries(
  PROPERTIES.map((p) => [
    p.key,
    {
      key: p.key,
      displayName: p.displayName,
      description: p.description || undefined,
      valueType: p.valueType as PropertyValueType,
      inputType: p.inputType as PropertyDef["inputType"],
      segment: p.segment,
      options: p.values ?? undefined,
      valueLabels: p.valueLabels ?? undefined,
      actionName: p.actionName ?? undefined,
      order: p.order,
      isSystem: p.isSystem || undefined,
      grounded: true as const,
    },
  ]),
);

/** Every property a content editor may add — the taxonomy's own order, system fields excluded. */
export const EDITABLE_PROPERTIES: PropertyDef[] = PROPERTIES.filter(
  (p) => !p.isSystem,
).map((p) => DEFS[p.key]);

/**
 * **Where a key the taxonomy does not publish is filed.**
 *
 * ⚠️ **It was `"Other"`, and the panel printed that as a heading reading OTHER** — vague, and
 * indistinguishable from a real segment. Checked before renaming: **no published property uses the
 * segment `Other`**, so this bucket can only ever hold keys the taxonomy has never heard of —
 * `sl`, `Color`, `Icon Image` on the demo floor. Saying so is the whole of the improvement, and it
 * answers one of the open questions on the Workbench: custom fields live together, under their own
 * heading, at the point their rank puts them.
 */
export const CUSTOM_SEGMENT = "Custom";

/**
 * **For a key the taxonomy does not publish** — and a feature really does carry them: the demo
 * floor has `sl`, `Color` and `Icon Image` on its sections, none of which is in the 60.
 *
 * It reads the naming convention the taxonomy itself follows (`has*`/`is*` are booleans, `*Url` is
 * a hyperlink) rather than pretending to know. The guess stays visible — an inferred property has
 * no `grounded` flag, so the panel can say so.
 */
function inferDef(key: string): PropertyDef {
  if (/^(has|is|allows|requires)[A-Z]/.test(key))
    return {
      key,
      valueType: "boolean",
      inputType: "switch",
      segment: CUSTOM_SEGMENT,
    };
  if (/Url$/.test(key))
    return {
      key,
      valueType: "hyperlink",
      inputType: "textField",
      segment: "Content",
    };
  if (/^(phone|email)/i.test(key))
    return {
      key,
      valueType: "text",
      inputType: "textField",
      segment: "Contact",
    };
  if (/(Types|Options|Restrictions|Programs|Specialt|Designation)/.test(key))
    return {
      key,
      valueType: "array",
      inputType: "autoComplete",
      segment: CUSTOM_SEGMENT,
    };
  if (/(capacity|waitTime|Level|Count)$/i.test(key))
    return {
      key,
      valueType: "integer",
      inputType: "numberField",
      segment: "Capacity",
    };
  return {
    key,
    valueType: "text",
    inputType: "textField",
    segment: CUSTOM_SEGMENT,
  };
}

export function propertyDef(key: string): PropertyDef {
  return DEFS[key] ?? inferDef(key);
}

/** `hasAlcoholService` → `Has Alcohol Service`. The taxonomy is camelCase, the dashboard isn't. */
export function propertyLabel(key: string): string {
  // The taxonomy's own display name where it has one; the camelCase rule only as a fallback.
  const def = DEFS[key];
  if (def?.displayName) return def.displayName;
  const spaced = key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/** `tsa-precheck` → `TSA PreCheck`, where the taxonomy names its values. */
export function valueLabel(key: string, value: string): string {
  return DEFS[key]?.valueLabels?.[value] ?? value;
}

/** The word the *Add additional field* picker prints on the right of each row. */
export const TYPE_LABEL: Record<PropertyValueType, string> = {
  text: "Text",
  boolean: "Boolean",
  hyperlink: "Hyperlink",
  array: "Array",
  enum: "Enum",
  integer: "Number",
  object: "Object",
  email: "Email",
  image: "Image",
  number: "Number",
};

/**
 * **The taxonomy's own segments, in the taxonomy's own order.**
 *
 * ⚠️ **This used to read `["Metadata", "Operations", "Food", "Service", "Access", "Accessibility",
 * "Other"]` — and six of those seven are not segments the taxonomy has.** They were invented here.
 * The real list is 31, ordered by the lowest `display.order` of the properties in each, which is
 * how the POI card orders them too.
 */
export const SEGMENT_ORDER: string[] = SEGMENTS;

export function segmentRank(segment: string): number {
  const i = SEGMENT_ORDER.indexOf(segment);
  return i === -1 ? SEGMENT_ORDER.length : i;
}

/** Parse whatever the tiles/edits hold into the array a chip group draws. */
export function toArray(v: unknown): string[] {
  if (v == null || v === "") return [];
  if (Array.isArray(v)) return v.map(String);
  if (typeof v === "string") {
    const s = v.trim();
    if (s.startsWith("[") && s.endsWith("]")) {
      try {
        const parsed: unknown = JSON.parse(s);
        if (Array.isArray(parsed)) return parsed.map(String);
      } catch {
        /* not JSON — treat it as one value */
      }
    }
    return [s];
  }
  return [String(v)];
}

export function isTruthy(v: unknown): boolean {
  return v === true || v === "true" || v === 1 || v === "1";
}
