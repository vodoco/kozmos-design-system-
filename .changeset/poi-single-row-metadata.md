---
"@kozmos-ds/react": patch
---

Compose POI summary facts with the shared MetaStrip instead of a wrapping
duplicate. Keep facts on one keyboard-scrollable row and align icon/text groups
and primary-action text. MetaStrip now owns its CSS and allows its minimum 64px
height to grow with content instead of clipping enlarged text.
