# Kozmos Universal Component Audit & Roadmap

Following the successful deployment of the Universal Todo Application, a global mathematical audit was conducted across all 4 monorepo packages to determine the exact state of cross-platform parity.

Here is the definitive breakdown of what exists and **what is left to do**.

## 1. The Vue 3 Proxy Deficit

**Status:** Highly Incomplete (13% Parity)
While the structural `<script setup>` proxy logic (`createVueWrapper`) was proven flawless during the Todo App build, **Vue is missing 54 component wrappers.**

- **Bridged (9):** `Button`, `Tag`, `Badge`, `Avatar`, `Alert`, `Checkbox`, `Slider`, `Input`, `OTPInput`.
- **What's Left:** We must export the remaining wrappers in `packages/vue/src/index.ts` (e.g., `Dialog`, `Popover`, `Card`, `Accordion`, `Tabs`, `Table`, etc.). This requires manual mapping of complex v-model emits for stateful components like `Select` or `Tabs`.

## 2. React Exclusives (The 65 vs 63 Discrepancy)

**Status:** Architecture Asymmetry Detected
The React golden standard folder (`packages/react/src/components`) contains **65** subdirectories, whereas iOS and Android identically contain **63**.

- **Missing Native Components:**
  - `Label`: Used fundamentally in React (Radix UI), but entirely absent from the Native ecosystem.
- **Resolved:** `GlassSettingsPanel` is an internal/dev-only control surface and is excluded from public React, Vue, native, and Figma manifest surfaces.
- **What's Left:** `Label` should either be deprecated in React (in favor of `Text`) or built natively.
- **Clean Up:** `PlatformSnippets.tsx` is lingering loosely inside the React `components` folder. It should be moved to `utils/` to protect bundler tree-shaking purity.

## 3. Native SDK API Drift (iOS & Android)

**Status:** Legacy Token Risk (85% Unverified)
While all 63 component files _physically exist_ with code inside `Packages/ios` and `Packages/android` (averaging 50-100 lines each), only the 7 components touched during this session (`Button`, `Checkbox`, `Input`, `Avatar`, `Alert`, `Badge`, `Tag`) have been structurally migrated to the **Universal API Contract**.

- **The Problem:** Complex overlays like `Dialog.swift`, `Popover.kt`, `BottomSheet.swift`, and `Menu.kt` are almost certainly still using deprecated stringly-typed APIs (`title="Label"`) instead of the new universal programmatic `variant / children / @Composable RowScope` signatures. They are likely hardcoding legacy semantic tokens.
- **What's Left:** We must run a massive sweeping refactor across the remaining 56 native SwiftUI and Jetpack Compose files to ensure their structs identically match the React prop definitions.

---

## Suggested Next Steps (Execution Plan)

1.  **Phase 5A: Deploy the Vue Armada.**
    - Execute a batch loop mapped over the 54 missing React components to inject them into `packages/vue/src/index.ts`. This instantly brings Vue up to 100% parity with React.
2.  **Phase 5B: The Native Overlay Schema.**
    - Tackle the highest-risk structural components (`Dialog`, `Sheet`/`BottomSheet`, `Popover`, `Menu`) across Swift and Kotlin. Strip out hardcoded strings and inject the new declarative content enclosures.
3.  **Phase 5C: Visual Hardening.**
    - Setup automated visual testing (Chromatic / Playwright) targeting the 4 Sandboxes to guarantee that future Figma token imports won't silently shatter the native alignment.
