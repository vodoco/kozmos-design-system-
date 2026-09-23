---
"@kozmos/react": patch
---

AdaptiveMapShell's bottom sheet eases only between detents — after a new
detent or a drag's release — and takes its first placement and a change of
the host's size at once; it no longer flies in from the shell's top when it
mounts. A panel with no room is hidden again (its flex display had outranked
the `hidden` attribute), and map controls a bottom sheet leaves no band for
are hidden rather than drawn under the sheet, where a keyboard or a screen
reader still reached them; they no longer pad the camera then.
