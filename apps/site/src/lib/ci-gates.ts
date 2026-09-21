/**
 * What runs on every pull request, from `.github/workflows/ci.yml` on the
 * branch the site is built on. Grouped as the workflow's steps are; the
 * wording follows the steps' names and comments.
 */
export interface Gate {
  title: string;
  detail: string;
  /** The pnpm script or command the step runs, where there is one to name. */
  command?: string;
}

export const ciGates: readonly Gate[] = [
  {
    title: "Lint, build, unit and accessibility tests",
    detail:
      "The design system gates on its own lint. Every package builds, and the React tests run with axe on each component.",
    command: "pnpm lint && pnpm build && pnpm test",
  },
  {
    title: "Contracts between platforms",
    detail:
      "Each platform's component sources are read and compared against the shared contract, the POI fixtures and the taxonomy projection, so React, SwiftUI and Compose describe the same shape.",
    command: "pnpm components:contract:check",
  },
  {
    title: "Token contracts: contrast, radius, border, elevation, typography",
    detail:
      "The 22 contrast pairs are checked in both themes from the generated CSS, and every platform is held to the same radius, border, elevation and typography values.",
    command: "pnpm tokens:contrast:check",
  },
  {
    title: "No new raw values",
    detail:
      "A ratchet over a known backlog: every component is scanned for raw colours, shadows and sizes, and the count may not go up.",
    command: "pnpm tokens:raw:check",
  },
  {
    title: "No classes that compile to nothing",
    detail:
      "A Tailwind class the build cannot generate is dropped without a word; this reads the built stylesheet and refuses any new one.",
    command: "pnpm components:classes:check",
  },
  {
    title: "Packages install from their tarballs",
    detail:
      "Every public package is packed, installed into an empty project with npm, and every export, README import and sample is resolved, rendered and type-checked.",
    command: "pnpm packages:install:check",
  },
  {
    title: "Figma plugin stamp and painters",
    detail:
      "The importer's painters run against a stand-in for the Plugin API and what they draw is asserted against the component contract; the build stamp must match the source.",
    command: "pnpm figma:painters:check",
  },
  {
    title: "Code Connect parses on three platforms",
    detail:
      "The React, SwiftUI and Compose mappings are parsed, and dry-run against the Figma file when the token is present.",
    command: "pnpm figma:parse:linked",
  },
  {
    title: "Browser checks in Chromium, Firefox and WebKit",
    detail:
      "Built output is driven in three engines: adaptive layout geometry, overlay ownership, theme and stylesheet isolation, scoped configuration, and form-control compatibility.",
    command: "pnpm test:adaptive",
  },
  {
    title: "Storybook end to end, audited",
    detail:
      "Every React story is opened, checked with axe, and its keyboard and scroll interactions exercised in three engines; the SDK's POI reference screens are compared as well.",
    command: "pnpm test:storybook-audit",
  },
];
