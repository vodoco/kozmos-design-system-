# Kozmos design system: Audit Report

I have extensively reviewed the `package.json`, React components structure, UI testing routines, and Typescript implementation errors to gather an analysis on overlooked points and missing patterns in this repository.

## 1. Typescript Implementation Oversights

- **"any" Assertions**: Several key components currently suppress TS errors with `as any`.
  - **`Heading.tsx` and `Text.tsx`**: Uses `<Tag {...props as any} ref={ref as any}/>`. This completely dismantles typescript validations. It would be better to implement `asChild` polymorphic React pattern (using Radix `Slot` module) or apply exact definitions rather than casting dynamic props inline.

- **Missing `forwardRef` wrappers**: The structural approach to `@kozmos/react/components/*` missed wrapping `ref` instances.
  - In several test instances `ref` outputs are omitted. A design-system component generally receives unpredicted child interactions or focuses. You should wrap functional component exports with `React.forwardRef<Target, Props>(...)` (such as Alert, Badge, FloorSelector) so developers consuming the UI library can effectively assign their DOM handlers.

## 2. Incomplete Testing Pipelines

- **Turborepo crashes & vitest configs**: Running tests globally crashes internally with an ambiguous `Broken pipe` or `turborepo crashed`. The sub-system config lacks `run-node` dependency internally (Command fails when running `npm run lint`).
  - The lint script `npm run lint` fails entirely because ESLint cannot locate `@typescript-eslint/eslint-plugin` within `/packages/react`. To fix this, you must run: `pnpm add -w -D @typescript-eslint/eslint-plugin@latest`.

- **Style Dictionary Token collisions**: When `@kozmos/tokens` tries to build the CSS variables (`build.mjs`), it warns about: `While building variables-[light/dark].css, token collisions were found.`. 
  - Having token names that collide and output exactly similar CSS variables means the system architecture definitions have duplicate tokens (e.g. `colors.primary` vs `core.primary.color`). This leads to the unpredictable application of system tokens and `broken pipes`.

## 3. UI and Code Previews issues
- **Storybook / Docs Blocks configurations**: Within `@kozmos/docs/`, some syntax codes (like Swift and Kotlin in `<PlatformSnippets />`) are not handled well natively by Storybook's block source preview parser typings (`SupportedLanguage`). I circumvented this inside `PlatformSnippets.tsx`, although it generally requires maintaining exact dependencies versions array in `package.json`.
- **Missed Storybook Interaction Loggers (`console.log`)**: Over `25` component storybook files have unassigned inline properties. Example `POICard.stories.tsx`: `onNavigate: () => console.log('Navigate')`. These components will print into production runtime logs unless they are cleaned properly inside production bounds or exported accurately.

## Summary map
I suggest immediately addressing the `eslint-plugin` missing dependencies first, followed by correctly tracing the overlapping tokens in `@kozmos/tokens/build.mjs`. Then fixing the polymorphic `as any` wrappers in Heading / Text.
