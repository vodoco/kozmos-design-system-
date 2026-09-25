---
"@kozmos-ds/product-contracts": minor
"@kozmos-ds/react": minor
---

Show a result's attributes: access restrictions, dietary, accessibility and
services.

Four meanings and one shape — a short localized label with an optional icon —
so they share `poi.services` rather than gaining three more lists.
`POIAttributeKind` says which a chip is, so a card can order, tone or filter
them:

```tsx
services: [
  { id: "1", label: "Vegan", kind: "dietary" },
  { id: "2", label: "Step-free", kind: "accessibility" },
  { id: "3", label: "Takeaway" },
]
```

A restriction is drawn apart from the rest. "Staff only" is not a feature like
"Vegan": it is the reason a visitor cannot go, and a row of identical grey
chips would bury it among the things they can have. It comes first, in the
warning tone, and is folded in from `accessRestrictionsLabel` — which is its
own field rather than a service.

Android and iOS gain the same `kind`, and also `iconUrl` and
`iconMonochrome`, which the web contract had and they did not.
