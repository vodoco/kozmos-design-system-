---
"@kozmos-ds/react": patch
---

`AISearchButton`'s gradient ring is a band two and a half wide all the way
round. It was drawn as a 43 disc stacked inside a 48 circle, and Chromium
painted the disc's rounded rect about 0.44px right and down of the ring's — at
every device pixel ratio, animated or frozen — so the band ran 1.9 on one side
and 3.1 on the other. WebKit and Firefox drew it evenly, which is why it looked
like nothing, and the only check on it read `offsetWidth` and `offsetLeft` and
called the difference the band.

The band is cut out of the ring itself now, by a radial mask, so nothing else
decides where it ends; the disc behind it moves to inset 2, inside the band, and
is painted first. Measured in the paint on 36 rays at eight device pixels to the
CSS pixel: a spread of 0.24 in Chromium and Firefox and 0.21 in WebKit, against
1.33 before.

No API change: the button is the same 48 circle with the same gradient and the
same turn.
