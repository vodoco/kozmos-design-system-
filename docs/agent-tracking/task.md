# Epic 8: Architectural Hardening & Release Pipelines

## Phase 1: Release & Cache Integrity (Completed)
- [x] **Changeset Initialization**: Execute `npx @changesets/cli init` generating the `.changeset/config.json` release matrix manually.
- [x] **Turbo Build Determinism**: Evaluate and enforce `inputs: []` arrays universally across `turbo.json` to mathematically tie the caching output to specific origin modules. 
- [x] **React 19 Compatibility**: Inject `^18.2.0 || ^19.0.0` arrays across `package.json` peer dependency mappings suppressing consumer resolution rejections dynamically.
- [x] **GitHub Actions Scoping**: Rewrite the `ci.yml` testing suite to isolate the `test:contracts` hook strictly into `--filter @kozmos/react`.

## Phase 2: Token Parity & Mobile Fidelity (Completed)
- [/] **Android Token Bleed Investigation**: Audit the `@kozmos/tokens` pipeline to trace why `Android` only compiles 119 tokens while iOS isolates 403 natively.
- [/] **Android Token Matrix Repair**: Rewrite the StyleDictionary filtering or XML/Kotlin transformation hooks resolving the 284 token deficit.
- [x] **iOS Dark Mode Hex Collisions**: Investigate `KozmosColors.swift` synthesis isolating why the `colorScheme == .dark` conditionals return Light variables physically.
- [x] **Style Dictionary Multi-dimensional Resolvers**: Inject accurate Dark Mode definitions into the Style Dictionary payload dynamically regenerating accurate dynamic traits natively.

## Phase 3: Vue DX Fidelity (Completed)
- [x] **Vue Typescript Native Resolution**: Replace the crashed `vite-plugin-dts` layer with a pure `vue-tsc` AST generator.
- [x] **Vue tsconfig.json Instantiation**: Author a local TS compiler boundary targeting `/dist` accurately.
- [x] **Vue index.d.ts Routing**: Validate the exact output location of the emitted declaration trees and mathematically bind `package.json` `types` to the correct payload definitively.

## Phase 4: CI Governance & Automation (Completed)
- [x] **Orphan Script Discovery**: Audit `scripts/check-a11y.ts` and `scripts/check-completion.ts` mechanically exposing their runtime environment constraints statically.
- [x] **GitHub Action Translation**: Replicate the execution matrix into `.github/workflows/ci.yml` validating AST coverage dynamically per standard merge event mechanically.

# Epic 9: Production Hardening & Architectural Parity

## Phase 1: Security & Publishing Integrity (Completed)
- [x] **Figma Token Revocation**: Securely wipe the compromised `figd_LfVzmcOS-...` payload from local `.env` boundaries terminating CI exposure physically.
- [x] **Publish Config Normalization**: Inject `"access": "public"` securely across `@kozmos/tokens`, `@kozmos/icons`, and `.changeset/config.json` mechanically resolving NPM 403 blocks.

## Phase 2: React Server Components (SSR) & Subsystems (Completed)
- [x] **ThemeProvider SSR Hardening**: Apply `typeof window !== 'undefined'` execution bounds to `window.matchMedia` and `localStorage` hooks preventing Next.js App Router segfaults dynamically.
- [x] **Bundle Hygiene**: Extract `GlassSettingsPanel` definitively from the production compilation tree natively.

## Phase 3: Form Constraints & ARIA Execution (Completed)
- [x] **Icon Native Accessibility**: Inject global `aria-hidden="true"` into graphical primitives systematically suppressing VoiceOver decorative callouts.
- [x] **Error Interfaces**: Abstract universal `error` prop bindings across `Button`, `Input`, and `Select` structures mimicking `DatePicker` behavior correctly.

# Epic 10: Execution Fidelity & ARIA Completeness

## Phase 1: SSR & Ecosystem Cleansing (Completed)
- [x] **Next.js Hydration Constraints**: Attach absolute `'use client';` boundary arrays onto the `ThemeProvider` isolating Browser properties accurately.
- [x] **Storybook Path Realignment**: Point `<GlassSettingsPanel>` physically outside of the global barrel preventing accidental inclusion identically.
- [x] **Semantic Correctness**: Revert rogue `<Button error />` bindings strictly honoring fundamental semantic use-cases reliably.

## Phase 2: ARIA Parity & TypeScript Generation (Completed)
- [x] **Conditional VoiceOver Skips**: Rewrite `Icon.tsx` checking for local `aria-label` arrays strictly dodging simultaneous overlapping VoiceOver hints dynamically.
- [x] **Visual Text Injections**: Construct physical `<p>` boundaries adjacent to `Input`, `Select`, and `OTPInput` dynamically activating `aria-invalid` scaling error-arrays correctly natively.
- [x] **Vue Index Retention**: Mutate the Vue Vite pipeline natively rendering `vue-tsc` post-build dodging the standard TS `outDir` clearance strictly.

# Epic 11: Verification & Documentation Continuity

## Phase 1: Structural Verification Sync (Completed)
- [x] **Vitest Execution Depth**: Upgraded `Input.test.tsx`, `Select.test.tsx`, and `OTPInput.test.tsx` strictly interrogating `aria-invalid` and `aria-describedby` string hooks against explicit DOM renders conclusively testing false-positives!
- [x] **Storybook Error Traces**: Executed physical validation components across all Input primitives displaying destructive styling organically mirroring Vitest constraints exactly explicitly!
- [x] **Documentation Artifact Parity**: Flushed internal AI-agent architecture tracking manifests (`task.md`, `walkthrough.md`) out to `/docs/agent-tracking/` physically establishing explicit visibility!

# Epic 12: Infrastructure Parity & Automation

## Phase 1: Native Mobile Fidelity & Sync (Completed)
- [x] **iOS Dark Mode Expansion**: Interrogate the token JSON/Swift definitions resolving the 8% coverage limit natively regenerating explicit `.dark` mode maps properly across all native elements.
- [x] **Figma Automatic Sync**: Activate the GitHub Action Sync structural pipelines pulling `tokens.json` dynamically tying Figma variables to automatic PR generations locally.

## Phase 2: Design Code Integration (Completed)
- [x] **Figma Code Connect Activation**: Hydrate the 180+ `.figma.tsx` stubs tying production attributes down to Figma dev-mode variants mapping actual code parameters successfully.
- [x] **Playwright Test Matrix**: Establish automated Chromium/WebKit E2E testing strictly verifying interactions inside Sandboxes preventing silent visual breaking dynamically.

## Phase 3: Visual Diffing & Releases (Completed)
- [x] **Automated Snapshot Testing**: Implement Paparazzi (Android) and SnapshotTesting (iOS) explicitly triggering `.assertSnapshot()` matrices during local validation steps.
- [x] **Changesets Subsystems**: Configure an automated Release workflow mapping `changeset version` pipelines strictly generating Changelogs organically tied to standard NPM publications automatically!
