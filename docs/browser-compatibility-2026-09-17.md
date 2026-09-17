# Browser compatibility: measured release blocker

2026-09-17 · `astra/browser-compatibility`, based on merged foundations `040f53d`.
This is an investigative branch, **not release-ready**. The new form-control check
is deliberately blocking in CI; no skip, expected-failure allowance or fallback
was added to hide the failure. No product CSS or browser minimum was changed.

## Finding

The distributed React stylesheet requires bounded native `@scope`. Our installed
Playwright WebKit 26.0 implements the rule for normal elements but ignores its
declarations on inputs and textareas. The real exported `Input` and `Textarea`
therefore lose their sizing, border, radius and background. In the test host an
Input measures **21px high instead of 44px**, with a 3px host radius instead of
the 16px semantic control radius. The same failure affects light/dark siblings,
nested providers, owned portal content and a live theme change.

This is not just an old-browser feature absence: `CSSScopeRule` exists in that
engine. A feature-presence check would report support despite the rendering bug.
It reproduces with a tiny plain CSS/HTML scope as well as the actual packaged
components. No React source aliases are used in the component fixture.

**Correction to earlier verification:** the existing 92 Chromium/WebKit checks
covered adaptive geometry, overlays, tokens, dark variants and runtime configuration,
but not scoped native form controls. Their passing result did not prove those
controls worked. The new failure is a gap in our test coverage, not a production
regression introduced by this investigative branch.

## Evidence

| Installed Playwright engine | Built form-control checks | Meaning                                                                                                |
| --------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------ |
| Chromium 145.0.7632.6       | 13 pass                   | This engine passes the tested forms and ownership behavior; not a minimum-version certification.       |
| Firefox 146.0.1             | 13 pass                   | Genuine Firefox execution, not a Chromium fallback.                                                    |
| WebKit 26.0                 | 3 pass, 10 fail           | Form styling fails; host preservation, portal containment/editing and absence of JS errors still pass. |

The fixture asserts computed backgrounds against each theme's reference surface,
the semantic radius, border, padding, display and size. It also checks unrelated
host form styles, labelled editing and provider-owned portal containment. A typo
in the initial test's portal attribute was corrected against ThemeProvider's actual
`data-kozmos-portal` attribute; that test-only mistake initially failed all three
engines and is not claimed as a product bug.

The browser launcher previously treated every value other than `webkit` as Chromium
(with `chrome` selecting its installed channel). Two regression tests first failed:
`ADAPTIVE_BROWSER=firefox` actually launched Chromium, and a misspelling was silently
accepted. The launcher now explicitly supports chromium/chrome/firefox/webkit,
rejects unknown names and logs the actual engine/version. Historical runs explicitly
requesting Chromium/WebKit remain valid; no earlier Firefox claim is being made.

The existing 46-check geometry/overlay/theme/configuration suite also passes in
each of Chromium 145.0.7632.6, Firefox 146.0.1 and WebKit 26.0: 138 passing checks,
separate from the form-control results above. CI now includes Firefox plus the new
form-control gate for all three engines. The pinned WebKit failure must be resolved,
not removed from the matrix.

## Published support information is not our product policy

MDN browser-compat-data, read at commit
[`fece3f7494a5d99f1bfbdf0cc6485eb2c980471c`](https://github.com/mdn/browser-compat-data/blob/fece3f7494a5d99f1bfbdf0cc6485eb2c980471c/css/at-rules/scope.json),
records basic `@scope` from Chromium 118 and Firefox 146. Safari support starts at
17.4, but 26.0–before 26.4 is marked partial specifically for input/textarea rules.
[Apple's Safari 26.4 release notes](https://developer.apple.com/documentation/safari-release-notes/safari-26_4-release-notes)
list the fix. We have not run Safari 26.4 or certified its complete component behavior.

These version numbers are feature evidence, **not accepted Kozmos minimums**.
Browser-compat-data mirrors mobile/WebView entries; that does not substitute for
Pointr's actual embedded engine and OS matrix. Native package targets are iOS 16
and Android API 26, but neither declares the React/WebView support contract.

There is another version-sensitive change around `&` specificity inside `@scope`.
We inspected the built CSS with a selector parser: its ampersands are escaped
Tailwind class-name text, not unresolved CSS nesting selectors. Do not raise our
minimum to the version of that separate feature solely because a text search finds
`&`. Nested scope-boundary behavior still needs direct minimum-engine testing.

## Recommended direction and required decision

Recommend retaining Pointr's existing supported browser/WebView population and
removing native `@scope` as a mandatory rendering dependency **before npm publish**,
if that population includes the affected/older engines. This is an architectural
change, not a form-only unscoped override or browser-sniffed patch.

A candidate design is explicitly namespaced component styling, component-local
resets and nearest-provider token-driven states. It must preserve unrelated-host
styles, arbitrary nested themes, consumer overrides and owned portals across every
component—not just make this one fixture green. Broad descendant prefixes alone
do not establish nested theme isolation. Shadow DOM is another possible boundary,
but adds focus/portal/integration contracts and should not be introduced implicitly.

The alternative is a deliberately modern-only browser policy, with the affected
Safari range excluded and exact minimum engines certified, including real WebViews.
Even then, updating Playwright until this test passes is not evidence that older
Pointr installations are supported.

**Needed from Olcay/Pointr:** minimum supported Safari/OS and Android WebView/Chrome
versions, Firefox/enterprise requirements, and whether embedded hosts can guarantee
engine updates. The earlier recommendation to preserve existing Pointr support does
not invent those values. No narrowing of support has been approved. Keep npm blocked
until the decision, architectural work if needed, and device evidence are complete.

## Reproduce

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium firefox webkit
pnpm --filter './packages/*' build
pnpm test:browser-selection
pnpm test:browser-compatibility
ADAPTIVE_BROWSER=firefox pnpm test:browser-compatibility
ADAPTIVE_BROWSER=webkit pnpm test:browser-compatibility # fails: 10 form-style checks
ADAPTIVE_BROWSER=firefox pnpm test:adaptive
ADAPTIVE_BROWSER=firefox pnpm test:overlays
ADAPTIVE_BROWSER=firefox pnpm test:themes
ADAPTIVE_BROWSER=firefox pnpm test:config
```

The form check reports engine version, user agent, feature presence and computed
styles even on failure. No live Safari application, physical device, keyboard/hinge,
minimum-version or complete visual/accessibility certification was performed here.
Release safeguards are separately pushed in PR #54; nothing in this branch authorizes
merging, credentials, publication or a narrower customer support policy.
