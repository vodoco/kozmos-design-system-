---
"@kozmos-ds/react": minor
"@kozmos-ds/product-contracts": minor
---

Add the AI Companion parts, and let a selected result offer actions.

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
