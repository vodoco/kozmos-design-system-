# Documentation

Written 2026-09-13. Current documents first, then the generated data, the parked MAP-595
workstream, and the archive. `ds-handoff.md` is the door in; the checks that keep every number in
these files honest are listed in its §7.

## Start here

| File                         | What it is                                                                                                                                                                        |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ds-handoff.md`              | The handoff for the next session: the scope, the priorities in order, the measured state, what is decided, what is open, and the traps.                                           |
| `agent-switch-2026-09-17.md` | The switch from Claude Code to ChatGPT Astra at `a02a008`: how to pick the work up, the working agreement that made it reliable, and the handback to leave before switching back. |
| `ds-scope-2026-09-12.md`     | What the design system is missing and where the SDK components belong: the 24 Product / SDK sets and the eight missing parts.                                                     |
| `style-playbook.md`          | How to change how Kozmos looks without breaking the agreement between Figma, the web and the two native platforms: roles, cookbook, traps, checks.                                |

## Current

- `browser-compatibility-2026-09-17.md`: reproduced WebKit form-styling blocker,
  real Firefox coverage and the browser/WebView policy needed before a CSS decision.

- `embedding-isolation.md`: scoped ThemeProvider and CSS, automatic portal ownership,
  migration, compatibility decision gate and remaining legacy configuration work.
- `foundation-audit-2026-09-17.md`: the adversarial audit of the first Astra batch,
  reproduced corrections, explicit overlay ownership, verification and remaining release blockers.

- `prepublish-architecture-review-2026-09-17.md`: baseline audit, approved architecture direction,
  publication risks and the phased pre-beta plan.
- `adaptive-map-layout.md`: the first implementation, its coordinate/API contract, migration,
  browser reproduction commands and explicitly unfinished native/device/map-adapter work.

| File                                 | What it is                                                                                                                                                                                                                         |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `product-ui-coverage-2026-09-14.md`  | What the running product draws and how much the design system covers: 13 surfaces, 763,776 nodes, measured over the Figma REST API. The answer to §4.2.                                                                            |
| `poi-detail-card-gaps-2026-09-14.md` | The SDK's `fullPOIDetailCard` rebuilt from Kozmos components only, and everything it could not express. The first component of the §11 loop.                                                                                       |
| `map-mode-toggle-gaps-2026-09-15.md` | The SDK's tracking and step-free map toggles measured against Kozmos, the `emphasis`/`labelPlacement` axes and `revealOnChange` they produced, and the inert opacity modifiers they exposed. The second component of the §11 loop. |
| `gap-audit-2026-09-05.md`            | The gap audit: the POI Details Card Revamp designs and the monorepo, measured — about twenty missing patterns.                                                                                                                     |
| `sdk-module-primitives.md`           | What the SDK modules need from the design system: eleven primitives, ranked.                                                                                                                                                       |
| `nested-radius.md`                   | Concentric corner radii: how a rounded shape hugs the rounded shape inside it. `pnpm tokens:radius:nesting` reports against it.                                                                                                    |
| `generated-color-scales.md`          | Scope for colour ramps that derive from a base. Not started.                                                                                                                                                                       |
| `figma-change-workflow.md`           | Who owns what between code, the token JSON and Figma, and how a change travels between them.                                                                                                                                       |
| `product-sdk-react-handoff.md`       | The React Product / SDK reference implementation and the `@kozmos/product-contracts` models behind it.                                                                                                                             |
| `component-variant-gap-analysis.md`  | Which variant axes and values each platform can express. Its data blocks are written by `pnpm components:variant:write`; `components:variant:check` fails when they are stale. The commentary around them is edited by hand.       |
| `session-handoff.md`                 | The long record, 2026-08-24 to 2026-09-10. Read its §3 for the reasoning behind a specific decision.                                                                                                                               |

## Generated data

Built by a script from the tokens, the packages or the Figma REST API. Regenerate rather than edit.

| File                             | Built by                                                                                                  |
| -------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `figma-foundations-payload.json` | `pnpm figma:foundations` — the variable collections and styles the plugin imports into the Figma library. |
| `figma-library-manifest.json`    | `pnpm figma:manifest` — the tokens, the React components and their Code Connect links as one manifest.    |
| `figma-pointr-icon-catalog.json` | `pnpm figma:icons` — the Pointr icon library, read over REST.                                             |

## Parked: MAP-595

MAP-595 (Easier Content Editing — Part 2) is complete and parked; it is not the design system's
work (`ds-handoff.md` §9). Its record stays at these paths because the files refer to each other by
them.

| File                                     | What it is                                                                    |
| ---------------------------------------- | ----------------------------------------------------------------------------- |
| `map-595-handoff.md`                     | The handoff, written 2026-09-12 and patched on the 13th; its §0 is the start. |
| `map-595-figma-2026-09-07.md`            | The change record for the Figma file `nm6qdzaC9B1lknllbwaMTh`, §1–§199.       |
| `map-595-stories-revision-2026-09-11.md` | The stories' 2026-09-11 revision and every change it caused in the file.      |
| `map-595-file-changes-2026-09-11-pm.md`  | The afternoon of 2026-09-11: every change, and how to redo any of it by hand. |
| `map-595-file-changes-2026-09-12.md`     | The nine open items ruled and applied on 2026-09-12.                          |
| `map-595-assets/`                        | The bitmap pipeline: the 2× source render, `geometry.json`, `retouch-map.py`. |

## Archive

`archive/README.md` lists what is superseded, and by what.
