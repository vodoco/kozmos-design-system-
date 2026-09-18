---
"@kozmos/react": patch
---

Keep scoped preflight at zero specificity so it does not override consumer
heading styles. Move Text and Heading to component-owned typography recipes,
preserving their public type scale and props without requiring native CSS scope.
