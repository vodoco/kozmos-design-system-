# POI taxonomy display integration — 10.12.0

Source: https://pointrmapstorage.blob.core.windows.net/taxonomy/10.12.0/taxonomy.json

The published dictionary has 60 properties. All 64 distinct property/value PNG URLs returned HTTP 200 with an image content type during this review. Pixel inspection confirmed all 64 are black alpha assets, and all permit cross-origin loading. The example marks these assets `iconMonochrome: true`: alpha masks follow current text color in light/dark mode. Ordinary/color images remain unmodified. This is a point-in-time check, not a CDN uptime guarantee.

## Implemented boundary

`packages/react/src/components/POIDetailPanel/POITaxonomy.fixtures.ts` is a **product-adapter example**, not a new public API and not an SDK wire-format parser. It uses the version-pinned `taxonomy-10.12.0.fixture.json` projection (valueType, segment, validation, display, iconUrl). The public React bundle does not import that dictionary. Real products should own the equivalent adapter and supply already-localized presentation data; components must not fetch taxonomy at render time.

The POI examples now pass explicit taxonomy keys and raw enum values to the adapter. They no longer infer icons from English display labels. The core presentation contracts gained optional `iconUrl` support for services, attributes and tags, plus generic highlighted properties, semantic tones and a price scale.

## Display rules

| Source                                    | Presentation rule                                                                                                         |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `display.displayName`                     | Property label; `segment` groups related attributes                                                                       |
| `display.valueDisplay[value].displayName` | Value label, before raw-value fallback                                                                                    |
| Property `iconUrl`                        | Boolean/scalar property chip or highlighted-property icon                                                                 |
| Value `iconUrl`                           | Enum/array value chip icon; no property-icon fallback for text-only enum values                                           |
| `display.order`                           | Ascending generic attribute section/item order; not a visibility boolean                                                  |
| `display.highlight`                       | Independent ascending metadata order, populated values only                                                               |
| Value/property `color`                    | Explicit success/alert/danger/theme mapping to existing accessible semantic tokens; unknown or absent colors stay neutral |
| `display.action` / `actionName`           | Product contact action, not a generic tag; URL execution remains outside this adapter                                     |

Cuisine and dietary chips remain text-only. WiFi and other true amenities use their property icons. Payment and service options use their individual value icons. Free-form hashtags remain text-only unless the product explicitly supplies an icon. Icons are decorative alongside readable labels; failed or rejected assets disappear without removing the label. HTTPS and same-origin root-relative image URLs are supported, not raw SVG markup or data/javascript URLs. Hosts must allow the asset origin in their image CSP or supply approved same-origin assets.

Null, undefined, empty strings and empty arrays are absent. Zero is valid for wait time and capacity. Boolean false is displayed when the dictionary names it (wheelchair accessibility); other unnamed false amenities are omitted. Duplicated array values are removed, invalid types/enum values and unsupported object schemas produce diagnostic issues, and inherited object keys are never treated as dictionary entries.

The supplied product references additionally specify rating, price, crowd, wait and occupancy as highlight-only. This is an explicit product policy: the taxonomy also gives order to crowd/wait/occupancy, so it does not encode that restriction by itself. Crowd and wait combine only when both exist; wait-only and zero-minute cases remain visible. The strip scrolls horizontally rather than wrapping to a second row.

## Differences requiring upstream decisions

1. **Color conflicts:** taxonomy says Occupied = danger and Busy = alert. Screenshots show Occupied = amber and Busy = red. Under Construction, Maintenance, Closed and Temporarily Closed have no published color. This implementation follows the taxonomy without inventing missing colors.
2. **Service options cardinality:** `serviceOptions` is `enum`, not array. Examples now show one selection. Supporting simultaneous dine-in/takeout/delivery needs a corrected taxonomy/API contract, not an undocumented array exception. `genderDesignation` is also a single enum.
3. **Wheelchair wording:** true resolves to “Wheelchair Friendly”; false to “Not Wheelchair Accessible”. This intentionally differs from the screenshots. Missing data does not mean accessible.
4. **Rating schema and colors:** rating is only declared `object`; score/count fields and thresholds are unspecified. Current illustrative ratings are supplied through an explicit custom presentation formatter, with neutral score styling. They are not evidence of a validated real SDK rating parser. Do not infer thresholds from three screenshot examples.
5. **Opening hours:** also an unspecified object. The existing localized demonstration remains separate; timezone, exceptions and live status belong to the product adapter.
6. **Localization:** this example uses the English source dictionary. The taxonomy publishes web translation files through `i18n.baseUrl`; production must integrate locale keys/fallbacks and localized number/wait/rating formatting. `formatWait` is injectable. English fallback is not multilingual readiness.
7. **Assets:** PNGs are loaded as external decorative assets. Monochrome masks require CORS and image CSP access; failed loads fall back to text. Offline packaging, caching and privacy policy still need a host-level decision. No icon URL is invented from a property name or from the advertised alternate formats.

## Edit and verify

- Presentation types: `packages/product-contracts/src/index.ts`.
- Example mapping and policy: `POITaxonomy.fixtures.ts` beside the panel.
- Data for restaurant/retail/fitness/entrance/parking: `POIDetailPanel.fixtures.ts`.
- Rendering/failure fallback: `POIDetailContent.tsx`.
- Owned styles: `packages/react/src/styles/owned-poi-detail.css`.
- Mapping/edge tests: `POITaxonomy.test.ts`; image fallback tests: `POIDetailPanel.test.tsx`.

When changing taxonomy versions, review the new dictionary before replacing the projected snapshot. Check value types, enum spellings, labels, segment/order/highlight, action fields, colors and every property/value icon URL. Update the raw fixture values deliberately; do not make mismatched data pass by weakening validation.

Run from the implementation worktree:

```sh
pnpm --filter @kozmos/product-contracts build
pnpm --filter @kozmos/react test
pnpm --filter @kozmos/react build
pnpm --filter @kozmos/react lint
pnpm --filter @kozmos/docs typecheck
pnpm --filter @kozmos/docs build-storybook
# Serve apps/docs/storybook-static on a separate port, then:
STORYBOOK_URL=http://127.0.0.1:6012 pnpm test:poi-details
STORYBOOK_URL=http://127.0.0.1:6012 ADAPTIVE_BROWSER=firefox pnpm test:poi-details
STORYBOOK_URL=http://127.0.0.1:6012 ADAPTIVE_BROWSER=webkit pnpm test:poi-details
pnpm test:owned-css
pnpm packages:install:check
```

## Verification results

- 485 React tests across 114 files pass, including dictionary mapping, false/zero, unknown/prototype keys, invalid types, image failure/retry and explicit monochrome handling.
- 198 Storybook cases pass: 11 examples × two themes × three viewport sizes × Chromium/Firefox/WebKit. No automated accessibility violations or incomplete checks in this matrix.
- Light/dark screenshots inspected; black source assets remain visible through current-color alpha masks.
- Owned CSS passes in all three engines, both complete CSS and with legacy scope rules removed. An existing pressed-button test now leaves hover explicitly and waits for the actual idle color; it no longer samples a transition mid-frame. Expected values were not relaxed.
- React build/lint, Docs typecheck/build, component contract and compiled-class checks pass.
- Installed package checks pass for React 18/19, ESM/CJS, strict Node16/NodeNext and all 82 exact Docs recipes. The installed POI sample exercises asset URLs, monochrome mode, property summaries, tones and price levels.
- The taxonomy source URL/dictionary is absent from the built public React bundle.

This slice does not replace the remaining production-readiness gates or implement live SDK actions, opening-status calculations, persistent saves, routing or native/Vue taxonomy adapters.
