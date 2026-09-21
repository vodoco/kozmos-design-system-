/**
 * The examples, as data. `routes.ts` reads this in Node to register one route
 * per example, so it must stay free of React and CSS imports. Each entry needs
 * `src/examples/<slug>/route.tsx`; the build fails without it.
 */

export type ExampleKind = "page" | "app";

export interface ExampleEntry {
  slug: string;
  title: string;
  kind: ExampleKind;
  /** One sentence for the index card and the page's meta description. */
  summary: string;
  /**
   * Where the example differs from what a product would draw, because Kozmos
   * cannot express it yet. Each names its entry in GAPS.md.
   */
  gaps: readonly string[];
}

export const examples: readonly ExampleEntry[] = [
  {
    slug: "venue-explorer",
    title: "Venue explorer",
    kind: "app",
    summary:
      "Search a shopping centre, browse it by category, pick a place from the results or the map, and read its details, across three floors. The map is a stand-in: Kozmos lays out around a map engine and does not draw one.",
    gaps: [
      "GAP-15 · Food and drink, toilets, accessible facilities, parking and first aid are left out: Kozmos has no icon for them.",
      "GAP-17 · The map shell's panel is an aside, a landmark that should not sit inside the page's main.",
      "GAP-18 · The place details use the sheet presentation; on the shell's panel, the action message's block loses its background.",
      "GAP-20 · In Safari and other WebKit browsers, the search field is drawn as a small native field: Kozmos's styles do not reach it there.",
    ],
  },
  {
    slug: "account-settings",
    title: "Account settings",
    kind: "page",
    summary:
      "A profile, notification and security settings page: fields with validation, switches, a radio group, tabs and confirmations.",
    gaps: [
      "GAP-13 · SelectTrigger takes no label, so each select is labelled by a FieldWrapper around it.",
      "GAP-13 · Textarea has no helper text, so the character count is a Text tied to the field with aria-describedby.",
      'GAP-12 · Alert is always role="alert"; the save confirmations pass role="status" so a screen reader announces them politely.',
    ],
  },
];

export const exampleKindLabel: Record<ExampleKind, string> = {
  page: "Page",
  app: "App",
};

export function getExample(slug: string): ExampleEntry {
  const example = examples.find((entry) => entry.slug === slug);
  if (!example) {
    throw new Error(`No example is registered as "${slug}".`);
  }
  return example;
}
