# Storybook manual-review queue — 2026-09-18

Measured from the clean preview checkout at `bbeddcf`, Chromium 145.0.7632.6,
all 236 stories in light/dark at 320×568 and 1280×800: **944 cases, zero automated
violations, page errors or document-horizontal-overflow failures**.

**48 cases across 15 stories still have axe incomplete results**, with 62 node
flags: 38 contrast, 16 ARIA-value and 8 hidden-focus. These are not necessarily
62 distinct DOM nodes; repeated themes/viewports count separately. The earlier
70-case queue was investigated: duplicate range labels, invisible warning/demo
text and a missing POI description were repaired. Do not erase the remaining
findings or describe them as passes.

Full machine evidence is local/ignored:
`/private/tmp/kozmos-owned-css-verify.dV1etM/test-results/storybook-release-review-final.json`.
It retains viewport, theme, targets, HTML and axe explanations. The portable table
below is committed; reproduce with the commands in
[the maintenance guide](overnight-quality-pass-2026-09-18.md).

## Remaining stories

Links use the running local preview. Use its Theme toolbar and viewport controls
to match the report; a default desktop/light rendering does not reproduce every
flag.

| Story                                                                                                                               | Flagged cases | Rule                  | Axe explanation                                                                                                             |
| ----------------------------------------------------------------------------------------------------------------------------------- | ------------: | --------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| [components-button--glass](http://127.0.0.1:6006/?path=/story/components-button--glass)                                             |             4 | color-contrast        | Element's background color could not be determined due to a pseudo element                                                  |
| [components-dialog--default](http://127.0.0.1:6006/?path=/story/components-dialog--default)                                         |             4 | aria-valid-attr-value | Unable to determine if aria-controls referenced ID exists on the page while using aria-haspopup: aria-controls="radix-:r1:" |
| [components-poicard--inside-map-overlay](http://127.0.0.1:6006/?path=/story/components-poicard--inside-map-overlay)                 |             2 | color-contrast        | Element's background color could not be determined because it is overlapped by another element                              |
| [components-scrollarea--horizontal-quick-access](http://127.0.0.1:6006/?path=/story/components-scrollarea--horizontal-quick-access) |             2 | color-contrast        | Element's background color could not be determined because it partially overlaps other elements                             |
| [data-display-table--default](http://127.0.0.1:6006/?path=/story/data-display-table--default)                                       |             2 | color-contrast        | Element's background color could not be determined because it's partially obscured by another element                       |
| [design-system-tokens-map--typography](http://127.0.0.1:6006/?path=/story/design-system-tokens-map--typography)                     |             2 | color-contrast        | Element's background color could not be determined because it's partially obscured by another element                       |
| [examples-poi-detail-card--default](http://127.0.0.1:6006/?path=/story/examples-poi-detail-card--default)                           |             4 | aria-hidden-focus     | Check that focusable elements are not tabbable in the current state                                                         |
| [feedback-backdrop--default](http://127.0.0.1:6006/?path=/story/feedback-backdrop--default)                                         |             4 | color-contrast        | Element's background color could not be determined because it is overlapped by another element                              |
| [map-mapoverlay--bottom-center](http://127.0.0.1:6006/?path=/story/map-mapoverlay--bottom-center)                                   |             2 | color-contrast        | Element's background color could not be determined because it is overlapped by another element                              |
| [overlay-bottomsheet--default](http://127.0.0.1:6006/?path=/story/overlay-bottomsheet--default)                                     |             4 | aria-valid-attr-value | Unable to determine if aria-controls referenced ID exists on the page while using aria-haspopup: aria-controls="radix-:r1:" |
| [overlay-drawer--default](http://127.0.0.1:6006/?path=/story/overlay-drawer--default)                                               |             4 | aria-valid-attr-value | Unable to determine if aria-controls referenced ID exists on the page while using aria-haspopup: aria-controls="radix-:r1:" |
| [overlay-popover--default](http://127.0.0.1:6006/?path=/story/overlay-popover--default)                                             |             4 | aria-valid-attr-value | Unable to determine if aria-controls referenced ID exists on the page while using aria-haspopup: aria-controls="radix-:r1:" |
| [product-sdk-adaptivemapshell--error](http://127.0.0.1:6006/?path=/story/product-sdk-adaptivemapshell--error)                       |             4 | color-contrast        | Element's background color could not be determined because it is overlapped by another element                              |
| [product-sdk-browsecategoriespanel--default](http://127.0.0.1:6006/?path=/story/product-sdk-browsecategoriespanel--default)         |             2 | color-contrast        | Element's background color could not be determined because it's partially obscured by another element                       |
| [product-sdk-locationpin--numbered-selected](http://127.0.0.1:6006/?path=/story/product-sdk-locationpin--numbered-selected)         |             4 | color-contrast        | Element content is too short to determine if it is actual text content                                                      |

## How to decide each case

- **Contrast:** inspect the actual rendered/composited surface, including glass,
  overlap, scrolling and selected states. Check foreground/background contrast at
  the visible text. An obscured or one-character sample needs human interpretation;
  do not replace an unreadable label with an icon merely to silence the test.
- **Closed overlay references:** the primitive points `aria-controls` at content
  that mounts when opened. Verify the ID exists while open, the trigger relationship
  is announced appropriately, and close/unmount restores focus. Dialog/Popover
  opening is covered by the new interaction matrix; this is not blanket approval
  for every overlay/screen reader.
- **POI focus guards:** these are Radix's hidden boundary guards. Confirm real Tab
  and Shift+Tab navigation redirects inside the sheet without announcing invisible
  controls, including close/reopen and assistive technology. Do not delete guards,
  change their roles or globally suppress `aria-hidden-focus` to make the audit green.

Record browser/OS/assistive technology, story/theme/viewport, actions, observations
and resolution for each reviewed item. Keep automated evidence separate from
manual approval. A zero-incomplete scan would still not certify every interactive
state, physical foldable, browser floor, zoom mode or product integration.
