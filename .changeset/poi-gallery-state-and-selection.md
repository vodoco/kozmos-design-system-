---
"@kozmos/react": patch
---

Synchronize the media gallery's controlled/default index, keyboard and native
scroll position without scrolling ancestor panels. Preserve selection through
resize and RTL changes, clamp stale indices, localize the controls group, and
give the gallery component-owned CSS. Reset detail scroll when the POI changes
and omit failed logos until their source changes.
Reflow detail summary cells before normal words fragment on narrow hosts.
