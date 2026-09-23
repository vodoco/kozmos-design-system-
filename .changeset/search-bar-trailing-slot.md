---
"@kozmos-ds/react": patch
---

`SearchBar` takes a `trailing` slot, and owns the row it makes. The field is as
wide as its container and always has been, so a caller composing the assistant's
button beside it got the field on one line and the button on the next, unless
they happened to know to pass `flex-1` through `containerClassName`. Storybook's
example knew; the reference site's did not, and neither would an integrator's.

```tsx
<SearchBar placeholder="Search this building" trailing={<AISearchButton />} />
```

The row's rules are owned CSS — `.kozmos-search-row` — not utilities, because
the utility layer does not reach a browser without `@scope`, and a promise that
holds only where Tailwind's layer applies is not one. `rowClassName` styles the
row; `containerClassName` still styles the field inside it.

The same slot on SwiftUI (`KozmosSearchBar(text:placeholder:) { … }`) and on
Compose (`trailing = { … }`), where a row never wraps but the one-call form
should be the same shape on every platform. Vue needs nothing: the adapter
already bridges a named slot to the React prop of the same name, so
`<template #trailing>` works.
