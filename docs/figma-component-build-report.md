# Figma Component Build Report

Last checked: 2026-05-19

## Executive Summary

The new `Kozmos DS - Core Library` is now the active Figma target.

- Core v1 is at a green audit checkpoint: the latest user-pasted library audit reported `warningCount: 0`, `componentSetCount: 22`, `componentCount: 335`, `iconSourceCount: 38`, and `variableCount: 806`.
- Current linked component set node IDs include Button `77:1055`, IconButton `77:1203`, Badge `78:246`, Card `87:2536`, Tabs `90:3387`, Tooltip `91:4672`, Dialog `101:8101`, Popover `101:8118`, Menu `101:8170`, Toast `101:8189`, and the field/selection/feedback primitives listed in the latest audit.
- Tooltip side indicators now use four generated triangle `Tip` layers, one per `Side` variant, and the React, iOS, Android, Figma, and Code Connect contracts all expose side-aware behavior.
- The remaining audit output is advisory only: transparent/surface-dependent variants should be reviewed on `Surface/0` in Light/Dark and on product map surfaces before final sign-off.
- The plugin now has **Build Surface QA** to generate the `QA / Transparent Surfaces` page for that final review without disturbing source component-set node IDs.
- Surface QA visual review caught a dark-mode glass mismatch: Figma `Glass` Button/IconButton foreground was using `Colors/foreground/1000`, which resolves to black in Dark mode. The plugin now matches React's `text-foreground` behavior by binding Glass foreground to `Colors/foreground/0`, and `Audit Library` reports live QA contrast failures as `surface-contrast` issues.
- Overlay/menu tranche is built and linked: **Dialog / v1**, **Popover / v1**, **Menu / v1**, and **Toast / v1** now have stable Figma component set IDs, builders, update/rebuild actions, component tokens, docs metadata, and React Code Connect mappings.
- Composition debt is now audited: Card/Dialog updates should compose live `Button / v1` and `Input / v1` instances instead of local frame clones for actions and form fields. `Audit Library` reports cloned subcomponent frames as warnings.
- Upcoming code components that are not yet canonical Figma component sets are tracked in [`docs/figma-upcoming-components.md`](figma-upcoming-components.md).
- Core React Code Connect is published to Figma for the 22 linked Core component files, including `DialogContent` at `node-id=101-8101`, `PopoverContent` at `node-id=101-8118`, `MenuContent` at `node-id=101-8170`, and `Toast` at `node-id=101-8189`.
- Native overlay/menu parity is now linked and published: iOS SwiftUI and Android Compose expose structured Toast, Dialog, Popover, and Menu APIs aligned to the Figma/Web anatomy while preserving existing generic/message/string-list entry points.
- Native linked Code Connect has package-specific validation/publish lanes: `pnpm figma:parse:native:linked`, `pnpm figma:publish:native:linked:dry`, and `pnpm figma:publish:native:linked`.
- CI now dry-runs the linked Code Connect lanes where each parser can execute: React in the web job, SwiftUI in the macOS/iOS job, and Compose in the Android job. These steps skip with a notice when `FIGMA_ACCESS_TOKEN` is unavailable, such as on forks or before repository secret setup.
- CI also runs token-free linked Code Connect parse checks before those dry-runs, so parser drift is caught even when repository secrets are unavailable.
- Native linked configs include implementation files as well as `.figma` files. This gives Compose import/line metadata and gives Swift source links for non-generic Menu/Toast mappings; Swift Dialog/Popover still publish as `KozmosDialog<EmptyView>` / `KozmosPopover<EmptyView>` because the current Swift parser does not match generic specializations back to their unspecialized source structs.
- Foundations were imported through the local Figma plugin.
- `Button / v1` was built in Figma from the React Button API.
- Button, IconButton, and Badge are linked through React Code Connect.
- Latest audited Button component set: `77:1055` (`node-id=77-1055`). The previous corrupt set `19:406` is archived on `Archive / Legacy Reference`.
- Button icon-size variants expose a single `Icon` instance-swap slot backed by `Icon / Slot Default`.
- `Icon / Slot Default` is the only local fallback slot component; real artwork should come from the Pointr Icon Library.
- The plugin can now build a curated local `Icons` page with 38 `Icon / ...` source components from the `@kozmos/icons` registry.
- `IconButton / v1` was built in Figma from the React IconButton API.
- Latest audited IconButton component set: `77:1203` (`node-id=77-1203`).
- `Badge / v1` was built in Figma from the React Badge API.
- Latest audited Badge component set: `78:246` (`node-id=78-246`). The archived predecessor `77:1378` remains on `Archive / Legacy Reference`.
- Button, IconButton, and Badge now get component-level non-color variables for geometry and control internals that the foundations payload did not previously expose as exact tokens. These component tokens alias to existing primitive/layout variables where possible.
- Button and Badge label typography prefers the primary typography token family (`Readex Pro`) and falls back to Inter only if the Figma font is unavailable. Font size and line height are bound to component variables. Font family and weight remain token-aligned direct typography values because Figma does not expose them as normal variable bindings.
- The plugin UI now uses a component picker plus `Build` / `Update` actions instead of adding two new buttons for every component. The status row above the log reports the currently running selected action and the generated node ID when it finishes.
- The audit now reports unexpected top-level nodes on the `Components` page. Badge build/update also removes the exact empty top-level `Label Text` artifact that can be left behind by an interrupted first Badge build.
- Current Core Code Connect status: React Core linked mappings pass `pnpm figma:parse:linked` and `pnpm figma:publish:linked:dry`; native overlay/menu mappings pass `pnpm figma:parse:native:linked` and `pnpm figma:publish:native:linked:dry`. Root `pnpm figma:publish:dry` remains blocked by older non-Core scaffolds such as Drawer, Grid, Stack, SplitButton, ToggleButton, and FloatingActionButton.
- The plugin is currently a code-to-Figma builder/importer/updater, not an uncontrolled two-way sync tool.
- The plugin now includes `Audit Library` to export reviewable Figma metadata from the open file.

## How Build Button Works

`Build Button` is a component-specific builder inside `figma/foundations-importer`.

It does five things:

1. Finds or creates the `Components` page.
2. Reads local Figma variables created by the foundations import.
3. Creates a `Button / v1` component set from the React Button API.
4. Creates variants for `Variant`, `Size`, and `State`.
5. Returns the component set node ID for Code Connect.

Button currently maps:

- `Variant`: `Default`, `Destructive`, `Outline`, `Secondary`, `Ghost`, `Link`, `Glass`
- `Size`: `Default`, `Small`, `Large`, `Icon`
- `State`: `Default`, `Disabled`, `Loading`

That creates 84 variants: `7 variants x 4 sizes x 3 states`.

## How This Scales To Other Components

There should not be one blind generic build function for every component. Each component needs a small component-specific builder because each one has different anatomy, variant axes, token usage, child layers, and accessibility requirements.

Recommended pattern:

- Keep shared helpers for pages, fonts, variable lookup, color binding, node IDs, documentation, and audit output.
- Add one builder per component, such as `buildBadgeComponent`, `buildAvatarComponent`, `buildAlertComponent`, and `buildCardComponent`.
- Add a controlled batch action only after the individual builders are stable.

The safe sequence is:

1. Build one component.
2. Verify the visual result in Figma.
3. Verify the component property API matches code.
4. Wire Code Connect with the real node ID.
5. Run repo checks.
6. Move to the next component.

## Will Existing Components Carry Over?

Not automatically.

There are three different meanings of "existing components":

- Existing code components: yes, they are the source of truth and can be rebuilt into this new Figma library.
- Existing Code Connect scaffolds: yes, they carry over as files, but each still needs a real Figma node ID.
- Old Figma components from `Kozmos Design System 2.0`: no, they should not be blindly carried over because their APIs and naming are outdated.

The old Figma file can still be used as visual reference or archive material. Directly wiring old components into Code Connect would be risky because the old Button model already differed from the current React API.

## Do We Need To Build Again?

Usually no.

After a component is built and linked:

- Do not rebuild just because the file was opened again.
- Keep the same component set node ID whenever possible.
- Code Connect should keep pointing at that stable node ID.

Rebuild or update is needed when:

- React props or variants change.
- Token names or token values change.
- A design review accepts a visual update that should become canonical.
- The component structure is wrong and cannot be safely patched in place.

The plugin now has `Update Button` for the safe path. It patches the existing `Button / v1` node in place so the current `node-id=77-1055` stays stable. Use `Rebuild` only when the component set has internal Figma property errors or cannot be safely patched in place.

`Update Button` currently refreshes:

- Component set metadata and description
- Variant root layout, sizing, fills, strokes, radius, and generated effects
- Generated label, icon slot, and loading indicator layers
- Component-level float variables for Button widths, heights, padding, gap, radius, stroke width, icon size, spinner size, and label size/line-height. Spacing, common sizing, radius, and stroke-width values alias to existing primitives when exact matches exist.
- Button label font-size and line-height variable bindings. The updater may attempt the `Button / Label` text style, but the audit treats numeric typography variable bindings as the reliable contract because Figma drops the text style in this generated component flow.
- Missing/unrecognized variant warnings

It does not create missing Button variants yet. Missing variants are reported so we can choose whether to repair them manually or add a controlled repair action.

`Build IconButton` and `Update IconButton` follow the same pattern. `Build IconButton` creates `IconButton / v1`; `Update IconButton` should be used after that to preserve `node-id=77-1203`.

`Build Icons` and `Update Icons` create or refresh the curated local icon source set. They import Pointr components by component key, preserve existing local `Icon / ...` node IDs, and apply those icons as preferred values on Button and IconButton `Icon` instance-swap properties. Each nested `Pointr Source` is stretched to the local 24px icon bounds so resized consuming slots scale the source artwork instead of clipping a fixed 24px child. The slots are direct icon instances; consuming components apply foreground tokens through normal Figma fill/stroke overrides.

`Build IconButton` and `Update IconButton` also ensure component-level float variables for IconButton sizes, icon sizes, spinner sizes, radius, and stroke width. These variables now keep every generated IconButton root at a 44px minimum target while preserving size differentiation through icon/spinner scale, and alias to shared primitives for 16px, full radius, and 1px stroke width where exact matches exist.

The plugin UI now exposes these builders through the Components picker. Select the component, then click `Build` for first creation or `Update` for node-preserving refreshes. This keeps the panel stable as the library grows.

`Build Badge` and `Update Badge` follow the same node-preserving pattern. Badge creates 24 variants: `6 variants x 4 sizes`.

Badge maps:

- `Variant`: `Default`, `Destructive`, `Outline`, `Secondary`, `Ghost`, `Link`
- `Size`: `Default`, `Small`, `Large`, `Icon`
- `Label Text`: maps to Badge children in Code Connect

Badge intentionally does not expose an `Icon` instance-swap property yet. The React Badge API accepts arbitrary `children`; it does not have a first-class icon prop like Button/IconButton. If product usage later needs icon badges, that should become an explicit API/design decision rather than silently baking an icon contract into Figma first.

Important token note: Button radius is currently bound to a component-level `Button/radius` value of 8px to preserve the accepted Figma visuals. The code-level primitive `Radius/Button` currently resolves through `Radius/md` and may be larger. That should be reconciled deliberately rather than silently changing every accepted Button shape in Figma.

## Designer Change Process

The process should be controlled two-way, not silent two-way sync.

Designers can safely change:

- Documentation frames
- Usage examples
- Internal layer naming
- Layout polish that does not change component property names
- Visual adjustments using existing variables

Designer changes need code/token review when they affect:

- Variable names or values
- Light/Dark mode values
- Component property names
- Variant names
- Required states
- Accessibility behavior
- Platform behavior across Web, iOS, and Android

Recommended flow:

1. Designer makes a Figma change in the canonical library or a draft area.
2. Plugin `Audit Library` exports component metadata and variable usage.
3. Engineer/designer review decides whether it is visual-only, token-level, or API-level.
4. Token/API changes become a repo PR.
5. After merge, the plugin updates Figma and Code Connect remains or is relinked.

## Accessibility Coverage Model

Accessibility has to be checked in both code and Figma.

Code checks:

- Component unit tests
- Storybook interaction tests
- Axe checks through `scripts/skills/check-a11y.ts`
- Required CI Storybook E2E and accessibility verification
- Component props for disabled/loading/focus semantics

Figma checks:

- Every interactive component has `Default`, `Disabled`, and relevant loading/selected/error states.
- Focus state is documented, even if represented as a separate example rather than every variant combination.
- Minimum touch target is at least 44px for generated interactive component roots.
- Text has enough contrast against its background in Light and Dark modes.
- Disabled states remain visibly disabled without becoming unreadable.
- Component property names match code props or Code Connect mappings.
- Variable bindings are used for fills, strokes, text colors, radius, spacing, and effects where possible.
- `Audit Library` now reports bound variable fields separately, so non-color coverage can be reviewed instead of inferred from a single bound-variable count.

## Current Accessibility Notes

Button:

- Has `Default`, `Disabled`, and `Loading` states.
- Has size coverage: default, small, large, icon.
- `Update Button` now keeps generated variant roots fixed-size so audit no longer reads the 14px spinner as the interactive size.
- Button, IconButton, and Badge generated roots now target at least 44px in every size. The audit still reports 36-43px controls as compact-size advisories for future components; anything below 36px remains a warning.
- Button, IconButton, and Badge now share a repo-level component contract at `packages/tokens/src/component-contracts.json`. `pnpm components:contract:check` verifies that React, Vue wrappers, the Figma generator, iOS, and Android keep the same core sizes, variants, and 44px minimum target.
- Secondary Button now uses the code-aligned `Colors/background/200` + `Colors/foreground/0` pairing instead of the old same-color secondary button tokens.
- `Audit Library` now reports text contrast and icon/control contrast for component sets without adding a visible background fill to the component set. `Update Button` and `Update IconButton` also clear any accidental component-set container fill left from earlier plugin versions. Text failures use the 4.5:1 AA threshold; icon/control failures use the 3:1 non-text threshold. Disabled states are treated as inactive and are not counted as hard failures. The non-text audit now ignores component variant containers such as `Size=Icon`, checks actual icon/spinner child layers, resolves bound Figma variable values in both Light and Dark modes before using raw paint fallbacks, and uses `Surface/0` as the host surface for transparent variants.
- `Audit Library` now includes a top-level node sample for each page and warns when the `Components` page contains top-level nodes other than generated component sets. This helps catch partial build artifacts instead of only seeing a suspicious `topLevelChildren` count.
- Button focus behavior is documented in the component-set metadata and follows the React `focus-visible` ring.
- Icon-only Button variants expose a single `Icon` instance-swap slot. The generated slot is now a direct icon instance with the variant foreground token applied to tintable fill/stroke layers.
- If curated icons have been built, Button and IconButton default the `Icon` source to `Icon / search-md` and expose the local curated icon set as preferred swap values.
- `Audit Library` checks that each curated `Icon / ...` component has a direct `Pointr Source` instance, matching 24px bounds, and Left+Right / Top+Bottom constraints.
- The plugin no longer creates size/token-specific source components such as `Icon / Slot / 16px / Primary Buttons/themed/button/foreground/content/idle` or semantic duplicates such as `Icon / Slot / On Fill`. Older generated duplicates are removed from `Utilities` after Button and IconButton are rebound to `Icon / Slot Default`.
- `Update Button` recreates generated icon-only placeholder instances during the instance-swap binding step, so stale placeholder artwork cannot keep an old raw fallback color after the property is configured.
- Generated icon slot instances now store their intended foreground token for audit purposes. `Audit Library` checks that token, reports legacy mask wrappers, and flags direct icon instances that do not expose tintable fill or stroke layers.
- Button and IconButton updates now bind generated layout fields to component variables where Figma supports numeric bindings: width, height, padding, item spacing, corner radius, stroke width, icon size, and spinner size.
- Button labels bind font size and line height to component variables and use `Readex Pro Medium` directly for font family/weight to match the code token behind `font-sans`.
- IconButton variants use the same single `Icon` instance-swap slot for all non-loading states.
- Badge labels bind font size and line height to component variables and use `Readex Pro Medium` directly for font family/weight. Badge default/destructive foregrounds use the mode-aware `Colors/foreground/1000` / `--primitives-colors-foreground-1000` token so dark-mode accent backgrounds keep accessible contrast in both Figma and React.
- The local fallback slot now renders as a simple search glyph, not a filled square placeholder. Designers should still swap it to real Pointr icons in consuming instances.
- Code has disabled/loading behavior and unit tests.
- React Button default, destructive, outline, ghost, and link variants now use the same component-scoped button tokens as the Figma build. This fixes the old dark-mode alias pairing where `#eca413` on white and `#2be3bd` on white failed contrast at 2.12:1 and 1.64:1 respectively.
- A dedicated visual `Focus` state can still be added later if designers want it visible in the variant picker.

System:

- Latest user-pasted Figma audit reported `warningCount: 0`, `iconSourceCount: 38`, and clean icon slot integrity after the curated icon pass. Re-run `Audit Library` with the updated plugin to capture the new Light/Dark contrast breakdown.
- Icon work is now source-library integration with Pointr Icon Library, not a full icon-library rebuild inside Kozmos Core.
- The Pointr Icon Library catalogue has 1,176 published icons across 19 categories.
- Remaining token risk: generic `success`, `warning`, and `info` aliases still need semantic foreground remediation. Current failing pairs include success light 2.74:1, warning light 1.99:1, info light 3.49:1, success dark 3.80:1, and info dark 3.46:1.
- `pnpm lint` passes.
- `pnpm --filter @kozmos/react test -- Button` passes.
- Completion report now detects Button as linked.
- `figma:publish:dry` correctly blocks on the remaining 24 placeholder mappings.

## Recommended Next Work

1. Extend native linked Code Connect beyond overlays: Button/IconButton, Checkbox/Radio/Switch, Input/Textarea/Search/Select, Tabs, Tooltip, Progress, Spinner, Avatar, Alert, Badge, and Card should be checked against the same Figma/Web prop contracts.
2. Decide whether to expose root publish as a Core-only default or keep it intentionally blocked until older non-Core scaffolds either receive real Figma node IDs or are removed from the broad publish lane.
3. Re-run Figma `Audit Library` after the native publish and preserve the audit JSON so published React/SwiftUI/Compose Code Connect coverage can be reviewed alongside component contrast and surface QA.
