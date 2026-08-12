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

export type PropertyValueType = "text" | "boolean" | "hyperlink" | "array" | "enum" | "integer" | "object";

export interface PropertyDef {
  key: string;
  /** The taxonomy's own one-line explanation — the ⓘ beside each row in the picker. */
  description?: string;
  valueType: PropertyValueType;
  /** The taxonomy's own control hint: `textField` · `textArea` · `switch` · `autoComplete` · `custom`. */
  inputType: "textField" | "textArea" | "switch" | "autoComplete" | "custom";
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

/** Read from `get_property_definition`, values included. */
const DEFS: Record<string, PropertyDef> = {
  description: {
    key: "description",
    description: "Full detailed description of the space or service.",
    valueType: "text",
    inputType: "textArea",
    segment: "Metadata",
    grounded: true,
  },
  websiteUrl: {
    key: "websiteUrl",
    description: "Official website URL.",
    valueType: "hyperlink",
    inputType: "textField",
    segment: "Metadata",
    actionName: "Website",
    grounded: true,
  },
  hasAssistance: {
    key: "hasAssistance",
    description: "Staff help available",
    valueType: "boolean",
    inputType: "switch",
    segment: "Accessibility",
    grounded: true,
  },
  priceRange: {
    key: "priceRange",
    description: "Relative pricing level",
    valueType: "integer",
    inputType: "custom",
    segment: "Operations",
    min: 1,
    max: 4,
    grounded: true,
  },
  openingHours: {
    key: "openingHours",
    description: "Operating schedule type",
    valueType: "object",
    inputType: "custom",
    segment: "Operations",
    grounded: true,
  },
  cuisines: {
    key: "cuisines",
    description: "Type of food served",
    valueType: "array",
    inputType: "autoComplete",
    segment: "Food",
    grounded: true,
    options: [
      "Afghan", "African", "American", "Argentinian", "Armenian", "Asian Fusion", "Austrian",
      "Bangladeshi", "Belgian", "Brazilian", "British", "Bulgarian", "Cajun", "Cantonese",
      "Caribbean", "Chinese", "Colombian", "Cuban", "Ethiopian", "Filipino", "French", "Georgian",
      "German", "Greek", "Hawaiian", "Hungarian", "Indian", "Indonesian", "Iranian", "Irish",
      "Israeli", "Italian", "Jamaican", "Japanese", "Korean", "Latin American", "Lebanese",
      "Malaysian", "Mediterranean", "Mexican", "Middle Eastern", "Mongolian", "Moroccan",
      "Nepalese", "Pakistani", "Peruvian", "Pizza", "Polish", "Portuguese", "Romanian", "Russian",
      "Scandinavian", "Scottish", "Seafood", "Singaporean", "Slovak", "South African",
      "Southeast Asian", "Spanish", "Sri Lankan", "Sushi", "Swedish", "Swiss", "Syrian",
      "Taiwanese", "Tex-Mex", "Thai", "Tibetan", "Turkish", "Ukrainian", "Uzbek", "Vietnamese",
      "West African",
    ],
  },
  dietaryOptions: {
    key: "dietaryOptions",
    description: "Special diets accommodated",
    valueType: "array",
    inputType: "autoComplete",
    segment: "Food",
    grounded: true,
    options: [
      "Allergen-Friendly", "Dairy-Free", "Egg-Free", "Gluten-Free", "Halal", "Keto", "Kosher",
      "Locally Sourced", "Low Carb", "Low Sodium", "No MSG", "Nut-Free", "Organic", "Paleo",
      "Peanut-Free", "Pescatarian", "Shellfish-Free", "Soy-Free", "Sugar-Free", "Vegan",
      "Vegetarian",
    ],
  },
  serviceOptions: {
    key: "serviceOptions",
    description: "Which food service options are supported (eg. in-store dining, takeout)",
    valueType: "enum",
    inputType: "autoComplete",
    segment: "Food",
    grounded: true,
    options: ["Dine-in", "Takeout", "Delivery", "Curbside Pickup", "Drive-thru"],
  },
  genderDesignation: {
    key: "genderDesignation",
    description: "Gender access designation",
    valueType: "enum",
    inputType: "autoComplete",
    segment: "Access",
    grounded: true,
    options: ["male", "female", "all-gender", "gender-neutral", "family"],
  },
  serviceTypes: {
    key: "serviceTypes",
    description: "Category of professional or visitor services offered.",
    valueType: "array",
    inputType: "autoComplete",
    segment: "Service",
    grounded: true,
    // The published list runs to 77; these are the ones an airport terminal actually uses. The
    // picker says so rather than implying the taxonomy is this short.
    options: [
      "Accessibility Services", "Baggage Services", "Banking and Credit Union",
      "Cloakroom and Coat Check", "Concierge and Guest Services", "Currency Exchange",
      "Customer Service", "Device Charging", "First Aid", "Food Ordering and Pickup",
      "Guest Assistance", "Immigration and Visa Services", "Information and Help Desk",
      "Locker and Storage Services", "Lost and Found", "Package Pickup and Returns",
      "Parking Assistance", "Passport Services", "Pharmacy Services", "Postal Services",
      "Reception", "Registration", "Reservations and Booking", "Security Services", "Ticketing",
      "Translation and Interpretation", "Travel and Tourism", "Valet Parking", "Visitor Check-in",
      "Wayfinding",
    ],
  },
};

/**
 * What a property is when the taxonomy cache doesn't know it.
 *
 * ⚠️ **Convention, not knowledge**, and deliberately the timid reading: the taxonomy names every
 * boolean `has…`/`is…` and every link `…Url`, which those two rules capture, and **everything else
 * becomes plain text** rather than a guessed enum with invented options. A wrong text field is an
 * inconvenience; a wrong closed list silently forbids the right answer.
 */
function inferDef(key: string): PropertyDef {
  if (/^(has|is|allows|requires)[A-Z]/.test(key))
    return { key, valueType: "boolean", inputType: "switch", segment: "Other" };
  if (/Url$/.test(key)) return { key, valueType: "hyperlink", inputType: "textField", segment: "Metadata" };
  if (/^(phone|email)/i.test(key)) return { key, valueType: "text", inputType: "textField", segment: "Metadata" };
  if (/(Types|Options|Restrictions|Programs|Specialt|Designation)/.test(key))
    return { key, valueType: "array", inputType: "autoComplete", segment: "Other" };
  if (/(capacity|waitTime|Level|Count)$/i.test(key))
    return { key, valueType: "integer", inputType: "textField", segment: "Operations" };
  return { key, valueType: "text", inputType: "textField", segment: "Other" };
}

export function propertyDef(key: string): PropertyDef {
  return DEFS[key] ?? inferDef(key);
}

/** `hasAlcoholService` → `Has Alcohol Service`. The taxonomy is camelCase, the dashboard isn't. */
export function propertyLabel(key: string): string {
  const spaced = key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/[-_]/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
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
};

/**
 * The order the POI card reads its sections in — identity first, then what you'd act on, then the
 * long descriptive lists. Anything with an unknown segment sorts last under "Other".
 */
export const SEGMENT_ORDER = ["Metadata", "Operations", "Food", "Service", "Access", "Accessibility", "Other"];

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
