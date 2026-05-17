import { b as React, r as reactExports } from './index-BQAR1rgm.js';
import { b as useLayoutEffect2 } from './index-D2TCI6MA.js';

// packages/react/id/src/id.tsx
var useReactId = React[" useId ".trim().toString()] || (() => void 0);
var count = 0;
function useId(deterministicId) {
  const [id, setId] = reactExports.useState(useReactId());
  useLayoutEffect2(() => {
    if (!deterministicId) setId((reactId) => reactId ?? String(count++));
  }, [deterministicId]);
  return deterministicId || (id ? `radix-${id}` : "");
}

export { useId as u };
//# sourceMappingURL=index-BMLFjgP-.js.map
