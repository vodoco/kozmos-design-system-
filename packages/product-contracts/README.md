# @kozmos/product-contracts

Platform-neutral presentation contracts for Kozmos map, POI, floor and routing
components: TypeScript types describing what a POI card, a result row or a
travel estimate shows, independently of how any platform draws it.

## Install

```sh
npm install @kozmos/product-contracts
```

## Use

```ts
import type {
  POIPresentation,
  UserLocationState,
} from "@kozmos/product-contracts";
```

The package is types only — it has no runtime code, so `import type` is all it
needs.

## Licence

MIT
