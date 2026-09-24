# @kozmos-ds/product-contracts

## 0.2.0

### Minor Changes

- cc3dc32: Add the AI Companion parts, and let a selected result offer actions.

  **The assistant surface.** `AICompanionPanel`, `AIMessageList`, `AIMessage`,
  `UserMessage`, `ActionCard` and `AIInputBar` — the six parts MAP-474 Story 5
  needs. Built to the behaviours rather than to a screen:

  ```tsx
  <AICompanionPanel onClose={close}>
    <AIMessageList>
      <AIMessage>What are you looking for?</AIMessage>
      <UserMessage>Somewhere quiet to work.</UserMessage>
      <AIMessage status="streaming">Looking through this building…</AIMessage>
      <AIMessage actionCard={<ActionCard title="2 results">{rows}</ActionCard>}>
        The closest one is on the second floor.
      </AIMessage>
    </AIMessageList>
    <AIInputBar value={value} onValueChange={setValue} onSubmit={ask} />
  </AICompanionPanel>
  ```

  `AIMessageList` is a polite `role="log"` that follows a reply as it grows, not
  only as turns arrive. `AIMessage` streams its acknowledgement beside the dots,
  because Story 10 counts that as the first visible response, and draws a
  timed-out turn rather than falling silent. `AIInputBar` never emits an empty or
  whitespace-only question and hands over trimmed text. `AICompanionPanel` closes
  on Escape and works with no close button at all, which Story 18 allows.

  No new icon was needed: `Stars01` and `Send01` were already in the package.

  **A notice that is one line until asked.** `Notice` carries the Story 14
  dietary warning above AI-assisted results, where the full legal wording ran to
  four lines — 114px above the results that are the answer.

  ```tsx
  <Notice summary="AI results may be incomplete. Check allergens with the venue.">
    These results are AI-assisted and may be incomplete or out of date…
  </Notice>
  ```

  It is not `Alert` with a flag: an Accordion inside an Alert drew its own
  divider through the middle and barely shrank. Collapsed detail is hidden by the
  `hidden` attribute rather than a class, so it stays hidden when the stylesheet
  does not load and stays out of the accessibility tree either way. A `critical`
  tone with `collapsible={false}` and an `action` slot carries the emergency
  notice — help first, not a result list, so nothing is behind a "More" link.

  **A selected result offers what the product gave it.** `POIResultPresentation`
  gains `actions` and `badge`; `POIResultCard` gains `onAction`, and
  `POIResultList` forwards it.

  ```tsx
  result={{
    selected: true,
    actions: [
      { action: "navigate", label: "Go", primary: true },
      { action: "details", label: "Details" },
      { action: "bookmark", label: "Book" },
    ],
  }}
  ```

  The action row is a sibling of the select button, never inside it: a button
  within a button is invalid, and the browser closes the outer one. `featured`
  stays a boolean — it is set in the CMS and the map marker draws a featured POI
  with its logo — while `badge` carries "Alternative", "Similar", "Close by" in
  the same amber tab, since the label distinguishes them rather than the colour.

  `POIResultAction` is `POIAction | "details"`, kept separate so a detail panel's
  exhaustive maps never have to handle opening themselves.

  **One venue, many branches.** `POIResultGroup` shows one representative and
  folds the rest behind a count of what is HIDDEN — an airport has five Starbucks
  and a visitor asking for coffee wants one row, not five.

  ```tsx
  <POIResultGroup
    items={branches}
    onSelect={select}
    label="Starbucks, 9 results"
  />
  // collapsed: one row + "Show 8 more"   expanded: nine rows + "Hide"
  ```

  Which branch represents the group is the product's choice — nearest by walking
  distance when there is a blue dot, otherwise the current level — so the group
  takes them in the order it should show them and never reorders.

  `POIResultCard` gains `appearance="card" | "row"` for this: a member draws no
  border of its own, because nine bordered cards inside one bordered box reads as
  a mistake, and the container separates them with dividers instead. Nothing in
  the group is specific to a brand; a group is a representative and a remainder,
  as true of "other floors" as of Starbucks.

- 558344b: Take the taxonomy's eight quick-access symbols out of the icon set.

  `TaxonomyAmenitySpaceDesk`, `TaxonomyEntranceExit`, `TaxonomyFoodBeverageSpace`,
  `TaxonomyParkingSpace`, `TaxonomyRetailSpace`, `TaxonomySecuritySpace`,
  `TaxonomyServiceSpaceOffice` and `TaxonomyTransportationSpaceBoardingGate` are
  gone, with their `taxonomy-*` registry names and their Code Connect
  connections. 1183 icons become 1175.

  They were never the design system's to ship. A category symbol belongs to the
  venue's taxonomy, which Pointr publishes and versions on its own cadence;
  an icon here is drawn once and versioned with the components. Carrying both
  meant eight PNGs that went stale the moment a taxonomy release landed.

  Read the artwork from the taxonomy instead. Every quick-access category carries
  its own `iconUrl`, and the panel's `renderIcon` takes whatever you give it:

  ```tsx
  <BrowseCategoriesPanel
    renderIcon={(category) => <img src={category.iconUrl} alt="" aria-hidden />}
  />
  ```

  `CategoryPresentation` now carries `iconUrl` for exactly this - the venue's own
  artwork, beside `iconName` for a design system glyph. `BrowseCategoriesPanel`'s
  `AviationQuickAccess` story reads `quick-access/aviation_customer.json` at
  10.12.0.

  The `Accessibility` and `Utensils` glyphs added in 0.2.0 are unaffected: they
  are drawn here and stay.

## 0.1.0

### Minor Changes

- ddb2656: Align POI navigation typography/icon sizes and compact informational chips with
  the supplied SDK measurements. Reuse Pointr action glyphs and show controlled
  save selection with a themed fill and outline icon. Detail group items now
  accept the existing optional service iconName field; unknown icons preserve text.
- a06ca47: Add optional platform-neutral POI detail sections, summaries, opening hours,
  descriptions, tags and supplementary book/call capabilities. Keep the existing
  required POI action labels unchanged. Update the detail anatomy for wrapping
  titles, optional logos, controlled header save actions and reachable actions.
  Add labelled media-error fallback and remove forced smooth gallery movement.
- eb68e53: Support decorative POI asset icons, generic highlighted properties, semantic metadata tones and price scales. Demonstrate taxonomy-driven attribute labels/icons/order with a pinned Pointr 10.12.0 dictionary outside the public component runtime.
