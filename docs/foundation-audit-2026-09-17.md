# Pre-publication foundation: adversarial follow-up audit

2026-09-17 · baseline `b13f4d9`, local branch `astra/prepublish-foundations`.

Olcay requested another extensive audit and continuation. The prior batch was useful but not
complete. This audit found four defect classes in its adaptive implementation, fixed them, and
added explicit overlay-container ownership as the next foundation step. No publication, remote
push, account setting, native source, token definition or Figma node was changed.

## Reproduced and fixed

| Finding                                          | Evidence before the fix                                                                                                              | Correction                                                                                                                                                                   |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Zero-width hosts exposed invisible interaction   | After changing host width to zero, the accessibility tree still contained Search places and Focus map.                               | Track whether geometry has been measured separately from width. Zero width and zero height now both hide unavailable slots without unmounting them.                          |
| Large bottom panels could make controls unusable | In a 390×600 host with fraction 0.88, the panel started at y=72 while the control ended at y=116; its wrapper had no usable height.  | Measure natural chrome height and reserve it before allocating bottom-panel height. The request yields to content constraints; no available panel space is reported as null. |
| Callback payloads were coupled                   | Mutating an inset from one callback changed the object delivered/stored through the other. Tests failed in both callback directions. | Prepare independent padding and layout payloads before calling either consumer. Internal geometry remains independent of consumer mutation.                                  |
| Invalid host inset could erase a valid safe area | CSS top safe area 24 plus host `NaN` produced map y=0.                                                                               | Validate host values before merging with CSS values. Observe the safe-area sentinel's border box so changes are detected without requiring a window resize.                  |

Each failing assertion was run against the implementation before its correction. The geometry
unit test expected a 464px panel after reserving 136px of chrome; it first received 528px.
An additional enlarged-text browser check was green already and is coverage, not a newly fixed
regression. Tests read the built component's actual bounds, computed styles and accessibility
roles, not class-name presence.

The first report's statement that layout tests passed remains true for the original eight cases.
It did not establish these edge cases. `panelFraction` is now documented as a **requested**
fraction, not an unconditional promise that overrides available content space.

## Continued: explicit overlay ownership

`PopoverContent`, `DialogContent`, `DrawerContent`, `MenuContent`, `SelectContent` and
`TooltipContent` now accept `portalContainer`. `BottomSheetContent` inherits it from Drawer.
It is forwarded to Radix's portal, never to an HTML element.

The original six primitive checks all failed: content escaped the requested destination.
After the change, seven overlay types × two placement modes (owned and existing default) pass
in both Chromium and WebKit. They check actual containment, inherited token values, Escape
dismissal and trigger-focus restoration where applicable. Tooltip's old inline default is
preserved; its explicit container opts into portalling. Focus restoration is awaited as an
observable condition, not forced by the test—Select restores it asynchronously after dismissal.

This is a complete explicit-container primitive, **not complete embedding isolation**:

- Omitted props preserve behavior: most overlays portal to the document body; Tooltip stays inline.
- Keep the target stable for an open overlay. Moving an existing portal between containers can
  remount its content; no cross-container state-preservation guarantee is made.
- Use a stable, appropriate overlay layer. A transformed or clipped target can change fixed
  positioning or clip content. Portalling does not cancel the host's CSS geometry.
- CSS custom properties inherit from the destination. Radix logical navigation still needs its
  supported `dir` input on the relevant Root; CSS direction is not a replacement for that.
- Modal focus trapping, document scroll locking and outside-content hiding are still Radix's
  modal semantics. A custom container does not make a dialog modal only inside one widget.
- Nested product compositions do not yet receive an automatic provider-owned destination.
  The scoped-provider work must supply that without adding ad hoc plumbing to every module.

## Verification

Run from the isolated worktree; build before checks that read dist:

```sh
pnpm --filter @kozmos/react build
pnpm --filter @kozmos/react test
pnpm --filter @kozmos/react lint
pnpm test:adaptive
ADAPTIVE_BROWSER=webkit pnpm test:adaptive
pnpm test:overlays
ADAPTIVE_BROWSER=webkit pnpm test:overlays
pnpm components:contract:check
pnpm components:classes:check
pnpm tokens:raw:check
pnpm docs:snippets:check
pnpm components:variant:check
pnpm exec tsx scripts/skills/check-completion.ts --check
pnpm packages:install:check
```

The browser tests bundle public **built workspace package** exports and distributed CSS; they are
not tests of a real map renderer or installed mobile apps. The separate package check installs
tarballs with React 18 and React 19 and type-checks README samples. This distinction matters:
the browser fixture itself uses the workspace React version, not a full browser matrix of peers.

## Still prevents a production-ready claim

1. **Provider and CSS isolation.** ThemeProvider still changes the document globally, has unsafe
   implicit storage and no live system-theme subscription. Light tokens are rooted at `:root`,
   so nested light-in-dark scopes are not a solved contract. Legacy dark-ancestor utility selectors
   can also affect nested light content. Generic utility selectors and Preflight remain global.
   Fix these as one tested isolation contract; a portal destination alone is insufficient.
2. **Native and device behavior.** SwiftUI/Compose have not adopted the new region policy. Preserve
   existing iOS detents and camera inset behavior when doing that. Real keyboards, notches, hinges,
   activity restoration, camera continuity and arbitrarily small custom content remain unproven.
3. **Product proof.** The full POI/routing flows must be rebuilt from installed packages against a
   real Pointr adapter. Fixture slots and component counts cannot establish that readiness.
4. **Known CSS/type debt.** The compiled-class ratchet remains 62 uses / 40 classes / 27 files;
   the install check retains three declaration issues. AdaptiveMapShell's pre-existing inert
   translucent status-background class is among that CSS backlog. This pass did not hide or
   raise either baseline.
5. **Release controls and remote gates.** A valid npm token can still trigger publication of the
   unpublished 0.0.1 versions. The release checkout is not pinned to the triggering tested SHA.
   Do not enable publishing before the separate safeguards/version plan. Remote CI, full
   Storybook/a11y, live Figma and native device checks were not run for this batch.

Recommended next work remains scoped theme/provider/CSS ownership, now using the explicit portal
primitive rather than undocumented body assumptions. Native adaptive parity and actual consumer
proof follow before any beta. The design system is progressing; it is not yet production-ready.
