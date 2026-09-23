# One public catalogue, separate platform verification

## Architecture and scope

The public Storybook has one React-rendered catalogue. Component Docs pages keep
React, Vue, Swift and Kotlin reference tabs. The private Vue harness remains
available for maintainers, but is not composed into the public sidebar and is
not emitted under the public build's `/vue/` directory.

Important correction: `@kozmos/vue` is a private React adapter, not an independent
native Vue library. Its wrappers require React/React DOM, mount client-side React
roots and do not support SSR. Three story groups are coverage, not the number of
exported adapters. This change does not make Vue publishable or certify parity.

## Commands (run from the repository root)

```sh
# Public catalogue, port 6006
pnpm --filter @kozmos/docs storybook

# Optional internal Vue harness, port 6007
pnpm --filter @kozmos/docs storybook:vue

# Both development servers, intentionally opt-in
pnpm --filter @kozmos/docs storybook:all

# Public deployable output: apps/docs/storybook-static
pnpm --filter @kozmos/docs build

# Separate internal output: apps/docs/storybook-internal/vue
pnpm --filter @kozmos/docs build-storybook:vue

# Run against the corresponding development or static servers
pnpm test:storybook-docs
pnpm test:storybook-vue-smoke

# Explicit URL overrides for independently hosted builds
STORYBOOK_URL=http://127.0.0.1:6008 pnpm test:storybook-docs
VUE_STORYBOOK_URL=http://127.0.0.1:6009 pnpm test:storybook-vue-smoke

pnpm docs:snippets:check
pnpm --filter @kozmos/react exec vitest run src/components/PlatformSnippets.test.tsx
```

Only deploy `storybook-static`, not the internal harness. The public build must
be produced fresh with the build command; do not overlay it on an old published
directory that may retain an obsolete `/vue/` subtree.

## Files to change

- `apps/docs/.storybook/main.ts`: public stories, addons and build configuration;
  no external Vue `refs` entry.
- `apps/docs/package.json`: public/default commands and opt-in internal commands.
- `apps/docs/src/platform-support.mdx`: public platform support/validation policy.
- `packages/react/src/components/PlatformSnippets.tsx`: single shared helper.
  The old app helper now re-exports this implementation.
- `apps/docs/.storybook/preview.css`: documentation-only wrapping, code layout,
  focus styling and compact Docs canvases. Not shipped as library CSS.
- `packages/react/src/components/<Component>/<Component>.mdx`: reference snippets.
- `scripts/check-storybook-docs.mjs`: public manager independence, every Docs page
  at 320/1280px, snippet ownership/layout and tab selection, keyboard and axe checks.
- `scripts/check-storybook-vue-smoke.mjs`: render/runtime smoke checks of every
  internal Vue story. This does **not** test full adapter behaviour or parity.
- `.github/workflows/ci.yml`: tests both built outputs independently.

## Styling boundaries

The original language buttons were unstyled because MDX lives outside the story
decorator. Only the Kozmos language controls now get an explicit light theme
boundary; Storybook's code viewer stays outside its reset. Embedded live examples
retain their independent toolbar-controlled theme.

The viewer uses Storybook's existing SyntaxHighlighter with its supported
`wrapLongLines` option, rather than patching its DOM, disabling axe rules, or
rewriting the copied code. Long code lines are sized to the local container.
Swift/Kotlin render as plain code because this installed highlighter does not
register those languages. The Storybook dependency is development-only and pinned
to the existing version; no runtime package API changed.

Docs canvases no longer inherit the full-screen minimum height intended for the
standalone story view. The Button page also uses actual native usage signatures
instead of incomplete duplicated implementations, and an HTML emotion table
without stale hard-coded colours.

## Honest support status

- React is the live preview; a displayed reference snippet is not automatically
  compiled by Storybook.
- Vue is explicitly internal/private, requires React, and is not an npm install
  recommendation.
- Native snippets are labelled references, not executable web previews or proof
  of platform parity. Some existing snippets remain implementation excerpts.
- Missing snippet text means **not documented**, not necessarily unsupported.
- `docs:snippets:check` checks names against source trees. It does not establish
  valid props/imports, compile examples, or test behaviour. Keep those limits
  visible until executable fixtures replace the current reference strings.

## Still required before release

1. Convert and compile the remaining reference snippets as actual consumer
   fixtures; build a per-component platform/API support matrix from evidence.
2. Decide the long-term Vue scope: keep the private bridge, or fund a native Vue
   implementation. Do not publish the bridge under an implied native/SSR contract.
3. Test Vue binding, slots, nested context, teardown, keyboard and accessibility
   behaviour; the six-story smoke suite is intentionally a much smaller claim.
4. Address the earlier component audit: blank MapSearch, mobile Navbar action
   loss, POICard overlay overlap/clipping, remaining Docs tables/overflow,
   disconnected Docs pages and stale product examples.
5. Re-run the package/release/browser/native gates and a real product integration.
   This documentation consolidation is not a production-readiness sign-off.

The pre-existing component audit is in
`docs/storybook-component-review-2026-09-18.md`; do not read its old screenshot
results as verification of this newer documentation build.

## Verification of this batch

- Fresh public Storybook build: passed. 99 Docs pages checked at 320px and
  1280px; 164 reference sections passed tab-selection/layout checks. Shared
  keyboard navigation and axe checks passed with no rule suppression.
- Button's four language tabs: axe and geometry passed at 320/568/1280px in
  Chromium, Firefox and WebKit (36 tab/viewport/browser combinations).
- Clipboard content preserved the original Vue code in Chromium at all three
  widths, despite visual line wrapping.
- React: 434 tests across 112 files passed, including four reference-helper
  unit tests. React, Docs and Vue typechecks passed.
- Source-name check: 327 identifiers across 324 snippets passed. This is **not**
  a claim that all 324 snippets compile.
- Separate internal Vue static build and all six render smoke cases passed.
- Frozen offline dependency installation passed. Existing Storybook/Vue peer
  version warnings remain; this batch does not upgrade the framework stack.

The public docs browser gate and internal Vue smoke gate now run in CI. The
three-engine Button/clipboard spot-check above was also performed locally; it
does not stand in for an exhaustive multi-platform component audit.
