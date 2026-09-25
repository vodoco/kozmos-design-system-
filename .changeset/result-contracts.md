---
"@kozmos-ds/product-contracts": minor
"@kozmos-ds/react": minor
---

Four result contracts MAP-474 needs, on all three platforms.

**Opening and closing soon.** `POIAvailability` gains `openingSoon` and
`closingSoon`, drawn in a third tone rather than folded into open or closed:
"closing soon" is a reason to hurry or pick somewhere else, and drawing it as
plain open is the difference between arriving and arriving too late. Where the
boundary sits is the product's call.

**Why a result is in the list.** `POIResultMatch` is `exact`, `alternative` or
`unconfirmed`, so the further lists MAP-474 shows under their own headings come
from data rather than from the order a product happened to build. A result also
carries `unitLabel` for venues with units, and `nameLanguage` so an authored
name can be announced in the language it was written in.

**What an empty search means.** `SearchResponsePresentation` carries an
`emptyKind` — no match, filtered out, or nothing mapped — plus `emptiedBy`,
the filter that emptied the list, and `languageFallback` when results came back
in another language. An empty list is not one situation, and "nothing found"
leaves the visitor to guess what to undo.

**Venues without levels.** `floorId` and `floorLabel` are optional on both
`POIPresentation` and `POIResultPresentation`. A single-storey venue where
every result reads "Ground Floor" is noise; the card now draws what is left.

Android and iOS carry the availability change too, and the three enumerations
are compared directly rather than assumed to match.
