---
"@kozmos/react": patch
---

The package declares the browsers it actually works in: Chrome and Edge 118,
Safari and iOS 17.4, Firefox 128, Android WebView 118. It declared nothing
before, which promised everything.

The floor is `@scope`, which fences the component styles off from a host page.
A browser below those versions discards the whole block rather than ignoring
the rule, and 955 of the stylesheet's 1,227 rules live inside one. What that
costs is not all or nothing: measured across 43 elements, 30 render identically
without `@scope` and 13 do not — the 31 components carrying their own CSS are
unaffected, the 73 styled by utilities lose their layout and colour.

Declaring it also narrows what autoprefixer emits: `-moz-user-select` and
`-moz-column-gap` go, both unprefixed in Firefox long before 128. Nothing else
in the stylesheet changes, and it is 1,189 bytes smaller.

Lowering the floor is the work of moving the remaining components to owned CSS.
Raising one would be a breaking change, so it starts where the code is.
