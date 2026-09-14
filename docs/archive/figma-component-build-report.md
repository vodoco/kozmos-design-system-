# Figma Component Build Report

Last checked: 2026-06-21

## Executive Summary

The new `Kozmos DS - Core Library` is now the active Figma target.

- Current repo source of truth is `STATUS.md` plus
  `docs/figma-library-manifest.json`. As of 2026-06-21, Core reports 68/68
  Web components, Web tests, Web linked Code Connect mappings, iOS components,
  iOS linked mappings, Android components, and Android linked mappings.
- React, SwiftUI, and Compose linked Code Connect parse checks pass. Current
  `.figma.*` mapping files contain no `node-id=TBD` placeholders.
- Navbar and Sidebar are slot-based shells. Product-specific content belongs in
  named slots, and shared `NavigationItem` instances should be composed into
  the navigation slots rather than hardcoded into the shell components.
- A repo-level token contrast contract now checks public semantic token pairs
  and Core runtime button aliases in both Light and Dark modes. The React
  Tailwind aliases for success, warning, and info actions intentionally use
  darker semantic fills so their existing mode-aware foreground contract remains
  WCAG AA safe.
- Remaining work is now visual/governance oriented: Figma page-by-page visual
  QA, docs freshness, public/private library boundary, and Product / SDK example
  quality. Older status notes below are retained for history when they describe
  how a component was built.

- Core is at a green audit checkpoint: the latest full library audit reported `warningCount: 0`, `componentSetCount: 36`, `componentCount: 435`, `iconSourceCount: 38`, and `variableCount: 1007`; SegmentedControl was linked afterward and should be included in the next `Audit Library` capture.
- Current linked component set node IDs include Link `170:1385`, Separator `170:1393`, Skeleton `170:1062`, Box `170:1002`, Stack `170:1027`, Container `170:1034`, Breadcrumb `170:1048`, Accordion `170:977`, Button `77:1055`, IconButton `77:1203`, Counter `149:13430`, Badge `78:246`, Chip `227:1329`, SegmentedControl `309:5165`, Card `87:2536`, List `237:2482`, Table `237:2547`, Tabs `90:3387`, Pagination `280:1157`, Tooltip `91:4672`, Dialog `143:13060`, Drawer `232:2042`, Popover `101:8118`, Menu `101:8170`, Checkbox `77:1410`, Radio `77:1436`, Switch `77:1465`, Input `77:1558`, Textarea `80:328`, Search `80:391`, Select `80:432`, Slider `80:473`, Progress `83:252`, Spinner `83:261`, Alert `83:308`, Toast `101:8189`, and Avatar `83:272`.
- Text, Heading, and Label are no longer canonical Figma component sets. They are maintained as text styles/tokens instead. Link and Separator remain component sets because they represent reusable interactive/structural UI, not pure typography.
- Tooltip side indicators now use four generated triangle `Tip` layers, one per `Side` variant, and the React, iOS, Android, Figma, and Code Connect contracts all expose side-aware behavior.
- The remaining audit output is advisory only: transparent/surface-dependent variants should be reviewed on `Surface/0` in Light/Dark and on product map surfaces before final sign-off.
- The plugin now has **Build Surface QA** to generate the `QA / Transparent Surfaces` page for that final review without disturbing source component-set node IDs.
- Surface QA visual review caught a dark-mode glass mismatch: Figma `Glass` Button/IconButton foreground was using `Colors/foreground/1000`, which resolves to black in Dark mode. The plugin now matches React's `text-foreground` behavior by binding Glass foreground to `Colors/foreground/0`, and `Audit Library` reports live QA contrast failures as `surface-contrast` issues.
- Core component sets no longer use the `/ v1` suffix. The importer keeps legacy lookup compatibility so older files can be updated safely, but new canonical names are unsuffixed.
- Rebuild no longer creates Archive / Legacy Reference content for rebuilt component sets. The safe path is still Update, because it preserves node IDs; Rebuild intentionally creates a new node ID.
- Composition debt is audited: Card/Dialog updates should compose live Button and Input instances instead of local frame clones for actions and form fields. `Audit Library` reports cloned subcomponent frames as warnings.
- Upcoming code components that are not yet canonical Figma component sets are tracked in [`docs/archive/figma-upcoming-components.md`](figma-upcoming-components.md).
- Core React Code Connect validates for all 40 current linked component-set mappings through `pnpm figma:parse:linked`; publish uses the same linked config when credentials are available.
- Native Code Connect validates for all 40 current linked component-set mappings through `pnpm figma:publish:native:linked:dry` across SwiftUI and Compose.
- NumberInput now has React, SwiftUI, and Compose Code Connect scaffolds plus local Figma importer build/update/rebuild actions. PasswordInput now has the React primitive, Code Connect scaffold, and local Figma importer build/update/rebuild actions. Both are intentionally unlinked until their Figma component sets are built and `node-id=TBD` is replaced.
- Native linked Code Connect has package-specific validation/publish lanes: `pnpm figma:parse:native:linked`, `pnpm figma:publish:native:linked:dry`, and `pnpm figma:publish:native:linked`.
- CI now dry-runs the linked Code Connect lanes where each parser can execute: React in the web job, SwiftUI in the macOS/iOS job, and Compose in the Android job. These steps skip with a notice when `FIGMA_ACCESS_TOKEN` is unavailable, such as on forks or before repository secret setup.
- CI also runs token-free linked Code Connect parse checks before those dry-runs, so parser drift is caught even when repository secrets are unavailable.
- Native linked configs include implementation files as well as `.figma` files. This gives Compose import/line metadata and gives Swift source links for non-generic mappings; Swift generic wrappers publish with their specialization names, such as `KozmosDialog<EmptyView>`, `KozmosCard<AnyView>`, and `Stack<AnyView>`.
- Foundations were imported through the local Figma plugin.
- `Button` was built in Figma from the React Button API.
- Button, IconButton, and Badge are linked through React Code Connect.
- Latest audited Button component set: `77:1055` (`node-id=77-1055`).
- Button icon-size variants expose a single `Icon` instance-swap slot backed by `Icon / Slot Default`.
- `Icon / Slot Default` is the only local fallback slot component; real artwork should come from the Pointr Icon Library.
- The plugin can now build a curated local `Icons` page with 38 `Icon / ...` source components from the `@kozmos/icons` registry.
- `IconButton` was built in Figma from the React IconButton API.
- Latest audited IconButton component set: `77:1203` (`node-id=77-1203`).
- `Badge` was built in Figma from the React Badge API.
- Latest audited Badge component set: `78:246` (`node-id=78-246`).
- Button, IconButton, and Badge now get component-level non-color variables for geometry and control internals that the foundations payload did not previously expose as exact tokens. These component tokens alias to existing primitive/layout variables where possible.
- Button and Badge label typography prefers the primary typography token family (`Readex Pro`) and falls back to Inter only if the Figma font is unavailable. Font size and line height are bound to component variables. Font family and weight remain token-aligned direct typography values because Figma does not expose them as normal variable bindings.
- The plugin UI now uses a component picker plus `Build` / `Update` actions instead of adding two new buttons for every component. The status row above the log reports the currently running selected action and the generated node ID when it finishes.
- The audit now reports unexpected top-level nodes on the `Components` page. Badge build/update also removes the exact empty top-level `Label Text` artifact that can be left behind by an interrupted first Badge build.
- Current Core Code Connect status: React, SwiftUI, and Compose linked mappings pass their linked dry-run publish lanes. Root `pnpm figma:publish:dry` remains blocked by non-Core scaffolds such as Grid, SplitButton, ToggleButton, and FloatingActionButton.
- The plugin is currently a code-to-Figma builder/importer/updater, not an uncontrolled two-way sync tool.
- The plugin now includes `Audit Library` to export reviewable Figma metadata from the open file.

> Historical note: sections below this point include build-phase details from the earlier component-library reconstruction. Prefer the executive summary above, `STATUS.md`, and `docs/figma-library-manifest.json` for current status.

## How Build Button Works

`Build Button` is a component-specific builder inside `figma/foundations-importer`.

It does five things:

1. Finds or creates the `Components` page.
2. Reads local Figma variables created by the foundations import.
3. Creates a `Button` component set from the React Button API.
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

The plugin now has `Update Button` for the safe path. It patches the existing `Button` node in place so the current `node-id=77-1055` stays stable. Use `Rebuild` only when the component set has internal Figma property errors or cannot be safely patched in place.

`Update Button` currently refreshes:

- Component set metadata and description
- Variant root layout, sizing, fills, strokes, radius, and generated effects
- Generated label, icon slot, and loading indicator layers
- Component-level float variables for Button widths, heights, padding, gap, radius, stroke width, icon size, spinner size, and label size/line-height. Spacing, common sizing, radius, and stroke-width values alias to existing primitives when exact matches exist.
- Button label font-size and line-height variable bindings. The updater may attempt the `Button / Label` text style, but the audit treats numeric typography variable bindings as the reliable contract because Figma drops the text style in this generated component flow.
- Missing/unrecognized variant warnings

It does not create missing Button variants yet. Missing variants are reported so we can choose whether to repair them manually or add a controlled repair action.

`Build IconButton` and `Update IconButton` follow the same pattern. `Build IconButton` creates `IconButton`; `Update IconButton` should be used after that to preserve `node-id=77-1203`.

`Build Icons` and `Update Icons` create or refresh the curated local icon source set. They import Pointr components by component key, preserve existing local `Icon / ...` node IDs, and apply those icons as preferred values on Button, IconButton, and Badge `Icon` instance-swap properties. Each nested `Pointr Source` is stretched to the local 24px icon bounds so resized consuming slots scale the source artwork instead of clipping a fixed 24px child. The slots are direct icon instances; consuming components apply foreground tokens through normal Figma fill/stroke overrides.

`Build IconButton` and `Update IconButton` also ensure component-level float variables for IconButton sizes, icon sizes, spinner sizes, radius, and stroke width. These variables now keep every generated IconButton root at a 44px minimum target while preserving size differentiation through icon/spinner scale, and alias to shared primitives for 16px, full radius, and 1px stroke width where exact matches exist.

The plugin UI now exposes these builders through the Components picker. Select the component, then click `Build` for first creation or `Update` for node-preserving refreshes. This keeps the panel stable as the library grows.

`Build Badge` and `Update Badge` follow the same node-preserving pattern. Badge creates 24 variants: `6 variants x 4 sizes`.

Badge maps:

- `Variant`: `Default`, `Destructive`, `Outline`, `Secondary`, `Ghost`, `Link`
- `Size`: `Default`, `Small`, `Large`, `Icon`
- `Label Text`: maps to Badge children in Code Connect
- `Icon`: maps to Badge icon-size variants through a curated instance-swap slot
- `Show Counter` / `Counter Text`: keeps counters hidden by default and supports labels like `New (2)`

Badge icon-size variants now use an icon slot instead of text so visual examples match the intended compact metadata pattern.

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
- `figma:publish:dry` correctly blocks on the remaining four React placeholder mappings; Core publish uses `figma:publish:linked:dry`.

## Recommended Next Work

1. Publish the linked Core lanes after internal approval: `pnpm figma:publish:linked` and `pnpm figma:publish:native:linked`.
2. Keep SegmentedControl linked to canonical component set `309:5165` and preserve that node ID in future updates.
3. Build PasswordInput and NumberInput in Figma, run `Audit Library`, then replace the `node-id=TBD` placeholders and add/publish the linked Code Connect configs.
4. Keep root `figma:publish:dry` intentionally blocked until non-Core placeholders either receive real Figma node IDs or move out of the broad publish lane.
