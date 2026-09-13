# Figma Legacy Source Review

Generated: 2026-06-14

This note records the current Core boundary after reviewing the repo-backed
audit of older Pointr Figma files and UI kits. Live Figma MCP inspection was
not available in this Codex session, so this review uses the checked-in source
audit, linked manifest, component inventory, and current importer capabilities.

## Sources Already Captured

The existing gap audit references these older design-system and UI-kit files:

- Pointr Cloud Dashboard v9 taxonomy workflow:
  `https://www.figma.com/design/b8dqhE3CPxitYfqlXuQJTC?node-id=15703-113650`
- Pointr Maps Express branded onboarding and welcome flows:
  `https://www.figma.com/design/BwtG2COVRqUWGPrIvP4jxr?node-id=18518-29917`
- Pointr Maps Express theme support:
  `https://www.figma.com/design/BwtG2COVRqUWGPrIvP4jxr?node-id=16415-43319`
- Pointr Maps Express rate-your-experience:
  `https://www.figma.com/design/BwtG2COVRqUWGPrIvP4jxr?node-id=19922-8556`
- Pointr Maps Express logo placement and whitelabeling:
  `https://www.figma.com/design/BwtG2COVRqUWGPrIvP4jxr?node-id=11673-277621`

## Current Conclusion

No additional item should be promoted into Core purely from those older
references at this point.

The repeated domain-neutral needs from the old files are now covered in Core:
buttons, icon buttons, fields, search, select, checkbox, radio, switch, slider,
chip, badge, counter, card, tabs, table, list, drawer, dialog, popover, menu,
tooltip, toast, alert, empty state, avatar, accordion, breadcrumb, pagination,
bottom navigation, navigation item, navbar, sidebar, date/time pickers,
combobox, multiselect, listbox, file upload, color picker, tree, timeline,
scroll area, stepper, rating, layout primitives, and typography/text styles.

The remaining old-file patterns are product, SDK, or form-factor compositions:

- POI cards, route summaries, direction steps, floor selectors, markers, map
  controls, map overlays, route previews, SDK handoff panels, dashboard publish
  modules, taxonomy rows, analytics visuals, whitelabel logo placement, kiosk
  screens, and live-activity style surfaces.

These should be represented as examples or as a separate Product / SDK library,
not as Core component sets. Core should stay portable and domain-neutral.

## Extension Update

The Figma importer now includes richer examples that compose Core primitives
inside product-context screens:

- Operations Console
- SDK Route Flow
- Kiosk Handoff Flow

These templates are intentionally generated on the `Examples` page and do not
create new component sets or Code Connect node requirements.

## Public Design System Recommendation

Going public is optional. The practical benefits are:

- Stronger client trust: customers can inspect the system behind the product.
- Hiring and ecosystem value: designers and engineers see production standards.
- Better accessibility accountability: public docs push consistency.
- Cleaner integration story: Code Connect and package docs become easier to
  explain to partners.
- Internal discipline: public APIs make accidental product-specific Core creep
  easier to spot.

The costs are real:

- Long-term support expectations.
- More careful versioning and deprecation work.
- More review overhead for every component and token.
- Less room to expose Pointr-specific SDK details.
- Some competitive visibility into product UI patterns.

Recommended stance: keep Core public-ready, but keep Product / SDK and
Platform / Form-Factor private unless there is a specific partner or marketing
reason to publish them. This preserves the option to go public without forcing
the SDK-specific library into a public contract.
