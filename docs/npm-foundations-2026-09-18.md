# npm foundations continuation — 2026-09-18

User approved continuing the CSS architecture and package-declaration work after
the overnight audit. Implementation: `astra/browser-compatibility` in
`/private/tmp/kozmos-browser-compat.uqPMBD`, starting at `7afe930`. Shared main and
the independently running 6006 preview are not implementation directories.
Local commits only; no push, merge, publication or new browser-support promise.

## Package declarations: resolved

React and icons previously attached a CommonJS-interpreted `.d.ts` graph to both
runtime formats; product-contracts exposed only ESM declarations to CommonJS
type consumers. These were real package-format mismatches, not test exceptions.

The existing Vite declaration tool now bundles each package's public declaration
graph using API Extractor. `scripts/emit-format-declarations.mjs` produces independent
`.d.mts` and `.d.cts` entries from that self-contained bundle. Conditional exports
pair them with ESM and CommonJS runtime files. The legacy `types` field retains
`index.d.ts` for older tooling. Relative declaration dependencies/file references
cause the format-emission step to fail rather than leave a half-converted graph.
Six build tests cover the emitter and these failure cases.

Product-contracts now builds both runtime formats with Vite too; each is intentionally
empty because its API consists of types. This supports normal CommonJS type imports
without claiming runtime values. Package entry names and public types are unchanged;
unexported dist internals were never supported deep-import paths.

This follows TypeScript's requirement that declarations match the runtime module
format: [TypeScript 4.7 guidance](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html).
Bundling uses the existing vite-plugin-dts 3.9.1 toolchain, added to icons/contracts
at the same version. It reports its existing API Extractor/TypeScript version warning;
strict installed-package checks pass. No unrelated toolchain upgrades are included.

### Gates and maintenance

- `pnpm test:declarations`: emitter tests; also wired into CI.
- `pnpm packages:install:check`: all four publishable tarballs, 14 export resolutions,
  four CommonJS loads, SSR Button/Icon, 12 README examples and native Button types.
- The install check now compiles `.mts` **and** `.cts` consumers in both `node16`
  and `nodenext` with `skipLibCheck` **off**, for React 18 and 19. Negative type
  assertions ensure APIs have not silently become `any`.
- `@arethetypeswrong` reports **zero** problems. The three former baseline entries
  were removed only after the report showed them fixed; zero is now enforced.

Build before packing:

```sh
pnpm install --frozen-lockfile
pnpm --filter @kozmos/product-contracts build
pnpm --filter @kozmos/icons build
pnpm --filter @kozmos/react build
pnpm test:declarations
pnpm packages:install:check
```

Build config: `packages/{react,icons,product-contracts}/vite.config.mts`; exports:
their `package.json`; format emission: `scripts/emit-format-declarations.mjs`;
consumer type assertions: `packages/react/tests/types/package-modes.ts`.

## Release status

This closes the declaration blocker, not the whole release. CSS migration, the
manual-review queue, physical-device/browser-floor acceptance, Figma/visual approval
and a real packaged Pointr-module integration remain. Read the overnight guide and
`storybook-manual-review-2026-09-18.md` for the earlier verified baseline and limits.
