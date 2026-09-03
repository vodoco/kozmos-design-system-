# Style Playbook

How to change how Kozmos looks, without breaking the agreement between Figma,
the web and the two native platforms.

Written 2026-09-03. Every number here was measured, not estimated.

## The one rule

**A value that depends on another value must be derived, not written.**

Three fixed radii went stale within a day of being set, because a card moved
and the numbers inside it did not. Five padding tokens said 4 while the
painters that drew them said 12. A file row's radius was copied from a
popover. Each was a literal standing in for a relationship.

So: if a number is "the container's radius minus its inset", write that
subtraction. If it is "the spacing step worth 12", ask for the step. The
checks below exist to catch the cases where somebody writes the answer instead
of the question.

## The vocabulary

Name the job, not the size. Changing how the product feels is then one alias
edit, not a sweep.

### Radius — `Semantics.Radius`

| Role        | px   | For                                                         |
| ----------- | ---- | ----------------------------------------------------------- |
| `none`      | 0    | Flush edges: sidebars, navbars, anything meeting a viewport |
| `marker`    | 4    | Small marks inside something else: badges, swatches, rows   |
| `control`   | 16   | Buttons, inputs, selects, popovers, toasts — the workhorse  |
| `container` | 20   | Cards, dialogs, file rows: a surface that holds controls    |
| `panel`     | 24   | Large surfaces                                              |
| `pill`      | 9999 | A sentinel meaning "as round as this box allows"            |

`pill` is never emitted to native as a length. iOS uses `Capsule()`, Android
`RoundedCornerShape(percent = 50)`, and the Figma plugin resolves it to
`min(w, h) / 2` **after layout**, because a pill's radius is half of whatever
box it ends up in. Restyling text can change that box, which is why the text
pass re-resolves pills.

Nested radii derive: `R_outer = min(R_inner + padding, min(w, h) / 2)`. The
full argument, the exclusions and the measured history are in
[nested-radius.md](nested-radius.md).

### Border — `Semantics.Border`

| Role     | Light     | Dark      | On the page | For                                    |
| -------- | --------- | --------- | ----------- | -------------------------------------- |
| `Subtle` | `#C7CAD1` | `#2E3138` | 1.6:1       | Container edges and dividers           |
| `Input`  | `#747B8B` | `#8B8474` | 4.2 / 5.7:1 | Boundaries of things you interact with |

`Subtle` is soft on purpose: a container is told apart by its surface and its
shadow, not its outline. `Input` is held to WCAG 1.4.11's 3:1 because a field's
boundary carries meaning. The nearest softer step, `background/400`, reads
**2.997:1** and fails by three thousandths, which is why `Input` is
`foreground/500` and not one step lighter.

**A divider is a border**, whether it is drawn as a stroke or as a 1px filled
rectangle. Separator, the menu separator, row separators, the timeline
connector and the stepper connector all read `Subtle`.

### Colour ramps — `Primitives.Colors`

`background` and `foreground` are 13-step greys, `theme` 11 steps, `emotional`
four families. Every step is a hand-typed hex today; making them derive from a
base is scoped in [generated-color-scales.md](generated-color-scales.md).

Two steps to know: `/25` and `/50` were added on 2026-09-02 because the ramp
jumped from white straight to `/100`, so a hovered row and a chosen row could
not be told apart. Active rows use `/50`, selected rows `/100`.

### Spacing — `Primitives.Layout.spacing`

The step names are the arithmetic: **`spacing/N` is N ÷ 12.5 px**. So 50 is 4,
75 is 6, 150 is 12, 200 is 16. The plugin has both directions,
`spacingAliasFor(px)` and `spacingPx(step)`; use them rather than typing an
alias next to a value, because a typed alias silently wins over the value it
sits beside.

## Cookbook

### Change how round the product feels

Edit one alias in `packages/tokens/src/tokens-light.json` and its twin in
`tokens-dark.json`, under `Semantics.Radius`. Then:

```bash
pnpm tokens:build && pnpm figma:foundations && pnpm tokens:radius:check
```

Everything derived follows. Nothing else needs editing — that is the whole
point of the role.

### Change a border colour

Edit `Semantics.Border.Subtle` or `.Input` in both token files. Then the same
build, plus:

```bash
pnpm tokens:border:check
```

That check refuses a `Subtle` at or above 3:1 and an `Input` below it, so the
accessible boundary cannot be softened away by accident.

### Add a colour step

Add it to `Primitives.Colors.<ramp>` in **both** token files, then rebuild and
regenerate the payload. It reaches Figma only through an import — see the
Figma loop below. Until the import runs, painters fall back to their literal
hex and the audit reports contrast failures that no component Update can fix.

### Change a component's geometry

Component numbers live in one table in `figma/foundations-importer/code.js`
(search `name: "<Component>/`). Each entry is `{ name, value, alias, scopes }`.

- If the number depends on another number, write the expression.
- If the alias is a spacing step, produce it with `spacingAliasFor(value)`.
- The **alias wins over the value** at runtime, so never leave a typed alias
  beside a derived value.

Then Update that set in the plugin and verify.

### Add a new component

Give it a `build-`, `update-` and `rebuild-` handler, and add its update
function to `CORE_UPDATE_SEQUENCE`. `pnpm components:contract:check` fails if
you forget the sequence entry, because a bulk action that quietly skips a set
is worse than none: the skipped sets look updated because the run reported
success.

## The traps

Each of these cost real time. They fail silently, which is what makes them
expensive.

**A bound property ignores the painter.** Most layout properties on generated
nodes are bound to component variables. A bound property renders the
variable's value; a raw `paddingLeft = 12` in a painter changes nothing. When
the file disagrees with the code, read `boundVariables` on the node first
(`pnpm tokens:radius:nesting` prints them on every finding) and fix the entry
in the token table.

**Corners bind one at a time.** A radius bound through the variables panel
arrives over the REST API as `rectangleCornerRadii`, four aliases in one
object, while `boundVariables.cornerRadius` stays empty. Reading only the
latter is how one stale variable passed for "not bound" for a day.

**Figma runs stale plugin code.** It reads a development plugin's files when
the plugin _launches_. Quit Figma entirely (⌘Q) and relaunch after every
change to `code.js` — reopening the panel is not enough.

**Never press Rebuild.** It mints new node IDs, and Code Connect pins the old
ones. Update preserves them. Rebuild is for a set that does not exist yet.

**"Found" is not "loaded".** The Setup badge says Found when the _file_ already
has foundations. The payload picker is separate, and Import Foundations stays
disabled until a payload is parsed. An audit that keeps reporting the same
contrast failures after every Update, with the Variables count unchanged,
means the import never ran.

**Two checkouts, two payloads.** There is a second clone at
`P/Pointr Cloud/kozmos-design-system-` with an older payload. Figma is
registered to run the plugin from `K/kozmos-design-system-dev`, and the
payload must come from the same place. The status line should read **620
token candidates**; 615 means the wrong file.

**The audit's rules must agree with the painters.** Twice in one day a text
rule expected a different style from the one the painter applies. The audit
then reports stale text that no Update can clear, and Apply Text Styles
rewrites the node to the rule's style, which can resize a box and strand
anything derived from it. When a stale-text count survives an Update, compare
`inferTextStyleKeyForComponentText` with the painter before touching the file.

**A set may only declare what its rows render.** A property bound to no layer
blocks publishing the whole library with "Invalid assets". One is enough.

## The checks

All of these run in CI. Run them locally before pushing; the whole set takes
under a minute apart from the two that call Figma.

| Command                          | Guards                                                            |
| -------------------------------- | ----------------------------------------------------------------- |
| `pnpm tokens:radius:check`       | Plugin, Tailwind and native agree with `Semantics.Radius`         |
| `pnpm tokens:border:check`       | Every consumer reads `Semantics.Border`, and the contrast bands   |
| `pnpm tokens:contrast:check`     | 50 text pairs clear WCAG AA in both themes                        |
| `pnpm tokens:typography:check`   | Type scale parity                                                 |
| `pnpm components:contract:check` | Variant axes, props, and the bulk sequences' completeness         |
| `pnpm figma:plugin:check`        | The plugin's restricted syntax (no spread, `?.` or `??`)          |
| `pnpm tokens:radius:nesting`     | **Reads the live Figma file.** Concentric radii; `--strict` in CI |
| `pnpm figma:verify`              | **Reads the live Figma file.** Six publishing checks              |

The two that read Figma need `FIGMA_ACCESS_TOKEN` in `.env`. In CI they skip
with a notice when the secret is absent, so a fork's build still passes.

`figma:verify` is the cheap way to tell whether a plugin run actually landed:
it reads the file, not the plugin's own report.

## The Figma loop

In order, every time:

1. **⌘Q Figma** if `code.js` changed, and relaunch.
2. **Import** if tokens changed: Setup → Payload file →
   `docs/figma-foundations-payload.json` **from this checkout** → confirm the
   token-candidate count → untick _Create pages_ and _Create foundations
   overview frame_ → **Import Foundations** → wait for "Foundations import
   complete."
3. **Update** the affected sets. `Update All Core` covers 73 sets and
   `Update All Product / SDK` covers 24; both preserve node IDs and reorganize
   once at the end. Never Rebuild.
4. **Verify from the terminal**, not from the plugin's audit alone:
   ```bash
   pnpm figma:verify && pnpm tokens:radius:nesting
   ```

## Where things live

| Thing                        | Path                                              |
| ---------------------------- | ------------------------------------------------- |
| Token source (both modes)    | `packages/tokens/src/tokens-{light,dark}.json`    |
| Token build                  | `packages/tokens/build.mjs`                       |
| Figma importer plugin        | `figma/foundations-importer/code.js`, `ui.html`   |
| Component number table       | same file, search `name: "<Component>/`           |
| Foundations payload          | `docs/figma-foundations-payload.json` (generated) |
| Web colour and radius map    | `packages/react/tailwind.config.js`               |
| Native colour and dimensions | `packages/{ios/Sources,android/src/...}/Kozmos*`  |
| Checks                       | `scripts/check-*.mjs`                             |

The Figma file is `Yj4O8p6Y9h2Sa9zJVoAiVY`, Components page node `4:4`.

## Known gaps

Recorded so nobody rediscovers them:

- **`Semantics.Surface` 100–300 are hand-typed hexes** that are not on the
  `background` ramp. They predate the ramp and nothing reconciles them.
- **The dark grey ramp is warm-tinted** (`#8B8474`) while the light one is cool
  (`#747B8B`). Visible when toggling modes.
- **The tracked native colour files are a frozen May baseline** that has drifted
  from the generator's output, and 29 native border references still hard-code
  the old grey rather than reading the role.
- **Off-scale icon sizes**: 18px in NavigationItem, Sidebar and SearchBar where
  the web uses 20; 14px in IconButton, Tag and Breadcrumb. The scale is
  12/16/20/24.
- **Text stragglers**: 14/22 in Card, POICard, POIDetailPanel and
  WayfindingCard; 16/20 in EmptyState.
- **An off-ramp surface**, `#E4E6EA`, on 67 variants of SegmentedControl, Chip,
  ToggleButton and Box.
- **Screen breakpoints are emitted 16× inflated** to native.
- **Figma's TimePicker models an open dropdown; the web's does not** render one
  at all, so the two disagree structurally rather than stylistically.
