# Login motion

The login uses one page-load choreography. It has no ambient background animation and nothing
loops. The Pointr Cloud logo remains static while the proposition and authentication form arrive,
then the screen becomes completely still.

## Timeline

| Element         |  Delay | Duration | Movement            |
| --------------- | -----: | -------: | ------------------- |
| Kicker          | 500 ms |   360 ms | 5 px rise and fade  |
| Headline line 1 | 520 ms |   520 ms | 14 px rise and fade |
| Headline line 2 | 590 ms |   520 ms | 14 px rise and fade |
| Sign-in card    | 620 ms |   520 ms | 8 px rise and fade  |
| Headline line 3 | 660 ms |   520 ms | 14 px rise and fade |
| Supporting copy | 800 ms |   420 ms | 5 px rise and fade  |

Everything is settled after 1.22 seconds. The headline uses whole-line fades rather than deep
masks so a paused or captured intermediate frame never shows sliced letterforms.

## Where to make changes

- Page timing, easing and movement: `Login.css`.
- Headline text and deliberate line breaks: `Login.tsx`.
- Static Pointr Cloud artwork: `public/pointr-cloud-logo.svg`.

The page timing variables are grouped at the top of `.ms-login-page`. Change those variables
instead of editing individual animation declarations.

Each headline line has an explicit `--first`, `--second` or `--third` modifier. If the headline
gains or loses a line, update the JSX and its delay token together; do not rely on DOM position.

## Accessibility and performance rules

- `prefers-reduced-motion: reduce` renders the final state immediately. The logo is already static.
- Page durations also multiply by the Kozmos `--motion-duration-scale` token when the full design
  configuration provider supplies it.
- Only `opacity`, `transform` and the small SVG's `stroke-dashoffset` animate. Do not animate layout
  properties such as width, height, margin or top.
- Do not add a permanent `will-change`; this sequence is short and does not justify retaining
  compositor layers after it finishes.
- Keep the background static unless the visual direction changes deliberately. A second unrelated
  loop would compete with the single entrance gesture.

## Integration boundaries

- The application currently imports the authenticated screens into the initial JavaScript bundle,
  and Vite reports an approximately 865 KB minified entry chunk. Splitting the authenticated app
  behind the session boundary would improve the login's cold-start time.
- `index.html` loads Readex Pro from Google Fonts and loads the Pointr WebSDK before authentication.
  Self-hosting the font and loading the SDK only when the map mounts would make first paint less
  dependent on third-party network requests. Those boot changes should be handled as a separate
  task because they affect the authenticated application, not just this screen.

## Verification

Refresh the login URL to replay the sequence. Then run:

```sh
pnpm --filter mapscale-review build
pnpm --filter mapscale-review exec eslint src/screens/Login.tsx
xmllint --noout apps/mapscale-review/public/pointr-cloud-logo.svg
```

Check at minimum 320 px, 390 px, 768 px, 900 px, 901 px, 1024 px and 1440 px widths. The page may
scroll vertically on short mobile/tablet viewports, but it must never overflow horizontally or
push the logo above the scroll origin.
