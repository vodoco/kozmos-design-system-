# Installed-product pilot: first compatibility slice — 18 September 2026

## Decision and scope

The checkout contains MapScale Review, which has Pointr Cloud authentication and
a WebSDK map adapter alongside local review/demo state. It does **not** contain
the proposed end-user place-search → results → details → route-preview module.
The web playground is a component demo with mock imagery and no-op map callbacks;
it cannot serve as proof of that integration.

This slice validates the **existing MapScale Review app as an installed-package
consumer** and fixes defects uncovered by it. It is not a completed production
migration or authenticated SDK acceptance. The intended end-user module/repository
still needs to be identified before that flow can be migrated.

## Three defects found and repaired

1. `FeaturePanel.tsx` still used `Button asChild`, removed from the public API.
   Its external links now use real anchors and the supported `buttonVariants`
   styling helper, preserving outline/small treatment and `noopener noreferrer`.
   There is no button nested around an anchor and no replacement navigation shim.
2. MapScale used Lucide 0.300 with React 19, outside that Lucide version's peer
   range. Its declarations referenced `ReactSVG`, unavailable in the installed
   React types. Normal product compilation hid this behind `skipLibCheck`.
   The product now pins 0.563.0, already used by Kozmos. The lockfile changes only
   that importer and removes the unused 0.300 package/snapshot; no broad upgrade.
3. Screenshot review caught a failure even after geometry and axe passed:
   scoped preflight reduced the product headline to inherited body size, while
   scoped Text utilities overrode the product's title and small-print CSS.
   Preflight is now zero-specificity inside its existing boundary. Text/Heading
   use owned, namespaced typography recipes with the existing scale and tokens.
   Product CSS is unchanged. No `!important`, global overflow hiding or extra
   product specificity was added to obtain a pass.

The React change has a patch changeset. No release version is applied, and no npm
publish, push or merge is performed. Main stays unchanged.

## Repeatable evidence

`scripts/check-product-consumer.mjs`:

- Copies the product's versioned source, public assets, scratch benches and build
  configuration into an isolated temporary directory. It does not copy `.env`,
  credentials, local node_modules or existing dist. Scratch remains included
  because the real app's tsconfig includes it.
- Packs all public Kozmos packages. Direct and transitive Kozmos dependencies
  resolve to these tarballs. It asserts installed real paths stay inside the
  consumer and contain distributions, not workspace source links.
- Pins other direct dependencies to the locally installed workspace versions.
  The isolated npm lockfile is retained. Transitive npm resolution is fresh, so
  inspect that lockfile when reproducing a registry-dependent failure.
- Runs the original production build, an additional strict application typecheck
  with library checking enabled, and the product's existing **680 geometry
  checks**. The product's own compiler settings are not weakened.
- With `--browser`, runs the retained built app in Chromium, Firefox and WebKit.

`scripts/check-product-consumer-browser.mjs`:

- Serves only the installed consumer's built output on ephemeral loopback.
- Uses fresh browser contexts and blocks all non-local HTTP requests. No real
  credentials or API/SDK operations are exercised. External fonts and the SDK
  script are blocked; this is fallback-font, **unconfigured signed-out** coverage.
- Checks 320×568, 568×320 and 1280×800: visible/reachable controls, keyboard order,
  horizontal overflow, runtime errors and axe WCAG A/AA rules.
- Checks the product's actual typography: headline at least 38px, form title 26px,
  small print 11.5px. The first browser smoke missed this because mere visibility
  is not visual correctness; those regressions now fail explicitly.
- Saves screenshots and JSON findings (including incomplete axe checks, which
  are not silently converted into passes).

The CI web job runs `product:consumer:check --browser` after browser installation.
Other existing package and Storybook gates remain in place.

Verification for this slice: 437 React unit tests, nine CSS compiler tests,
owned-CSS checks in all three engines with and without scope, 99 Docs pages at
320/1280px (164 snippet checks), and all 82 React recipes compiling against
installed React 18/19 consumers. The product's nine offline browser scenarios
passed after the typography assertions were added. Desktop and narrow screenshots
were reviewed; this is not a replacement for authenticated visual acceptance.

## Commands and artifacts

From the implementation branch `astra/browser-compatibility`:

```sh
pnpm install --frozen-lockfile
pnpm --filter "@kozmos/react..." build
pnpm product:consumer:check --browser
pnpm --filter @kozmos/react test
pnpm test:css-build
pnpm test:owned-css
ADAPTIVE_BROWSER=firefox pnpm test:owned-css
ADAPTIVE_BROWSER=webkit pnpm test:owned-css
pnpm components:classes:check
pnpm packages:install:check
```

To rerun only browser checks, pass the directory printed by the consumer command:

```sh
node scripts/check-product-consumer-browser.mjs /absolute/path/to/retained-consumer
ADAPTIVE_BROWSER=webkit node scripts/check-product-consumer-browser.mjs /absolute/path/to/retained-consumer
```

This pass's verified consumer and screenshots are retained at:

`/private/var/folders/55/rtd9x_112k50h52r2mgc56pm0000gn/T/kozmos-product-consumer-dCJ9RQ`

The temporary directory is not a durable deliverable: reproduce it with the CLI
command. It contains `verification.log`, `result.json`, `browser-*.json`,
`signed-out-*.png`, the exact tarballs, and `app/package-lock.json`.

## Where to change things

- Product navigation link: `apps/mapscale-review/src/ui/FeaturePanel.tsx`.
- Dependency pin: `apps/mapscale-review/package.json` and `pnpm-lock.yaml`.
- Reset ownership: `packages/react/postcss/scoped-css.cjs` and its tests.
- Typography: `packages/react/src/components/Text/Text.tsx`,
  `Heading/Heading.tsx`, `packages/react/src/styles/owned-typography.css`.
- Component isolation regression: `packages/react/tests/integration/owned-css-host.tsx`
  and `scripts/check-owned-css.mjs`. Runs both with and without native CSS scope.
- Installed-consumer gates: the two `scripts/check-product-consumer*.mjs` files.

Consumers should not target Text's old internal utility class names; use its
public size/weight/color/alignment props and consumer classes. Heading retains
its semantic `as` override and level-based visual scale. This migrates only
typography, not every remaining legacy component.

## Still required before release

- Identify the intended end-user SDK module/repository and its real data/map
  adapter contract. Do not invent a replacement module and call it migrated.
- Agree a controlled non-production environment and test account for authenticated
  operations. This pass deliberately did not sign in, fetch live venue data,
  save edits, publish changes or calculate/start routes.
- Test real loading, empty/error/retry, selection synchronization, focus restoration,
  routes and map geometry with that adapter. Compile/geometry success here is not
  evidence for those behaviours.
- Review authenticated product screens and icon appearance after the dependency
  alignment. The old product mixes raw elements/styles with DS components; it is
  not yet rebuilt solely from Kozmos.
- Validate actual fonts, localization/zoom, devices/foldables, screen readers and
  the earlier 48 incomplete accessibility cases.
- Finish the remaining native/Vue snippet, native build, CSS ownership, browser
  support and release-operation gates in the preceding reports. Existing
  Storybook/Vue peer-version drift and large product bundle warnings remain.

The next meaningful integration step needs the product target and controlled
environment, not another generic visual pass. npm publication remains premature.
